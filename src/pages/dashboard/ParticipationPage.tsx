import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  GlobeAltIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  type ComponentType,
  type CSSProperties,
  useEffect,
  useMemo,
  useState,
} from "react";
import ParticipationTable, {
  type ParticipationRow as BaseRow,
} from "../../components/dashboard/ParticipationTable";
import { postAPI } from "../../API/apiClient";
import { toast } from "sonner";
import { useDashboardFilters } from "../../utlis/useDashboardFilters";
import { toApiRegions } from "../../utlis/dashboardFilters";

type Participant = {
  user: string;
  user_id: string;
  followers?: number;
  post_count: number;
  weekly_consistency: number;
  weekly_intensity?: number;
};

type RegionTimeUpdate = {
  last_update: string;
  next_update: string;
};

type WeeklyConsistencyRefresh = {
  last_refresh?: string | null;
  next_refresh?: string | null;
};

interface MetricsResponse {
  channel_partner_participation_rate: string;
  internal_team_participation_rate: string;
  total_number_of_participants?: number;
  total_number_of_posting_participants?: number;
  region_member_counts?: Record<string, number>;
  region_wise_posting_participants?: Record<string, number>;
  region_times_updates?: Record<string, RegionTimeUpdate | null>;
  weekly_consistency_refresh?: WeeklyConsistencyRefresh | null;
  weekly_consistency_timestamps?: WeeklyConsistencyRefresh | null;
  last_refresh?: string | null;
  next_refresh?: string | null;
  participation_by_countries: {
    [country: string]: { participants: Participant[] };
  };
}

type ParticipationFiltersPayload = {
  month: string[];
  participants: string;
  region: string[];
  country: string[];
};

type ParticipationRow = BaseRow & {
  region: "internal" | "partner" | "unknown";
};

const parseRatio = (r: string) => {
  const [n, d] = r.split("/").map(Number);
  return { n: Number.isNaN(n) ? 0 : n, d: Number.isNaN(d) ? 0 : d };
};

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

const REGION_CARD_META = {
  asia: {
    icon: SparklesIcon,
    accentColor: "#7438c6",
    badgeClassName: "bg-purple-50 text-purple-700",
    label: "GAI",
    valueColor: "text-purple-700",
  },
  ams: {
    icon: ChartBarIcon,
    accentColor: "#ff3030",
    badgeClassName: "bg-red-50 text-red-600",
    label: "AMS",
    valueColor: "text-red-600",
  },
  europe: {
    icon: GlobeAltIcon,
    accentColor: "#109b8c",
    badgeClassName: "bg-teal-50 text-teal-600",
    label: "EMEA",
    valueColor: "text-teal-600",
  },
} as const;

const ProgressRing = ({
  pct,
  color = "#0b57d0",
  size = 64,
  stroke = 8,
  showCaption = true,
  centerValue,
  centerLabel = "Progress",
}: {
  pct: number;
  color?: string;
  size?: number;
  stroke?: number;
  showCaption?: boolean;
  centerValue?: string | number;
  centerLabel?: string;
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.max(0, Math.min(100, pct));
  const offset = circumference * (1 - normalized / 100);
  const displayValue = centerValue ?? `${Math.round(normalized)}%`;

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e6e9ef"
          strokeWidth={stroke}
          fill="none"
        />
        {normalized > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="none"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold leading-none sm:text-[26px]" style={{ color }}>
          {displayValue}
        </span>
        {showCaption && (
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.08em]" style={{ color }}>
            {centerLabel}
          </span>
        )}
      </div>
    </div>
  );
};

const MetricPill = ({
  icon: Icon,
  value,
  target,
  label,
  color,
}: {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  value: number;
  target: number;
  label: string;
  color: string;
}) => (
  <div className="grid gap-2 sm:grid-cols-[minmax(168px,168px)_1fr] sm:items-center">
    <div className="inline-flex min-h-[52px] w-fit min-w-[160px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
      <Icon className="h-6 w-6 shrink-0" style={{ color }} />
      <span className="text-[26px] font-bold leading-none" style={{ color }}>
        {value.toLocaleString()}
      </span>
      <span className="text-sm font-semibold text-slate-500">
        out of {target.toLocaleString()}
      </span>
    </div>
    <span className="text-sm font-semibold text-slate-600 sm:text-base">
      {label}
    </span>
  </div>
);

const RegionMetricCard = ({
  registered,
  posted,
  label,
  accentColor,
  // badgeClassName,
  // icon: HeaderIcon,
  updateInfo,
  valueClassName,
}: {
  registered: number;
  posted: number;
  target: number;
  label: string;
  accentColor: string;
  badgeClassName: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  updateInfo?: RegionTimeUpdate | null;
  valueClassName: string;
}) => {
  const targetLabel = label === "AMS" ? 63 : label === "EMEA" ? 0 : 42;
  const pct = targetLabel > 0 ? (registered / targetLabel) * 100 : 0;
  const timestampItems = [
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
  ];

  return (
    <div className="min-h-[222px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/70">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-center gap-4">
          {/* <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${badgeClassName}`}>
            <HeaderIcon className="h-7 w-7" />
          </span> */}
          <p className="text-xl font-bold leading-tight text-slate-950">{label}</p>
        </div>

        <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4">
            <MetricPill
              icon={UserGroupIcon}
              value={registered}
              target={targetLabel}
              label="Registered participants"
              color={accentColor}
            />
            <MetricPill
              icon={PaperAirplaneIcon}
              value={posted}
              target={targetLabel}
              label="Participants posted"
              color={accentColor}
            />
          </div>

          <div className={`flex justify-center ${valueClassName}`}>
            <ProgressRing
              pct={pct}
              color={accentColor}
              size={118}
              stroke={9}
              centerValue={registered.toLocaleString()}
              centerLabel="Total"
            />
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
          {timestampItems.map((item) => (
            <div
              key={item.label}
              className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2"
            >
              <item.icon
                className="h-5 w-5 shrink-0"
                style={{ color: accentColor }}
              />
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
      </div>
    </div>
  );
};

const WeeklyConsistencyRefreshCard = ({
  refreshInfo,
}: {
  refreshInfo: WeeklyConsistencyRefresh | null;
}) => {
  const items = [
    {
      label: "Weekly consistency last updated",
      value: formatTimestamp(refreshInfo?.last_refresh),
      icon: CalendarDaysIcon,
    },
    {
      label: "Weekly consistency next refresh",
      value: formatTimestamp(refreshInfo?.next_refresh),
      icon: ArrowPathIcon,
    },
  ];

  return (
    <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm shadow-hpBlue/10 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2"
        >
          <item.icon className="h-5 w-5 shrink-0 text-hpBlue" />
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
  );
};

const ParticipationPage = () => {
  const { months, regions, countries } = useDashboardFilters();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ParticipationRow[]>([]);
  const [rateInt, setRateInt] = useState("0/0");
  const [rateExt, setRateExt] = useState("0/0");
  const [regionCounts, setRegionCounts] = useState<Record<string, number>>({});
  const [regionPostingCounts, setRegionPostingCounts] = useState<Record<string, number>>({});
  const [regionTimeUpdates, setRegionTimeUpdates] = useState<
    Record<string, RegionTimeUpdate | null>
  >({});
  const [weeklyConsistencyRefresh, setWeeklyConsistencyRefresh] =
    useState<WeeklyConsistencyRefresh | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalPostingParticipants, setTotalPostingParticipants] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await postAPI<ParticipationFiltersPayload, MetricsResponse>(
          "participation-metrics",
          {
            month: months,
            participants: "All_participants",
            region: toApiRegions(regions),
            country: countries,
          }
        );

        if (!data) {
          toast.error("Failed to fetch participation data");
          setRows([]);
          setRateInt("0/0");
          setRateExt("0/0");
          setRegionCounts({});
          setRegionPostingCounts({});
          setRegionTimeUpdates({});
          setWeeklyConsistencyRefresh(null);
          setTotalParticipants(0);
          setTotalPostingParticipants(0);
          return;
        }

        const internalRatio = parseRatio(data.internal_team_participation_rate ?? "0/0");
        const partnerRatio = parseRatio(data.channel_partner_participation_rate ?? "0/0");
        const mergedRegionCounts = { ...(data.region_member_counts ?? {}) };
        const mergedRegionPostingCounts = {
          ...(data.region_wise_posting_participants ?? {}),
        };
        const rowMap = new Map<string, ParticipationRow>();
        const flat: ParticipationRow[] = [];
        setTotalParticipants(data.total_number_of_participants ?? 0);
        setTotalPostingParticipants(data.total_number_of_posting_participants ?? 0);

        Object.entries(data.participation_by_countries ?? {}).forEach(
          ([country, val]) => {
            val.participants.forEach((member) => {
              const row: ParticipationRow = {
                user: member.user,
                userId: member.user_id,
                followers: member.followers ?? 0,
                posts: member.post_count,
                consistencyPct: member.weekly_consistency,
                country,
                region: "unknown",
              };
              const key = `${row.userId}-${country}`;
              if (rowMap.has(key)) {
                const prev = rowMap.get(key)!;
                rowMap.set(key, {
                  ...prev,
                  posts: prev.posts + row.posts,
                  followers: Math.max(prev.followers ?? 0, row.followers ?? 0),
                  consistencyPct:
                    Math.round(((prev.consistencyPct + row.consistencyPct) / 2) * 100) / 100,
                });
              } else {
                rowMap.set(key, row);
              }
            });
          }
        );

        rowMap.forEach((row) => flat.push(row));
        setRateInt(`${internalRatio.n}/${internalRatio.d}`);
        setRateExt(`${partnerRatio.n}/${partnerRatio.d}`);
        setRegionCounts(mergedRegionCounts);
        setRegionPostingCounts(mergedRegionPostingCounts);
        setRegionTimeUpdates(data.region_times_updates ?? {});
        setWeeklyConsistencyRefresh(
          data.weekly_consistency_refresh ??
            data.weekly_consistency_timestamps ??
            (data.last_refresh || data.next_refresh
              ? {
                last_refresh: data.last_refresh,
                next_refresh: data.next_refresh,
              }
              : null)
        );
        setRows(flat);
      } catch (err) {
        toast.error("Failed to fetch participation data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [months, regions, countries]);

  const totalRatio = useMemo(() => {
    const a = parseRatio(rateExt);
    const b = parseRatio(rateInt);
    return `${a.n + b.n}/${a.d + b.d}`;
  }, [rateExt, rateInt]);
  const totalRatioParsed = useMemo(() => parseRatio(totalRatio), [totalRatio]);
  const totalPct = useMemo(
    () =>
      totalRatioParsed.d > 0 ? (totalRatioParsed.n / totalRatioParsed.d) * 100 : 0,
    [totalRatioParsed]
  );

  // const total_number_of_posting_participants = 

  const filteredRows = useMemo(
    () => rows.filter((r) => r.user.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  const regionCardRows = useMemo(() => {
    const orderedRegions = ["GAI", "AMS", "EMEA", "Asia", "Ams", "Europe"];
    const existing = new Set([
      ...Object.keys(regionCounts),
      ...Object.keys(regionPostingCounts),
    ]);
    const remaining = Array.from(existing).filter((k) => !orderedRegions.includes(k));
    return [...orderedRegions, ...remaining]
      .filter((name) => existing.has(name))
      .map((name) => ({
        name,
        registered: regionCounts[name] ?? 0,
        posted: regionPostingCounts[name] ?? 0,
      }));
  }, [regionCounts, regionPostingCounts]);

  const toRegionMetaKey = (name: string): keyof typeof REGION_CARD_META => {
    const normalized = name.trim().toLowerCase();
    if (normalized === "asia" || normalized === "gai") return "asia";
    if (normalized === "ams") return "ams";
    if (normalized === "europe" || normalized === "emea") return "europe";
    return "asia";
  };

  return (
    <>
      <h2 className="mb-8 text-xl font-bold">Participation Metrics</h2>

      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <div className="min-h-[222px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/70">
          <div className="flex h-full flex-col gap-5">
            <div className="flex items-center gap-4">
              {/* <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <GlobeAltIcon className="h-7 w-7" />
              </span> */}
              <p className="text-xl font-bold leading-tight text-slate-950">
                Global Participation vs Target
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-col gap-4">
                <MetricPill
                  icon={UserGroupIcon}
                  value={totalParticipants}
                  target={42 + 63}
                  label="Registered participants"
                  color="#0b57d0"
                />
                <MetricPill
                  icon={PaperAirplaneIcon}
                  value={totalPostingParticipants}
                  target={42 + 63}
                  label="Participants posted"
                  color="#0b57d0"
                />
              </div>

              <div className="flex justify-center">
                <ProgressRing
                  pct={totalPct}
                  color="#0b57d0"
                  size={118}
                  stroke={9}
                  centerLabel="Progress"
                />
              </div>
            </div>
          </div>
        </div>

        {regionCardRows.map(({ name, registered, posted }) => {
          const key = toRegionMetaKey(name);
          const meta = REGION_CARD_META[key];
          return (
            <div key={name}>
              <RegionMetricCard
                registered={registered}
                posted={posted}
                target={totalRatioParsed.d}
                label={meta.label}
                accentColor={meta.accentColor}
                badgeClassName={meta.badgeClassName}
                icon={meta.icon}
                updateInfo={regionTimeUpdates[meta.label]}
                valueClassName={meta.valueColor}
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 items-center justify-between flex-wrap mb-8">
        <h2 className="mb-0 text-xl font-bold">Posts per Participant</h2>
        <div className="w-full xl:max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participant..."
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-sm transition hover:border-slate-400 focus:border-hpBlue focus:ring-2 focus:ring-hpBlue/20"
          />
        </div>
      </div>
      <p className="mb-4 text-xs text-slate-500">Use sidebar filters to refine month, region, and country.</p>
      <WeeklyConsistencyRefreshCard refreshInfo={weeklyConsistencyRefresh} />

      {loading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : (
        <ParticipationTable
          month={months}
          rows={filteredRows}
          is_original={undefined}
        />
      )}
    </>
  );
};

export default ParticipationPage;
