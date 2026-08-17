import { StarIcon, TrophyIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import winner from "../assets/celebration.png";
import { postAPI } from "../API/apiClient";
import Leaderboardbanner from "../components/LeaderboardBanner";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Type definitions
interface LeaderboardItem {
  rank: number;
  participant: string;
  points: number;
}
// type for leaderboarddata
interface LeaderboardData {
  final_top_scorers: LeaderboardItem[];
  total_score: LeaderboardItem[];
}

interface PastMonthWinnerData {
  leaderboard: {
    rank_with_trophy?: number;
    user_name?: string;
    points?: number;
    weekly_consistency?: number;
    no_of_posts?: number;
    total_engagement?: number;
  };
}

// Shimmer component for loading states
const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
  ></div>
);

// Table shimmer
const TableShimmer = () => (
  <div className="min-w-full divide-y divide-white/10 text-sm">
    <thead>
      <tr className="text-left text-xs uppercase">
        <th className="px-4 py-3">
          <Shimmer className="h-4 w-12" />
        </th>
        <th className="px-4 py-3">
          <Shimmer className="h-4 w-24" />
        </th>
        <th className="px-4 py-3">
          <Shimmer className="h-4 w-16" />
        </th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 17 }).map((_, index) => (
        <tr key={index} className="odd:bg-hpBlue/5 even:bg-transparent">
          <td className="px-4 py-3">
            <Shimmer className="h-4 w-8" />
          </td>
          <td className="px-4 py-3">
            <Shimmer className="h-4 w-32" />
          </td>
          <td className="px-4 py-3">
            <Shimmer className="h-6 w-20 rounded-full" />
          </td>
        </tr>
      ))}
    </tbody>
  </div>
);

// Top 3 shimmer
const Top3Shimmer = () => (
  <div className="mt-10 flex flex-col justify-center gap-5">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="relative flex gap-3 items-center p-3 bg-gray-200 rounded-2xl shadow-lg animate-pulse"
      >
        <Shimmer className="h-6 w-24" />
        <Shimmer className="h-8 w-16 rounded-full" />
        <div className="ml-auto">
          <Shimmer className="w-[42px] h-[42px] rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

//Past month winner shimmer
const PastMonthWinnerShimmer = () => (
  <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl p-8 shadow-2xl border border-white/50 backdrop-blur-sm animate-pulse">
    <div className="flex items-center justify-between">
      <Shimmer className="h-8 w-48" />
      <Shimmer className="h-8 w-32 rounded-md" />
    </div>
    <div className="text-center mt-5">
      <div className="relative inline-block mb-4 text-center">
        <Shimmer className="w-20 h-20 rounded-full mx-auto" />
      </div>
      <Shimmer className="h-8 w-32 mx-auto mb-2" />
      <Shimmer className="h-20 w-full rounded-2xl mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Shimmer className="h-32 w-full rounded-xl" />
        <Shimmer className="h-32 w-full rounded-xl" />
        <Shimmer className="h-32 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

const LeaderboardPageExternal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  const [pastMonthData, setPastMonthData] = useState<PastMonthWinnerData>({
    leaderboard: {},
  });
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
    final_top_scorers: [],
    total_score: [],
  });
  const [month, setMonth] = useState("June-25");

  // Month options
  const monthOptions = [
    "June-25",
    "July-25",
    "August-25",
    "September-25",
    "October-25",
    "November-25",
    "December-25",
    "January-26",
    // "February-26",
  ];

  const fetchPastMonthData = async () => {
    try {
      setIsLoading(true);
      const externalPastMonth = await postAPI(
        "monthly-external-internal/",
        {
          month: month,
          participants: "All_participants",
        }
      );

      setPastMonthData(externalPastMonth || []);
    } catch (error) {
      console.error("Error fetching past month data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      setIsLeaderboardLoading(true);
      const externalResponse = await postAPI(
        "scoring-leaderboard-public/",
        {
          participants: "All_participants",
        }
      );

      setLeaderboardData(externalResponse || []);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    fetchPastMonthData();
    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    if (month) {
      fetchPastMonthData();
    }
  }, [month]);

  const podium = leaderboardData.final_top_scorers || [];
  const list = leaderboardData.total_score || [];
  const pastMonthWinner = pastMonthData.leaderboard || {};

  /* -------- pagination for the table -------- */
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(list.length / PAGE_SIZE);
  const pagedRows = useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [list, page]
  );

  // type MetricCardProps = {
  //   title: string;
  //   icon: React.ReactNode;
  //   content: React.ReactNode;
  //   className?: string;
  // };

  // const MetricCard: React.FC<MetricCardProps> = ({
  //   title,
  //   icon,
  //   content,
  //   className = "",
  // }) => (
  //   <div
  //     className={`min-w-[280px] rounded-xl p-3 shadow-md border backdrop-blur-sm ${className}`}
  //   >
  //     <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
  //       {icon}
  //       {title}
  //     </h3>
  //     {content}
  //   </div>
  // );

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-white">
        <Leaderboardbanner />
        <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-10 lg:pb-24 pt-0 lg:pt-10">
          <section className="mx-auto mt-5 lg:mt-10 max-w-4xl rounded-3xl bg-hpBlue/5 border border-hpBlue/10 ">
            <div className="relative rounded-3xl p-6 text-center">
              <span
                className="absolute top-0 left-0 z-0 h-[100px] w-full block bg-cover bg-center rounded-t-3xl"
                style={{ backgroundImage: `url(${winner})` }}
              />

              <div className="flex flex-row items-center justify-center gap-5 relative z-10">
                <TrophyIcon className="h-6 w-6 text-amber-400 drop-shadow-sm" />
                <h2 className="relative z-10 bg-hpBlue/80 py-2 shadow-md shadow-hpBlue text-white skew-x-[330deg] w-fit rounded">
                  <span className="inline-block skew-x-[-330deg] text-xl px-4 font-semibold">
                    TOP 3 RANK
                  </span>
                </h2>
                <TrophyIcon className="h-6 w-6 text-amber-400 drop-shadow-sm" />
              </div>

              {isLeaderboardLoading ? (
                <Top3Shimmer />
              ) : (
                <div className="mt-10 flex flex-col gap-6">
                  {podium.map((p: LeaderboardItem, i: number) => {
                    return (
                      <div
                        key={p.rank}
                        className={`relative flex gap-3  items-center
                                  p-3  bg-hpBlue  rounded-2xl text-white
                                  shadow-lg 
                                  `}
                      >
                        {i === 0 && (
                          <span
                            className="absolute top-[-10%] z-1 h-[150px] w-full  bg-cover bg-center hidden "
                            style={{ backgroundImage: `url(${winner})` }}
                          />
                        )}

                        <div className="relative z-10 flex text-left gap-2 items-center">
                          <p className=" flex items-center gap-1 text-xs lg:text-lg  font-semibold uppercase relative z-10">
                            {p.participant}
                          </p>
                          <span className=" inline-flex items-center gap-1 rounded-full bg-white  px-3 py-1 text-xs text-hpBlue font-semibold">
                            <StarIcon className="h-4 w-4 text-hpBlue" />{" "}
                            <span className="leading-[13px]">{p.points}</span>
                          </span>
                          {p.rank === 1 && (
                            <TrophyIcon className="h-5 w-5 text-amber-300" />
                          )}
                        </div>

                        <div
                          className={` drop-shadow-lg  rounded-t-lg  ml-auto  `}
                        >
                          <div className=" text-xl font-bold text-hpBlue p-0  rounded-full bg-white shadow-lg  w-[42px] h-[42px]  flex items-center justify-center ">
                            <span
                              style={{ textShadow: "0px 2px 2px #00000050" }}
                            >
                              {p.rank}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="mx-auto md:my-10 my-4 max-w-4xl">
            <div className="overflow-hidden my-6 rounded-3xl bg-secondary/5">
              <div className="flex items-center justify-between p-4 text-sm bg-hpBlue text-white">
                <span className="text-gray-200">
                  Page {page} / {pageCount}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded border px-3 py-1 disabled:opacity-40 hover:bg-white/10 transition"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    className="rounded border px-3 py-1 disabled:opacity-40 hover:bg-white/10 transition"
                  >
                    Next
                  </button>
                </div>
              </div>

              {isLeaderboardLoading ? (
                <TableShimmer />
              ) : (
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead>
                    <tr className=" text-left text-xs uppercase">
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Participant</th>
                      <th className="px-4 py-3">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows?.length ? (
                      pagedRows.map((p: LeaderboardItem) => (
                        <tr
                          key={`${p.rank}-${p.participant}`}
                          className="odd:bg-hpBlue/5 even:bg-transparent hover:bg-hpBlue/10 transition"
                        >
                          <td className="px-4 py-3">{p.rank}</td>
                          <td className="flex items-center gap-3 px-4 py-3">
                            {p.participant}
                          </td>
                          <td className="px-4 py-3">
                            <span className="flex gap-2 bg-hpBlue/10 text-hpBlue px-3 py-1 text-sm font-semibold rounded-full w-fit">
                              <StarIcon className="h-4 w-4 text-hpBlue/80" />
                              {p.points}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center bg-hpBlue/10">
                        <td colSpan={3} className="px-4 py-3">
                          <span className="px-6 py-6 text-center italic text-slate-500 font-medium">
                            No data available!
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
          <div className="rounded-2xl max-w-4xl mx-auto">
            <div className="flex flex-col">
              {isLoading ? (
                <PastMonthWinnerShimmer />
              ) : (
                <div className=" relative z-10 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-3xl p-8 border border-slate-50 backdrop-blur-md ">
                  {pastMonthWinner &&
                    Object.keys(pastMonthWinner).length !== 0 && (
                      <span
                        className="absolute top-16 left-0 z-1 h-[100px] w-full block bg-cover bg-center"
                        style={{ backgroundImage: `url(${winner})` }}
                      />
                    )}
                  <div className="relative mt-4 lg:mt-0 flex-col md:flex-row flex items-center justify-between ">
                    <p className="text-xl  font-bold text-hpBlue">
                      Winner in the month of {month}
                    </p>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="h-8 rounded-md border border-white/50 bg-hpBlue px-10 text-sm text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/70"
                    >
                      {monthOptions.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  {pastMonthWinner &&
                  Object.keys(pastMonthWinner).length === 0 ? (
                    <div className="text-center bg-gradient-to-r from-blue-600 to-blue-600 text-white p-4 rounded-2xl mt-4">
                      <ExclamationTriangleIcon className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <h4 className="text-xl font-medium">
                        Winner will be announced soon!
                      </h4>
                    </div>
                  ) : (
                    <>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 p-4 rounded-full shadow-lg border-4 border-white">
                          <TrophyIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="text-center mt-5">
                        <div className="relative inline-block mb-4 text-center">
                          <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold shadow-lg border-4 border-white text-3xl ">
                            #{pastMonthWinner.rank_with_trophy || 1}
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-2 ">
                          {pastMonthWinner.user_name || "No Data"}
                        </h2>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-2xl p-3 text-white shadow-lg">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <StarIcon className="w-6 h-6 text-yellow-300 fill-current" />
                            <span className="text-3xl font-extrabold">
                              {(pastMonthWinner.points || 0).toLocaleString()}
                            </span>
                            <span className="text-blue-200">Points</span>
                          </div>
                          <div className="text-blue-100 text-sm">
                            Total Score Achieved in {month}
                          </div>
                        </div>
                        {/* <div className="relative flex justify-center">
                      <div className="metrics flex gap-4 lg:gap-2 py-3  ">
                        <MetricCard
                          title="Performance Metrics"
                          icon={
                            <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
                          }
                          className="flex-1 bg-gradient-to-br from-white via-slate-50 to-blue-50 border-white/40"
                          content={
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 border border-blue-200/40 lg:h-full lg:min-h-[120px]">
                                <div className="text-sm font-bold text-blue-700 mb-1">
                                  {pastMonthWinner.weekly_consistency || 0}%
                                </div>
                                <div className="text-sm text-slate-600 min-h-[30px]">
                                  Weekly Consistency
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${pastMonthWinner.weekly_consistency || 0}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 border border-blue-200/40 lg:h-full lg:min-h-[120px]">
                                <div className="text-sm font-bold text-purple-700 mb-1">
                                  {pastMonthWinner.no_of_posts || 0}
                                </div>
                                <div className="text-sm text-slate-600 min-h-[30px]">
                                  Total Posts
                                </div>
                                <ChatBubbleOvalLeftIcon className="w-5 h-5 mx-auto  text-purple-500 mt-2" />
                              </div>
                            </div>
                          }
                        />

                        <MetricCard
                          title="Prize Details"
                          icon={
                            <TrophyIcon className="w-5 h-5 text-yellow-400" />
                          }
                          className="  w-full bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200/40 rounded-3xl"
                          content={
                            <div className="relative h-fit bg-gradient-to-r from-blue-500 to-cyan-500  rounded-xl p-3 text-white lg:h-full lg:max-h-[120px]  ">
                              <div className="text-2xl font-bold mb-1 ">
                                $1100
                              </div>
                              <div className="text-amber-100 text-sm">
                                Monthly Reward
                              </div>
                              <div className="absolute top-[-12] left-1/2 transform -translate-x-1/2 text-5xl">
                                🧢
                              </div>
                            </div>
                          }
                        />

                        <MetricCard
                          title="Engagement & Reach"
                          icon={
                            <UsersIcon className="w-4 h-4 text-green-600" />
                          }
                          className="flex-1 bg-gradient-to-br from-white via-slate-50 to-green-50 border-white/40 lg:h-full lg:min-h-[120px]"
                          content={
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 border border-blue-200/40">
                                <div className="text-sm font-bold text-green-700 mb-1">
                                  {pastMonthWinner.total_engagement || 0}
                                </div>
                                <div className="text-sm text-slate-600 min-h-[30px]">
                                  Engagement Score
                                </div>
                                <div className="flex items-center mt-1 gap-1 justify-center ">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className="w-3.5 h-3.5 text-yellow-400 fill-current "
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 border border-blue-200/40 lg:h-full lg:min-h-[120px]">
                                <div className="text-sm font-bold text-cyan-700 mb-1">
                                  {Math.floor(
                                    (pastMonthWinner.total_engagement || 0) / 10
                                  )}
                                  K
                                </div>
                                <div className="text-sm text-slate-600 min-h-[30px]">
                                  Total Reach
                                </div>
                                <EyeIcon className="w-5 h-5 text-cyan-500 mx-auto  mt-2" />
                              </div>
                            </div>
                          }
                        />
                      </div>
                    </div> */}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default LeaderboardPageExternal;
