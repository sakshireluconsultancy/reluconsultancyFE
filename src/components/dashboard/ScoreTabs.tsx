import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";

export type LeaderRow = {
  rank: number;
  user: string;
  points: number;
};

interface TabData {
  monthly: LeaderRow[];
  final: LeaderRow[];
}

interface Props {
  tabData: TabData;
}

/* helper to keep refs in a map */
function useRefMap<T extends string>(
  keys: readonly T[]
): MutableRefObject<Record<T, HTMLButtonElement | null>> {
  const r = useRef<Record<T, HTMLButtonElement | null>>(
    {} as Record<T, HTMLButtonElement | null>
  );
  keys.forEach((k) => (r.current[k] = r.current[k] ?? null));
  return r;
}


const ScoreTabs = ({ tabData }: Props) => {
  

  const tabs = [
    { id: "monthly", label: "Monthly Scores", rows: tabData.monthly,paginated:true },
    { id: "final", label: "Final Top Scorers", rows: tabData.final, paginated:false },
  ] as const;

  type TabId = (typeof tabs)[number]["id"];
  const [active, setActive] = useState<TabId>("monthly");
  

  /* badge counts */
  const counts = useMemo<Record<TabId, number>>(
    () =>
      tabs.reduce(
        (acc, t) => ({ ...acc, [t.id]: t.rows.length }),
        {} as Record<TabId, number>
      ),
    [tabData]
  );

  /* underline slider */
  const btnRefs = useRefMap<TabId>(tabs.map((t) => t.id));
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
  const move = () => {
    const el = btnRefs.current[active];
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const parentLeft = el.parentElement!.getBoundingClientRect().left;
    setIndicator({ left: left - parentLeft, width });
  };
  move();

  setPage(1); // reset page when changing tab

  window.addEventListener("resize", move);
  return () => window.removeEventListener("resize", move);
}, [active, btnRefs]);

  const current = tabs.find((t) => t.id === active)!;
  // pagination
const [page, setPage] = useState(1);
const pageSize = 10;

const currentRows = useMemo(() => {
  if (!current.paginated) {
    return current.rows; // ✅ final tab shows all 3
  }

  const start = (page - 1) * pageSize;
  return current.rows.slice(start, start + pageSize);
}, [current.rows, page, current.paginated]);
useEffect(() => {
  if (current.paginated) {
    setPage(1);
  }
}, [active]);


const totalPages = Math.ceil(current.rows.length / pageSize);
  useEffect(()=>{
    setPage(1);
  },[current.rows.length]);
  

  return (
    <>
      {/* tab bar */}
      <div className="relative isolate mb-4 w-full max-w-full overflow-x-auto rounded-xl bg-white/80 px-3 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur-md sm:w-fit sm:px-4">
        {/* underline */}
        <span
          className="absolute bottom-0 h-[3px] rounded-full bg-hpBlue transition-all duration-300"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
        />

        <div className="flex w-max items-center gap-1">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              ref={(n) => {
                btnRefs.current[id] = n;
              }}
              onClick={() => setActive(id)}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                id === active ? "text-hpBlue" : "hover:text-hpBlue"
              }`}
            >
              {label}
              <span
                className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-semibold ${
                  id === active
                    ? "bg-hpBlue/10 text-hpBlue"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {counts[id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        {current.rows.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              No data available
            </h3>
            <p className="text-sm">
              No scoring data available for this category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[560px] text-sm w-full lg:min-w-full">
              <thead className="sticky top-0 z-10 bg-hpBlue text-white shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-sm">Rank</th>
                  <th className="px-6 py-4 text-left text-sm">Participant</th>
                  <th className="px-6 py-4 text-right text-sm">Points</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map(({ rank, user, points }, i) => (
                  <tr
                    key={user + i}
                    className={i % 2 ? "bg-slate-50" : "bg-white"}
                  >
                    <td className="px-6 py-3 font-semibold text-slate-800">
                      {rank}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">
                      {user}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="font-semibold text-hpBlue">
                        {points.toLocaleString()}
                      </span>
                      <span className="ml-1 text-xs text-slate-400">pts</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      {current.paginated && current.rows.length > pageSize && (
  <div className="flex items-center justify-start gap-2 px-1 py-1 bg-white border-t w-full">
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
    className="p- rounded-md border text-xs disabled:opacity-40 flex items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 h-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>

  <span className="text-xs font-medium px- py- rounded-md">
    {page}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
    className="p- rounded-md border text-xs disabled:opacity-40 flex items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 h-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>

)}

        {/* footer */}
        {/* {current.rows.length > 0 && (
          <div className="bg-slate-100 px-6 py-4 text-sm font-semibold">
            <div className="flex items-center justify-between">
              <span>Total participants: {current.rows.length}</span>
              <span>
                Total points:{" "}
                {current.rows
                  .reduce((sum, r) => sum + (r.points || 0), 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default ScoreTabs;


