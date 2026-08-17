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
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { postAPI } from "../../API/apiClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* -------- month map & order ------------------------------------ */
const MONTHS = [
  { full: "June-2026", label: "Jun-26" },
  { full: "July-2026", label: "Jul-26" },
  { full: "August-2026", label: "Aug-26" },
  { full: "September-2026", label: "Sep-26" },
  { full: "October-2026", label: "Oct-26" },
  { full: "November-2026", label: "Nov-26" },
  { full: "December-2026", label: "Dec-26" },
];

/* -------- responsive width hook -------------------------------- */
const useWindowWidth = () => {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
};

/* -------- tooltip ---------------------------------------------- */
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) =>
  active && payload?.length ? (
    <div className="rounded-md border border-slate-200 bg-white/90 px-3 py-2 shadow">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  ) : null;

/* ================================================================= */
const KpiDetail = () => {
  /* ---------- routing params / audience -------------------------- */
  const { id } = useParams(); // partner-part | internal-part | total-part
  const [sp] = useSearchParams();
  void sp;
  const audience =
    "All_participants";

  /* ---------- state --------------------------------------------- */
  const [series, setSeries] = useState<
    { month: string; participants: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  /* ---------- fetch --------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await postAPI<
          { participants: string },
          { graph: Record<string, number> }
        >("participation-metrics-channel-graph/", {
          participants: audience,
        });

        if (!res?.graph) {
          toast.error("Failed to load KPI trend");
          return;
        }

        /* build series in fixed order so X-axis is consistent */
        const s = MONTHS.map(({ full, label }) => ({
          month: label,
          participants: Number(res.graph[full] ?? 0),
        }));
        setSeries(s);
      } catch (e) {
        toast.error("Failed to load KPI trend");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [audience]);

  /* ---------- latest / delta ------------------------------------ */
  const now = new Date();
  const curLbl =
    now.toLocaleString("en-US", { month: "short" }) +
    `-${String(now.getFullYear()).slice(-2)}`;
  const curIdx = series.findIndex((d) =>
    d.month.startsWith(curLbl.slice(0, 3))
  );
  const latest = curIdx !== -1 ? series[curIdx].participants : 0;
  const prev = curIdx > 0 ? series[curIdx - 1].participants : latest;
  const delta = latest - prev;

  /* ---------- dynamic Y-domain ---------------------------------- */
  const maxVal = Math.max(...series.map((d) => d.participants), 0);
  const yDomain: [number, number] = [0, maxVal ? maxVal + 5 : 10];

  /* ---------- responsive X-axis params --------------------------- */
  const w = useWindowWidth();
  const small = w < 1200;
  const fontSize = small ? 10 : 12;
  const tickH = small ? 34 : 42;
  const angle = small ? -35 : 0;

  /* ---------- title --------------------------------------------- */
  const title =
    id === "partner-part"
      ? "Channel Partner Participants"
      : id === "internal-part"
      ? "Internal Team Participants"
      : "Participants";

  /* =========================== UI =============================== */
  return (
    <main className="flex flex-col gap-4">
      {/* back link */}
      <Link
        to="../.."
        relative="path"
        className="flex w-fit items-center gap-1 text-hpBlue hover:underline"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back to dashboard
      </Link>

      {/* header */}
      <section className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">
          {title} —{" "}
          <span className="text-base font-semibold text-slate-500">
            {audience}
          </span>
        </h2>

        {!loading && (
          <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 border border-gray shadow shadow-hpBlue/10">
            <p className="text-sm text-slate-500">Latest&nbsp;count</p>
            <span className="text-3xl font-bold tabular-nums text-slate-900">
              {latest}
            </span>
            {delta !== 0 && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  delta > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {delta > 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                {Math.abs(delta)}
              </span>
            )}
          </div>
        )}
      </section>

      {/* chart */}
      <div className="rounded-xl bg-white p-6 border border-gray shadow-md shadow-hpBlue/10">
        {loading ? (
          <div className="py-16 text-center">Loading chart…</div>
        ) : (
          <ResponsiveContainer width="100%" height={420}>
            <ComposedChart data={series}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="month"
                interval={0} /* show every label */
                angle={angle}
                height={tickH}
                tick={{ fontSize, textAnchor: "end" }}
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
                content={<CustomTooltip />}
                cursor={{ fill: "#F5F5F5" }}
              />

              <Bar
                dataKey="participants"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
              <Line
                dataKey="participants"
                stroke="#ff5050"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </main>
  );
};

export default KpiDetail;
