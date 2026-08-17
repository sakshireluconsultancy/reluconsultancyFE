import { useEffect, useMemo, useState } from "react";
import { postAPI } from "../../API/apiClient";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DASHBOARD_MONTH_OPTIONS,
  STATISTICS_MONTH_FILTER_OPTIONS,
  toApiRegions,
} from "../../utlis/dashboardFilters";
import { useDashboardFilters } from "../../utlis/useDashboardFilters";
import HeaderInfoTooltip from "../../components/dashboard/HeaderInfoTooltip";

interface MonthlyStatistics {
  participants: number;
  percentage_change_in_posts: number;
  post_count: number;
  reach: number;
}

interface StatisticsData {
  Internal?: Record<string, MonthlyStatistics | number>;
  External?: Record<string, MonthlyStatistics | number>;
  last_updated?: string | null;
  next_refresh?: string | null;
}

type RefreshInfo = {
  lastUpdated: string | null;
  nextRefresh: string | null;
};

const useWindowWidth = () => {
  const [w, setW] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return w;
};

const isMonthlyStats = (value: unknown): value is MonthlyStatistics =>
  Boolean(
    value &&
    typeof value === "object" &&
    "participants" in value &&
    "post_count" in value &&
    "reach" in value
  );

const monthToLabel = (apiKey: string) => {
  const [name, year] = apiKey.split("-");
  return `${name}-${year.slice(-2)}`;
};

const formatMetricDate = (value?: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const visibleDashboardMonths = new Set<string>(DASHBOARD_MONTH_OPTIONS);

const toMonthDate = (apiKey: string) => {
  const [name, year] = apiKey.split("-");
  return new Date(`${name} 1, ${year}`).getTime();
};

const StatsGraphCard = ({
  data,
  refreshInfo,
}: {
  data: { month: string; totalPosts: number; totalReach: number }[];
  refreshInfo: RefreshInfo;
}) => {
  const width = useWindowWidth();
  const sm = width < 1200;
  const fontSize = sm ? 10 : 12;
  const tickH = sm ? 32 : 40;
  const rotationAngle = sm ? -35 : 0;

  return (
    <div className="flex min-w-0 flex-col gap-6 rounded-2xl bg-white p-4 shadow-md shadow-hpBlue/10 sm:p-6">
      <div className="grid gap-3 border-b border-slate-100 pb-4 sm:grid-cols-2">
        {[
          {
            label: "Metrics Last Updated On",
            value: formatMetricDate(refreshInfo.lastUpdated),
            icon: CalendarDaysIcon,
            iconClass: "bg-blue-50 text-blue-600",
          },
          {
            label: "Next Refresh",
            value: formatMetricDate(refreshInfo.nextRefresh),
            icon: ArrowPathIcon,
            iconClass: "bg-emerald-50 text-emerald-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3"
          >
            <div className={`shrink-0 rounded-lg p-2 ${item.iconClass}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-slate-500">
                {item.label}
              </p>
              <p className="truncate text-sm font-bold text-slate-900">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="month"
              interval={0}
              angle={rotationAngle}
              tick={{ fontSize, textAnchor: rotationAngle ? "end" : "middle" }}
              height={tickH}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={false}
            />
            <YAxis yAxisId="left" allowDecimals={false} />
            <YAxis
              yAxisId="right"
              orientation="right"
              allowDecimals={false}
              domain={[0, (max: number) => Math.ceil(max * 1.15)]}
            />

            <Tooltip />
            <Legend verticalAlign="top" align="right" />

            <Bar
              dataKey="totalPosts"
              name="Total Posts"
              fill="#2563eb"
              barSize={24}
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalReach"
              name="Total Engagement"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatisticsPage = () => {
  const { months, regions, countries } = useDashboardFilters({
    monthOptions: STATISTICS_MONTH_FILTER_OPTIONS,
  });
  const [monthlyStats, setMonthlyStats] = useState<StatisticsData | null>(null);
  const [refreshInfo, setRefreshInfo] = useState<RefreshInfo>({
    lastUpdated: null,
    nextRefresh: null,
  });

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const response = await postAPI<
        {
          month: string[];
          participants: string;
          region: string[];
          country: string[];
        },
        StatisticsData
      >("monthly-statistics/", {
        month: months,
        participants: "All_participants",
        region: toApiRegions(regions),
        country: countries,
      });

      if (!response) {
        setMonthlyStats(null);
        setRefreshInfo({ lastUpdated: null, nextRefresh: null });
        return;
      }
      setMonthlyStats(response);
      setRefreshInfo({
        lastUpdated: response.last_updated ?? null,
        nextRefresh: response.next_refresh ?? null,
      });
    };

    fetchMonthlyData();
  }, [months, regions, countries]);

  const tableRows = useMemo(() => {
    if (!monthlyStats) return [];

    const internal = monthlyStats.Internal ?? {};
    const external = monthlyStats.External ?? {};

    const monthKeys = new Set<string>();
    Object.entries(internal).forEach(([k, v]) => {
      if (isMonthlyStats(v)) monthKeys.add(k);
    });
    Object.entries(external).forEach(([k, v]) => {
      if (isMonthlyStats(v)) monthKeys.add(k);
    });

    return Array.from(monthKeys)
      .sort((a, b) => toMonthDate(a) - toMonthDate(b))
      .filter((apiMonth) => visibleDashboardMonths.has(monthToLabel(apiMonth)))
      .map((apiMonth) => {
        const internalMonth = internal[apiMonth];
        const externalMonth = external[apiMonth];
        const i = isMonthlyStats(internalMonth)
          ? internalMonth
          : { participants: 0, post_count: 0, percentage_change_in_posts: 0, reach: 0 };
        const e = isMonthlyStats(externalMonth)
          ? externalMonth
          : { participants: 0, post_count: 0, percentage_change_in_posts: 0, reach: 0 };

        return {
          apiMonth,
          monthLabel: monthToLabel(apiMonth),
          participants: i.participants + e.participants,
          postCount: i.post_count + e.post_count,
          percentageChangeInPosts:
            i.percentage_change_in_posts + e.percentage_change_in_posts,
          engagement: i.reach + e.reach,
        };
      });
  }, [monthlyStats]);

  const chartRows = useMemo(
    () =>
      tableRows.map((row) => ({
        month: row.monthLabel,
        totalPosts: row.postCount,
        totalReach: row.engagement,
      })),
    [tableRows]
  );

  const totals = useMemo(() => {
    return tableRows.reduce(
      (acc, row) => ({
        participants: acc.participants + row.participants,
        postCount: acc.postCount + row.postCount,
        engagement: acc.engagement + row.engagement,
      }),
      {
        participants: 0,
        postCount: 0,
        engagement: 0,
      }
    );
  }, [tableRows]);

  return (
    <>
      <div>
        <div className="mb-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-xl font-bold">Statistics Metrics</h1>
          </div>

          <div className="mb-10">
            <StatsGraphCard data={chartRows} refreshInfo={refreshInfo} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold">Statistics Details</h1>
      </div>

      <div className="max-w-full overflow-x-auto rounded-xl bg-white shadow-md shadow-hpBlue/10">
        <table className="min-w-[680px] text-sm font-medium text-slate-700 lg:min-w-full">
          <thead className="sticky top-0 z-10 bg-hpBlue text-sm text-white shadow-sm shadow-hpBlue/10">
            <tr>
              <th rowSpan={2} className="border-r bg-[#003399]">
                Month / Quarter
              </th>
              <th colSpan={4} className="border bg-[#3366E6] py-2">
                Participants Stats
              </th>
            </tr>
            <tr>
              <th className="bg-[#3366E6] py-2"># Participant</th>
              <th className="border-l bg-[#3366E6] py-2">Post</th>
              <th className="border-l bg-[#3366E6] py-2">
                <span className="inline-flex items-center justify-center gap-1">
                  % Change in Posts
                  <HeaderInfoTooltip text="percent_change = ((current month total post - prev_month_no_of_posts) / prev_month_no_of_posts) * 100)" />
                </span>
              </th>
              <th className="border-l bg-[#3366E6] py-2">Engagement</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, idx) => (
              <tr key={row.apiMonth} className={idx % 2 === 0 ? "bg-white" : "bg-slate-200"}>
                <td className="px-6 py-3 text-center">{row.monthLabel}</td>
                <td className="px-6 py-3 text-center">{row.participants}</td>
                <td className="px-6 py-3 text-center">{row.postCount}</td>
                <td
                  className={`px-6 py-3 text-center font-semibold ${row.percentageChangeInPosts > 0
                      ? "text-green-600"
                      : row.percentageChangeInPosts < 0
                        ? "text-red-600"
                        : ""
                    }`}
                >
                  {row.percentageChangeInPosts}%
                </td>
                <td className="px-6 py-3 text-center">{row.engagement}</td>
              </tr>
            ))}
            <tr className="bg-white font-semibold">
              <td className="px-6 py-3 text-center">Total</td>
              <td className="px-6 py-3 text-center">{totals.participants}</td>
              <td className="px-6 py-3 text-center">{totals.postCount}</td>
              <td className="px-6 py-3 text-center">-</td>
              <td className="px-6 py-3 text-center">{totals.engagement}</td>
            </tr>
            {tableRows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No statistics found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StatisticsPage;
