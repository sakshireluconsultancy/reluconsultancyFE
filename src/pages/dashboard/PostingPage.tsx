import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowPathIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { postAPI } from "../../API/apiClient";
import { toast } from "sonner";

const MONTH_LIST = [
  { year: 2026, month: "June", label: "Jun-26" },
  { year: 2026, month: "July", label: "Jul-26" },
  { year: 2026, month: "August", label: "Aug-26" },
  { year: 2026, month: "September", label: "Sep-26" },
  { year: 2026, month: "October", label: "Oct-26" },
  { year: 2026, month: "November", label: "Nov-26" },
  { year: 2026, month: "December", label: "Dec-26" },
];

const Radial = ({ pct, color }: { pct: number; color: string }) => {
  const size = 100;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          fill="none"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-xl font-bold"
        style={{ color }}
      >
        {pct.toFixed(0)}%
      </span>
    </div>
  );
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

interface SeriesPoint {
  month: string;
  value: number;
  countryBreakdown: { country: string; posts: number }[];
}

interface PostingGraphYearData {
  total_count: number;
  graph: Record<string, number>;
  monthly_country_breakdown?: Record<string, Record<string, number>>;
}

type RegionTimeUpdate = {
  last_update: string;
  next_update: string;
};

interface PostingGraphResponse {
  data?: Record<string, PostingGraphYearData>;
  region_times_updates?: Record<string, RegionTimeUpdate | null>;
}

const formatTimestamp = (value?: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TooltipBox = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload?: SeriesPoint; value?: number }[];
  label?: string;
}) =>
  active && payload?.length ? (
    (() => {
      const point = payload[0]?.payload;
      if (!point) return null;

      return (
        <div className="max-w-[280px] rounded-md border border-slate-200 bg-white/95 px-3 py-2 shadow">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-lg font-semibold text-slate-900">{point.value.toLocaleString()}</p>
          {point.countryBreakdown.length > 0 && (
            <div className="mt-2 border-t border-slate-200 pt-2">
              {point.countryBreakdown.map((item) => (
                <div
                  key={item.country}
                  className="flex items-center justify-between gap-4 text-xs text-slate-700"
                >
                  <span className="text-left">{item.country}</span>
                  <span className="font-semibold">{item.posts.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })()
  ) : null;

interface GraphCardProps {
  title: string;
  total: number;
  pct: number;
  isTotalPostCard?: boolean;
  color: string;
  data: SeriesPoint[];
  updateInfo?: RegionTimeUpdate | null;
}

const GraphCard = ({
  title,
  total,
  pct,
  color,
  data,
  isTotalPostCard,
  updateInfo,
}: GraphCardProps) => {
  const localMax = Math.max(...data.map((d) => d.value), 0);
  const yDomain: [number, number] = [0, localMax ? Math.ceil(localMax * 1.1) : 10];

  const width = useWindowWidth();
  const smScreen = width < 1200;
  const fontSize = smScreen ? 10 : 12;
  const tickH = smScreen ? 32 : 40;
  const rotationAngle = smScreen ? -35 : 0;

  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-gray bg-white p-4 shadow-md shadow-hpBlue/10 sm:p-6">
      <div className="flex min-w-0 flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col items-center justify-center gap-2 lg:w-1/3">
          {isTotalPostCard ? (
            <span
              className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-[12px] p-4 text-xl font-bold"
              style={{ borderColor: color, color }}
            >
              {total.toLocaleString()}
            </span>
          ) : (
            <>
              <Radial pct={pct} color={color} />
              <span className="text-3xl font-bold tabular-nums">{total.toLocaleString()}</span>
            </>
          )}
          <p className="text-sm font-semibold">{title}</p>
        </div>

        <div className="h-60 w-full lg:w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                interval={0}
                angle={rotationAngle}
                tick={{ fontSize, textAnchor: "end" }}
                height={tickH}
                axisLine={{ stroke: "#CBD5E1" }}
                tickLine={false}
              />
              <YAxis
                domain={yDomain}
                allowDecimals={false}
                tickFormatter={(v) => v.toLocaleString()}
                tickLine={false}
                axisLine={{ stroke: "#CBD5E1" }}
              />
              <Tooltip content={<TooltipBox />} cursor={{ fill: "#F5F5F5" }} />
              <Bar dataKey="value" fill={color} barSize={32} radius={[4, 4, 0, 0]} />
              <Line
                dataKey="value"
                stroke="#ff5050"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {updateInfo !== undefined && (
        <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
          {[
            {
              label: "Last updated",
              value: formatTimestamp(updateInfo?.last_update),
              icon: CalendarDaysIcon,
            },
            {
              label: "Next refresh",
              value: formatTimestamp(updateInfo?.next_update),
              icon: ArrowPathIcon,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2"
            >
              <item.icon className="h-5 w-5 shrink-0" style={{ color }} />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase text-slate-500">
                  {item.label}
                </p>
                <p className="truncate text-xs font-semibold text-slate-700">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const mapToSeries = (
  apiData?: Record<string, PostingGraphYearData>
): SeriesPoint[] => {
  const toTitleCase = (value: string) =>
    value
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const toCountryBreakdown = (breakdown?: Record<string, number>) =>
    Object.entries(breakdown ?? {})
      .map(([regionCountry, posts]) => {
        const parts = regionCountry.split(",").map((part) => part.trim());
        const countryRaw = parts[1] ?? parts[0] ?? regionCountry;
        return {
          country: toTitleCase(countryRaw),
          posts: Number(posts ?? 0),
        };
      })
      .sort((a, b) => b.posts - a.posts);

  return MONTH_LIST.map(({ year, month, label }) => ({
    month: label,
    value: Number(apiData?.[year]?.graph?.[month] ?? 0),
    countryBreakdown: toCountryBreakdown(
      apiData?.[year]?.monthly_country_breakdown?.[month]
    ),
  }));
};

const PostingPage = () => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<
    {
      title: string;
      total: number;
      color: string;
      data: SeriesPoint[];
      updateInfo?: RegionTimeUpdate | null;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        type PostingPayload = {
          participants: string;
          month: string[];
          region: string;
          country: string;
        };

        const fetchByRegion = (region: string) =>
          postAPI<PostingPayload, PostingGraphResponse>("posting-metrics-channel-graph/", {
            participants: "All_participants",
            month: [],
            region,
            country: "",
          });

        const [totalRes, gaiRes, emeaRes, amsRes] = await Promise.all([
          fetchByRegion(""),
          fetchByRegion("GAI"),
          fetchByRegion("EMEA"),
          fetchByRegion("AMS"),
        ]);

        const getTotalCount = (response?: PostingGraphResponse) =>
          Object.values(response?.data ?? {}).reduce(
            (sum, yearData) => sum + (yearData.total_count ?? 0),
            0
          );
        const getRegionUpdate = (
          response: PostingGraphResponse | undefined,
          region: "GAI" | "AMS" | "EMEA"
        ) => response?.region_times_updates?.[region] ?? null;

        setCards([
          {
            title: "Global Total Posts",
            total: getTotalCount(totalRes),
            color: "#0ea5e9",
            data: mapToSeries(totalRes?.data),
          },
          {
            title: "GAI",
            total: getTotalCount(gaiRes),
            color: "#2563eb",
            data: mapToSeries(gaiRes?.data),
            updateInfo: getRegionUpdate(gaiRes, "GAI"),
          },
            {
            title: "AMS",
            total: getTotalCount(amsRes),
            color: "#f59e0b",
            data: mapToSeries(amsRes?.data),
            updateInfo: getRegionUpdate(amsRes, "AMS"),
          },
          {
            title: "EMEA",
            total: getTotalCount(emeaRes),
            color: "#10b981",
            data: mapToSeries(emeaRes?.data),
            updateInfo: getRegionUpdate(emeaRes, "EMEA"),
          },
        
        ]);
      } catch (e) {
        toast.error("Failed to load posting data");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <h2 className="text-xl font-bold">Posting Metrics Overview</h2>

      {loading ? (
        <div className="py-20 text-center">Loading...</div>
      ) : (
        <div className="flex flex-col gap-10">
          {cards.map((card) => (
            <GraphCard
              key={card.title}
              title={card.title}
              isTotalPostCard
              total={card.total}
              pct={0}
              color={card.color}
              data={card.data}
              updateInfo={card.updateInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostingPage;
