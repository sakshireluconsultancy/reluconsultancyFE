import { StarIcon, TrophyIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import hpLogo from "../assets/logo.webp";

import winner from "../assets/celebration.png";
import Footer from "../../components/Footer";

/* MOCK DATA – keep only the daily players list  */

type Player = { id: number; name: string; points: number; avatar: string };
type WinnerRow = { rank: number; name: string; points: number };

const makePlayers = (n: number): Player[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Player #${i + 1}`,
    points: 1_000 - i * 7,
    avatar: `https://i.pravatar.cc/100?u=${i + 1}`,
  }));

const dailyPlayers: Player[] = makePlayers(70);

/*  Past-month winners table  */

const winnersByMonth: Record<string, WinnerRow[]> = {
  "June 25": Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `Player #${i + 1}`,
    points: 1_000 - i * 25,
  })),
  "July 25": Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `Player #${i + 1}`,
    points: 950 - i * 22,
  })),
  "Aug 25": Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `Player #${i + 1}`,
    points: 2_105 - i * 20,
  })),
  "Sept 25": Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `Player #${i + 1}`,
    points: 1_905 - i * 20,
  })),
  "Oct 25": Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `Player #${i + 1}`,
    points: 990 - i * 22,
  })),
  "Nov 25": Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `Player #${i + 1}`,
    points: 1_550 - i * 22,
  })),
};

/*  Utilities */

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

/* Countdown component */

const CountdownTimer: React.FC<{ end: Date }> = ({ end }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(end.getTime() - now.getTime(), 0);
  const s = Math.floor((diff / 1_000) % 60);
  const m = Math.floor((diff / 1_000 / 60) % 60);
  const h = Math.floor((diff / 1_000 / 60 / 60) % 24);
  const d = Math.floor(diff / 1_000 / 60 / 60 / 24);

  return (
    <div className="font-medium flex gap-2 items-center justify-center mt-2 text-sm text-black font-semibold relative z-10">
      <span className="h-15 w-15 p-2 bg-white rounded shadow-lg shadow-hpBlue text-shadow drop-shadow-md">
        {d}D
      </span>
      <span className="h-15 w-15 p-2 bg-white rounded shadow-lg shadow-hpBlue text-shadow drop-shadow-md">
        {h}h
      </span>
      <span className="h-15 w-15 p-2 bg-white rounded shadow-lg shadow-hpBlue text-shadow drop-shadow-md">
        {m}m
      </span>
      <span className="h-15 w-15 p-2 bg-white rounded shadow-lg shadow-hpBlue text-shadow drop-shadow-md">
        {s}s
      </span>
    </div>
  );
};

/* Header bar */

const HeaderBar: React.FC = () => (
  <header className="relative z-20 mx-auto w-full max-w-6xl px-6 pt-6">
    <nav className="relative flex items-center justify-between rounded-[2rem] px-8 py-4">
      <Link to="/" className="flex items-center gap-3">
        <img src={hpLogo} alt="hpLogo" className="h-10 w-auto" />
        <span className="hidden text-lg font-semibold text-white sm:inline">
          HP Latex Buzz Challenge
        </span>
      </Link>

      <ul className="gap-10 text-sm text-white">
        {["Home"].map((l) => (
          <li key={l}>
            <Link
              to={l === "Home" ? "/" : `/${l.toLowerCase()}`}
              className="relative px-2 py-1 hover:text-white"
            >
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

/*  Leaderboard page – DAILY ONLY */

const PAGE_SIZE = 17;

const LeaderboardPageV2: React.FC = () => {
  /* -------- core daily leaderboard data -------- */
  const { podium, list, ends } = useMemo(() => {
    const top3 = dailyPlayers.slice(0, 3);
    return {
      podium: [top3[1], top3[0], top3[2]], // 2-1-3 layout
      list: dailyPlayers.slice(3),
      ends: endOfToday(),
    };
  }, []);

  /* -------- responsive helpers -------- */
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth > 1_024 : true
  );
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 1_024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* -------- pagination for the table -------- */
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(list.length / PAGE_SIZE);
  const pagedRows = useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [list, page]
  );

  /* -------- past-month winners dropdown -------- */
  const monthOptions = Object.keys(winnersByMonth);
  const [month, setMonth] = useState(monthOptions[0]);
  const rows = winnersByMonth[month] ?? [];

  return (
    <>
      {/* background wrapper */}
      <div className="relative min-h-screen overflow-hidden bg-white">
        <div
          className="absolute top-0 z--1 w-[200%] lg:w-full mx-auto h-[580px] lg:h-[650px] translate-x-[-25%] lg:translate-x-0 -translate-y-[58%] lg:-translate-y-[55%]
                     bg-gradient-to-b from-gray to-hpBlue rounded-[50%]
                     shadow-[inset_0_5px_60px_rgba(0,0,0,0.6)]"
        />

        {/* header */}
        <HeaderBar />

        {/* body */}
        <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-10 lg:pb-24 pt-5 lg:pt-10">
          {/* title */}
          <div className="mx-auto px-8">
            <div className="lg:mt-6 flex items-center justify-center">
              <h1 className="text-3xl font-extrabold text-white">
                Leaderboard
              </h1>
            </div>
          </div>

          {/*  Daily tab – retained for layout consistency */}
          {/* <div className="mx-auto mt-4 lg:mt-8 flex w-[200px] overflow-hidden rounded-full bg-white p-1">
            <button className="flex-1 cursor-default rounded-full py-2 text-center text-sm font-semibold capitalize bg-hpBlue text-white shadow">
              daily
            </button>
          </div> */}

          {/* podium */}
          <section className="mx-auto mt-10 max-w-4xl">
            <div className="relative rounded-3xl bg-gradient-to-b from-hpBlue via-hpBlue/80 to-gray p-4 lg:p-8 text-center">
              <span
                className="absolute top-0 left-0 z-1 h-[100px] w-full block bg-cover bg-center lg:hidden"
                style={{ backgroundImage: `url(${winner})` }}
              />
              <h2 className="text-xl font-semibold text-white relative z-10">
                TOP 10 RANK
              </h2>
              <div className="mt-1 text-xs text-white relative z-10">
                Ends in&nbsp;
                <CountdownTimer end={ends} />
              </div>

              <div className="mt-10 flex flex-col lg:flex-row lg:items-end justify-center gap-5 lg:gap-16">
                {podium.map((p, i) => {
                  const colH = ["h-28", "h-36", "h-24"][i];
                  const showCol = isDesktop ? colH : "h-auto";
                  return (
                    <div
                      key={p.id}
                      className={`relative flex gap-3 lg:gap-0 lg:flex-col items-center
                                  p-3 lg:p-0 bg-white lg:bg-transparent rounded-2xl
                                  shadow-lg lg:shadow-none
                                  ${!isDesktop && p.id === 1 ? "order-1" : ""}
                                  ${!isDesktop && p.id === 2 ? "order-2" : ""}
                                  ${!isDesktop && p.id === 3 ? "order-3" : ""}`}
                    >
                      {i === 1 && (
                        <span
                          className="absolute top-[-10%] z-1 h-[150px] w-full block bg-cover bg-center hidden lg:block"
                          style={{ backgroundImage: `url(${winner})` }}
                        />
                      )}

                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="lg:h-24 lg:w-24 h-12 w-12 rounded-full border-4 border-tertiary/10 object-cover relative z-10"
                      />

                      <p className="lg:mt-2 flex items-center gap-1 text-xs lg:text-sm font-semibold uppercase relative z-10">
                        {p.name}
                        {i === 1 && (
                          <TrophyIcon className="h-5 w-5 text-amber-300" />
                        )}
                      </p>

                      <span className="lg:mt-1 inline-flex items-center gap-1 rounded-full bg-hpBlue/10 lg:bg-white/10 px-3 py-1 text-xs text-hpBlue font-semibold">
                        <StarIcon className="h-4 w-4 text-hpBlue/60" />
                        {p.points}
                      </span>

                      <div
                        className={`lg:mt-4 drop-shadow-lg lg:w-36 rounded-t-lg lg:bg-gradient-to-b lg:from-secondary/60 lg:via-secondary/50 lg:to-gray/20 ml-auto lg:ml-0 ${showCol}`}
                      >
                        <div className="lg:text-5xl text-xl font-bold text-white p-0 lg:p-4 rounded-full bg-secondary/60 shadow-lg lg:shadow-none lg:bg-transparent w-[42px] h-[42px] lg:h-auto lg:w-full flex items-center justify-center lg:block">
                          <span style={{ textShadow: "0px 2px 2px #00000050" }}>
                            {p.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* table 4-10 */}
          <section className="mx-auto mt-10 lg:mt-14 max-w-4xl">
            <div className="overflow-hidden rounded-3xl bg-secondary/5">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead>
                  <tr className="bg-hpBlue text-white text-left text-xs uppercase">
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">User name</th>
                    <th className="px-4 py-3">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((p) => (
                    <tr
                      key={p.id}
                      className="odd:bg-hpBlue/5 even:bg-transparent hover:bg-hpBlue/10 transition"
                    >
                      <td className="px-4 py-3">{p.id}</td>
                      <td className="flex items-center gap-3 px-4 py-3">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        {p.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex gap-2 bg-hpBlue/10 text-hpBlue px-3 py-1 text-sm font-semibold rounded-full w-fit">
                          <StarIcon className="h-4 w-4 text-hpBlue/80" />
                          {p.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* paginator */}
              <div className="flex items-center justify-between p-4 text-sm">
                <span className="text-gray-600">
                  Page {page} / {pageCount}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded border px-3 py-1 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    className="rounded border px-3 py-1 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* past-month winners */}
            <div className="overflow-hidden rounded-3xl bg-white shadow mt-10 lg:mt-14">
              <div className="flex flex-wrap items-center justify-between bg-hpBlue px-4 py-3">
                <h3 className="text-md font-semibold text-white">
                  Past-month Winners
                </h3>

                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="h-8 rounded-md border border-white/50 bg-hpBlue px-2 text-sm text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  {monthOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead>
                  <tr className="bg-white/10 text-left text-xs uppercase">
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Winner</th>
                    <th className="px-4 py-3">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ rank, name, points }) => (
                    <tr
                      key={rank}
                      className="odd:bg-hpBlue/5 even:bg-transparent hover:bg-hpBlue/10 transition"
                    >
                      <td className="px-4 py-3">{rank}</td>
                      <td className="px-4 py-3">{name}</td>
                      <td className="px-4 py-3">
                        <span className="flex gap-2 rounded-full bg-hpBlue/10 px-3 py-1 font-semibold text-hpBlue w-fit">
                          <StarIcon className="h-4 w-4 text-hpBlue/80" />
                          {points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default LeaderboardPageV2;
