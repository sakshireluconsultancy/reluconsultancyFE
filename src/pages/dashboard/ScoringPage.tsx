import {
  ArrowPathIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import ScoreTabs from "../../components/dashboard/ScoreTabs";
import { postAPI } from "../../API/apiClient";
import { toApiRegions } from "../../utlis/dashboardFilters";
import { useDashboardFilters } from "../../utlis/useDashboardFilters";

interface ScoreApiRow {
  rank: number;
  participant: string;
  points: number;
  type: "Internal" | "External";
}

type RegionTimeUpdate = {
  last_update: string;
  next_update: string;
};

interface MonthlyResp {
  monthly_scores: ScoreApiRow[];
  region_times_updates?: Record<string, RegionTimeUpdate | null>;
}
interface FinalResp {
  final_top_scorers: ScoreApiRow[];
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

const REGION_TIMESTAMP_META = [
  { label: "GAI", color: "#7438c6" },
  { label: "AMS", color: "#ff3030" },
  { label: "EMEA", color: "#109b8c" },
] as const;

const RegionTimestampCards = ({
  updates,
}: {
  updates: Record<string, RegionTimeUpdate | null>;
}) => (
  <div className="grid gap-3 md:grid-cols-3">
    {REGION_TIMESTAMP_META.map(({ label, color }) => {
      const updateInfo = updates[label];
      return (
        <div
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-hpBlue/10"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-950">{label}</h3>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>

          <div className="grid gap-3">
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
                <item.icon
                  className="h-5 w-5 shrink-0"
                  style={{ color }}
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
      );
    })}
  </div>
);

const ScoringPage = () => {
  const { months, regions, countries } = useDashboardFilters();
  const [monthlyRaw, setMonthlyRaw] = useState<ScoreApiRow[]>([]);
  const [finalRaw, setFinalRaw] = useState<ScoreApiRow[]>([]);
  const [regionTimeUpdates, setRegionTimeUpdates] = useState<
    Record<string, RegionTimeUpdate | null>
  >({});
  const [loading, setLoading] = useState(true);

  const fetchMonthly = async (
    selectedMonths: string[],
    selectedRegions: string[],
    selectedCountries: string[]
  ) => {
    const response = await postAPI<
      { participants: string; month: string[]; region: string[]; country: string[] },
      MonthlyResp
    >("scoring-leaderboard/", {
      participants: "All_participants",
      month: selectedMonths,
      region: toApiRegions(selectedRegions),
      country: selectedCountries,
    });
    setMonthlyRaw(response?.monthly_scores ?? []);
    setRegionTimeUpdates(response?.region_times_updates ?? {});
  };

  const fetchFinal = async (
    selectedMonths: string[],
    selectedRegions: string[],
    selectedCountries: string[]
  ) => {
    const response = await postAPI<
      { participants: string; month: string[]; region: string[]; country: string[] },
      FinalResp
    >("final-top-scorers/", {
      participants: "All_participants",
      month: selectedMonths,
      region: toApiRegions(selectedRegions),
      country: selectedCountries,
    });
    setFinalRaw(response?.final_top_scorers ?? []);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([
        fetchMonthly(months, regions, countries),
        fetchFinal(months, regions, countries),
      ]);
      setLoading(false);
    })();
  }, [months, regions, countries]);

  const tabData = useMemo(() => {
    type Row = {
      rank: number;
      user: string;
      points: number;
      participantType: "internal" | "external";
    };

    const normalize = (rows: ScoreApiRow[]): Row[] =>
      rows.map((r) => ({
        rank: r.rank,
        user: r.participant,
        points: r.points,
        participantType: r.type.toLowerCase() as "internal" | "external",
      }));

    const rerank = (rows: Row[]) =>
      [...rows]
        .sort((a, b) => b.points - a.points)
        .map((r, i) => ({ ...r, rank: i + 1 }));

    const monthly = rerank(normalize(monthlyRaw));
    const finalFromApi = rerank(normalize(finalRaw)).slice(0, 3);

    return {
      monthly,
      final: finalFromApi,
    };
  }, [monthlyRaw, finalRaw]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-hpBlue" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Scoring &amp; Leaderboard</h2>
        <RegionTimestampCards updates={regionTimeUpdates} />
      </div>

      <ScoreTabs tabData={tabData} />
    </>
  );
};

export default ScoringPage;
