import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  HandThumbUpIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { postAPI } from "../../API/apiClient";
import TopPostsTable, {
  type PostRow,
} from "../../components/dashboard/TopPostsTable";
import { toast } from "sonner";
import {
  toApiRegions,
} from "../../utlis/dashboardFilters";
import { useDashboardFilters } from "../../utlis/useDashboardFilters";

const MONTH_META = [
  { full: "June", lbl: "June-26", api: "June-2026" },
  { full: "July", lbl: "July-26", api: "July-2026" },
  { full: "August", lbl: "August-26", api: "August-2026" },
  { full: "September", lbl: "September-26", api: "September-2026" },
  { full: "October", lbl: "October-26", api: "October-2026" },
  { full: "November", lbl: "November-26", api: "November-2026" },
  { full: "December", lbl: "December-26", api: "December-2026" },
] as const;

type MonthlyItem = {
  reach?: number;
  shares?: number;
  comments?: number;
  likes?: number;
};

type SeriesPoint = {
  month: string;
  reach: number;
  share: number;
  comments: number;
  like: number;
};

const toSeries = (m?: Record<string, MonthlyItem>, selected?: string[]): SeriesPoint[] => {
  const list =
    selected && selected.length > 0
      ? MONTH_META.filter((x) => selected.includes(x.lbl))
      : MONTH_META;
  return list.map(({ lbl, api }, i) => {
    const d = m?.[api] ?? {};
    return {
      index: i,
      month: lbl,
      reach: d.reach ?? 0,
      share: d.shares ?? 0,
      comments: d.comments ?? 0,
      like: d.likes ?? 0,
    } as SeriesPoint & { index: number };
  });
};

const Radial = ({
  color,
  value,
  label,
}: {
  color: string;
  value: number;
  label: string;
}) => {
  const size = 74;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
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
            strokeDashoffset={0}
            fill="none"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-bold"
          style={{ color }}
        >
          {value.toLocaleString()}
        </span>
      </div>
      <span className="text-xs font-medium text-slate-600">{label}</span>
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

type HighestReachPost = {
  post_id: string;
  post_url?: string;
  platform?: string;
  reach?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  author_name?: string;
};

type MetricsApiRow = {
  post_id: string;
  author: {
    name: string;
    profile_url?: string;
    url?: string;
  };
  reach: number;
  shares: number;
  comments: number;
  like: number;
  repost: number;
  participant_type?: string;
};

type MetricsResponse = {
  cards?: {
    total_reach?: number;
    total_shares?: number;
    last_updated?: string | null;
    next_refresh?: string | null;
  };
  table?: MetricsApiRow[];
  highest_reach_post?: HighestReachPost | null;
};

type GraphResponse = {
  total_metrics?: {
    total_reach?: number;
    total_shares?: number;
    total_likes?: number;
    total_comments?: number;
  };
  monthly_metrics?: Record<string, MonthlyItem>;
};

type RefreshInfo = {
  lastUpdated: string | null;
  nextRefresh: string | null;
};

const formatMetricDate = (date?: string | null) => {
  if (!date) return "Not available";

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate =
    year && month && day ? new Date(year, month - 1, day) : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RefreshInfoCard = ({ info }: { info: RefreshInfo }) => {
  const items = [
    {
      label: "metrics Last Updated On",
      value: info.lastUpdated ? formatMetricDate(info.lastUpdated) : "Not updated yet",
      icon: CalendarDaysIcon,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      label: "Next Refresh",
      value: formatMetricDate(info.nextRefresh),
      icon: ArrowPathIcon,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
      {items.map((item) => (
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
            <p className="truncate text-sm font-bold text-slate-900">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const CombinedCard = ({
  totalReach,
  totalShare,
  totalLike,
  totalComment,
  data,
  refreshInfo,
}: {
  totalReach: number;
  totalShare: number;
  totalLike: number;
  totalComment: number;
  data: SeriesPoint[];
  refreshInfo: RefreshInfo;
}) => {
  const maxVal = Math.max(
    ...data.flatMap((d) => [d.reach, d.share, d.comments, d.like]),
    0
  );
  const yDomain: [number, number] = [0, maxVal ? maxVal : 10];

  const width = useWindowWidth();
  const sm = width < 1200;
  const fontSize = sm ? 10 : 12;
  const tickH = sm ? 32 : 40;
  const rotationAngle = sm ? -35 : 0;

  return (
    <div className="flex min-w-0 flex-col gap-6 rounded-2xl bg-white p-4 shadow-md shadow-hpBlue/10 sm:p-6">
      <div className="flex flex-wrap items-center justify-around gap-8">
        <Radial color="#6366F1" value={totalReach} label="Total Engagement" />
        <Radial color="#10b981" value={totalShare} label="Total Shares" />
        <Radial color="#f59e0b" value={totalLike} label="Total Likes" />
        <Radial color="#3b82f6" value={totalComment} label="Total Comments" />
      </div>

      <RefreshInfoCard info={refreshInfo} />

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
            <YAxis
              domain={yDomain}
              allowDecimals={false}
              tickFormatter={(v) => v.toLocaleString()}
              tickLine={false}
              axisLine={{ stroke: "#CBD5E1" }}
            />

            <Tooltip
              cursor={{ fill: "#F5F5F5" }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="rounded-md border border-slate-200 bg-white/90 px-3 py-2 shadow">
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="text-sm font-semibold text-indigo-600">
                      Engagement: {payload[0].payload.reach.toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">
                      Shares: {payload[0].payload.share.toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">
                      Comments: {payload[0].payload.comments.toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-amber-600">
                      Likes: {payload[0].payload.like.toLocaleString()}
                    </p>
                  </div>
                ) : null
              }
            />

            <Bar dataKey="reach" name="Reach" fill="#6366F1" barSize={16} radius={[4, 4, 0, 0]} />
            <Bar dataKey="share" name="Shares" fill="#10b981" barSize={16} radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="comments"
              name="Comments"
              fill="#3b82f6"
              barSize={16}
              radius={[4, 4, 0, 0]}
            />
            <Bar dataKey="like" name="Likes" fill="#f59e0b" barSize={16} radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const HighestReachPostCard = ({ post, month }: { post: HighestReachPost | null; month: string }) => {
  if (!post) return null;

  const platformLabel = post.platform
    ? `${post.platform.charAt(0).toUpperCase()}${post.platform.slice(1)}`
    : "Social";

  const statCards = [
    {
      label: "Engagement",
      value: post.reach ?? 0,
      valueClass: "text-indigo-600",
      accentClass: "bg-indigo-500",
      icon: ChartBarIcon,
      iconClass: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Likes",
      value: post.likes ?? 0,
      valueClass: "text-amber-600",
      accentClass: "bg-amber-500",
      icon: HandThumbUpIcon,
      iconClass: "text-amber-600 bg-amber-50",
    },
    {
      label: "Comments",
      value: post.comments ?? 0,
      valueClass: "text-blue-600",
      accentClass: "bg-blue-500",
      icon: ChatBubbleLeftRightIcon,
      iconClass: "text-blue-600 bg-blue-50",
    },
    {
      label: "Shares",
      value: post.shares ?? 0,
      valueClass: "text-emerald-600",
      accentClass: "bg-emerald-500",
      icon: ShareIcon,
      iconClass: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="mb-10 max-w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-hpBlue/10 sm:rounded-[28px]">
      <div className="bg-[linear-gradient(135deg,_rgba(48,86,211,0.08),_rgba(255,255,255,1)_42%,_rgba(16,185,129,0.05))] p-4 sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch xl:justify-between">
          <div className="flex max-w-2xl flex-1 flex-col justify-between gap-3">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-hpBlue/80 px-3 py-2 text-xs font-semibold uppercase text-white shadow-sm">
                Highest Reach Post {month ? `in ${month}` : "Overall"}
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {post.author_name || "Unknown Author"}
                </h3>
                <p className="text-sm text-slate-500">
                  Best performing post for the selected filters.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-2 py-1 font-medium text-xs text-indigo-700 shadow-sm">
                {platformLabel}
              </span>
              {post.post_url ? (
                <a
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold text-hpBlue underline underline-offset-2 transition"
                >
                  View Post
                </a>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
            {statCards.map((item) => (
              <div
                key={item.label}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${item.accentClass}`} />
                <div className="mt-2 flex flex-col items-start justify-between gap-3">
                  <div className={`rounded-xl p-2 ${item.iconClass}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`mt-2 text-3xl font-bold ${item.valueClass}`}>
                      {item.value.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EngagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<PostRow[]>([]);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [totalReach, setTotalReach] = useState(0);
  const [totalShare, setTotalShare] = useState(0);
  const [totalLike, setTotalLike] = useState(0);
  const [totalComment, setTotalComment] = useState(0);
  const { months, regions, countries } = useDashboardFilters();
  const [highestReachPost, setHighestReachPost] = useState<HighestReachPost | null>(null);
  const [refreshInfo, setRefreshInfo] = useState<RefreshInfo>({
    lastUpdated: null,
    nextRefresh: null,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const regionFilters = toApiRegions(regions);
        const [metricsResponses, graphResponses] = await Promise.all([
          postAPI<
            {
              participants: string;
              month: string[];
              region: string[];
              country: string[];
            },
            MetricsResponse
          >("content-engagement-metrics/", {
            participants: "All_participants",
            month: months,
            region: regionFilters,
            country: countries,
          }),
          postAPI<
            {
              participants: string;
              month: string[];
              region: string[];
              country: string[];
            },
            GraphResponse
          >("content-engagement-metrics-graph/", {
            participants: "All_participants",
            month: months,
            region: regionFilters,
            country: countries,
          }),
        ]);

        const rowMap = new Map<string, PostRow>();
        let highestPost: HighestReachPost | null =
          metricsResponses?.highest_reach_post ?? null;
        metricsResponses?.table?.forEach((p) => {
          const prev = rowMap.get(p.post_id);
          if (prev) {
            rowMap.set(p.post_id, {
              ...prev,
              reach: prev.reach + p.reach,
              shares: prev.shares + p.shares,
              comments: prev.comments + p.comments,
              like: prev.like + p.like,
              repost: prev.repost + p.repost,
            });
            return;
          }
          rowMap.set(p.post_id, {
            id: p.post_id,
            author: p.author.name,
            title: `Post by ${p.author.name}`,
            reach: p.reach,
            shares: p.shares,
            profileUrl: p.author.profile_url ?? p.author.url,
            participantType:
              p.participant_type?.toLowerCase() === "internal" ? "internal" : "external",
            comments: p.comments,
            like: p.like,
            repost: p.repost,
          });
        });

        const mergedMetrics: Required<NonNullable<GraphResponse["total_metrics"]>> = {
          total_reach: graphResponses?.total_metrics?.total_reach ?? 0,
          total_shares: graphResponses?.total_metrics?.total_shares ?? 0,
          total_likes: graphResponses?.total_metrics?.total_likes ?? 0,
          total_comments: graphResponses?.total_metrics?.total_comments ?? 0,
        };

        setHighestReachPost(highestPost);
        setRows(Array.from(rowMap.values()).sort((a, b) => b.reach - a.reach));
        setSeries(toSeries(graphResponses?.monthly_metrics, months));
        setTotalReach(mergedMetrics.total_reach);
        setTotalShare(mergedMetrics.total_shares);
        setTotalLike(mergedMetrics.total_likes);
        setTotalComment(mergedMetrics.total_comments);
        setRefreshInfo({
          lastUpdated: metricsResponses?.cards?.last_updated ?? null,
          nextRefresh: metricsResponses?.cards?.next_refresh ?? null,
        });
      } catch (e) {
        toast.error("Failed to load engagement data");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [months, regions, countries]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Content Engagement Metrics</h2>
      </div>

      {loading ? (
        <div className="py-20 text-center">Loading...</div>
      ) : (
        <div className="mb-10">
          <CombinedCard
            totalReach={totalReach}
            totalShare={totalShare}
            totalLike={totalLike}
            totalComment={totalComment}
            data={series}
            refreshInfo={refreshInfo}
          />
        </div>
      )}

      {!loading && (
        <HighestReachPostCard
          post={highestReachPost}
          month={months.length > 0 ? months.join(", ") : ""}
        />
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl font-bold">Content Engagement Metrics per Participant</h2>
      </div>

      <TopPostsTable rows={rows} />
    </>
  );
};

export default EngagementPage;
