import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* ─────────── Radial progress ─────────── */

interface RadialProps {
  pct: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  trackColor?: string;
}

const RadialProgress = ({
  pct,
  size = 100,
  strokeWidth = 11,
  color,
  trackColor = "#e5e7eb",
}: RadialProps) => {
  const radius = (size - strokeWidth) / 2;
  const C = 2 * Math.PI * radius;
  const offset = C * (1 - pct / 100);

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${C} ${C}`}
          strokeDashoffset={offset}
          fill="none"
        />
      </svg>

      {/* % label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold" style={{ color }}>
          {pct.toFixed(0)}%
        </span>
        <span className="text-[9px] font-medium text-slate-500">progress</span>
      </div>
    </div>
  );
};

/* ─────────── Spark-line ─────────── */

type SparkLineProps = { points: number[]; color: string; height?: number };

const SparkLine = ({ points, color, height = 64 }: SparkLineProps) => {
  const data = points.map((v, i) => ({ i, v }));
  return (
    <div style={{ height }} className="w-full pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Tooltip cursor={false} />
          <Area
            type="monotone"
            dataKey="v"
            stroke="none"
            fill="url(#sparkFill)"
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ─────────── Ratio pill ─────────── */

const RatioPill = ({
  num,
  den,
  color,
}: {
  num: number;
  den: number;
  color: string;
}) => (
  <div
    className="flex items-baseline gap-1 rounded-lg border-2 p-3 shadow-sm"
    style={{ borderColor: color }} /* ← accent border */
  >
    <span className="text-sm font-medium" style={{ color }}>
      {num}
    </span>
    <span className="text-sm text-gray-500">out&nbsp;of</span>
    <span className="text-sm text-gray-700">{den || "-"}</span>
  </div>
);

/* ─────────── Main KPI card ─────────── */

interface Props {
  id: string;
  title?: string;
  value?: string | number;
  trend?: number[];
  isPercent?: boolean;
  isRatio?: boolean;
  navigateTo?: string;
  sparkColor?: string;
  onClick?: () => void;
}

const KpiCard: React.FC<Props> = ({
  id,
  title,
  value,
  trend = [],
  isPercent,
  isRatio,
  navigateTo,
  sparkColor = "#2563eb",
  onClick,
}) => {
  const nav = useNavigate();
  const go = () => {
    onClick?.();
    nav(navigateTo ?? `kpi/${id}`, { relative: "path" });
  };

  /* detect ratio & parse */
  const valueStr = value?.toString() ?? "";
  const ratioDetected = isRatio || valueStr.includes("/");

  let mainVisual: React.ReactNode = null;
  let leftVisual: React.ReactNode = null;

  if (ratioDetected) {
    const [numRaw, denRaw] = valueStr.split("/");
    const num = Number(numRaw);
    const den = Number(denRaw);
    const pct = den > 0 ? (num / den) * 100 : 0;

    leftVisual = <RatioPill num={num} den={den} color={sparkColor} />;
    mainVisual = <RadialProgress pct={pct} color={sparkColor} />;
  } else {
    mainVisual = <SparkLine points={trend} color={sparkColor} />;
  }

  const formatted =
    !ratioDetected && typeof value === "number"
      ? isPercent
        ? `${value}%`
        : value.toLocaleString()
      : valueStr;

  return (
    <button
      onClick={go}
      className="w-full rounded-xl bg-white p-4 pb-6 text-left shadow-md shadow-hpBlue/10 border border-gray transition hover:-translate-y-2"
    >
      <h3 className="mb-3 font-semibold">{title}</h3>

      <div className="mt-6 flex flex-col items-center justify-around gap-4 xl:flex-row">
        {ratioDetected ? (
          leftVisual
        ) : (
          <span className="text-2xl font-semibold text-slate-800">
            {formatted}
          </span>
        )}

        <div className={ratioDetected ? "" : "mt-2 w-1/2"}>{mainVisual}</div>
      </div>
    </button>
  );
};

export default KpiCard;
