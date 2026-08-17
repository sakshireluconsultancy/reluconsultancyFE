import { ChevronDownIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import HeaderInfoTooltip from "./HeaderInfoTooltip";

export type ParticipationRow = {
  user: string;
  userId: string;
  followers?: number;
  posts: number;
  irrelevantPosts?: number;
  consistencyPct: number;
  country?: string;
};

interface Post {
  postUrl: string;
  createdAt: string;
  postedAt: string;
  text: string;
  commentsCount?: number;
  repostsCount?: number;
  totalReactionCount?: number;
  reachCount?: number;
  reach?: number;
  totalReach?: number;
}

interface Props {
  rows: ParticipationRow[];
  month: string[];
  is_original?: boolean;
}

const getConsistencyLevel = (pct: number) => {
  if (pct >= 70) {
    return {
      label: "Good consistency",
      colorClassName: "bg-emerald-500",
    };
  }
  if (pct >= 50) {
    return {
      label: "Moderate consistency",
      colorClassName: "bg-amber-400",
    };
  }
  return {
    label: "Low consistency",
    colorClassName: "bg-red-500",
  };
};

const ConsistencyValue = ({ value }: { value: number }) => {
  const level = getConsistencyLevel(value);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-[42px]">{value}%</span>
      <span
        aria-label={level.label}
        title={level.label}
        className={`h-3 w-3 rounded-full ${level.colorClassName}`}
      />
    </span>
  );
};

const ParticipationTable = ({ rows, month, is_original }: Props) => {
  const getReachCount = (post: Post) =>
    post.reachCount ?? post.reach ?? post.totalReach ?? 0;

  /* group rows by country */
  const rowsByCountry = rows.reduce<Record<string, ParticipationRow[]>>(
    (acc, r) => {
      const key = r.country || "Unknown";
      (acc[key] ||= []).push(r);
      return acc;
    },
    {}
  );

  
  const sortedCountries = Object.keys(rowsByCountry).sort((a, b) => {
  const totalA = rowsByCountry[a].reduce((s, r) => s + r.posts, 0);
  const totalB = rowsByCountry[b].reduce((s, r) => s + r.posts, 0);
  return totalB - totalA;
});
  

  /* COUNTRY expand state */
  const [openCountries, setOpenCountries] = useState<Record<string, boolean>>(
    {}
  );
  const toggleCountry = (c: string) =>
    setOpenCountries((prev) => ({ ...prev, [c]: !prev[c] }));

  /* MODAL state */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState<ParticipationRow | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = async (userId: string, pg: number) => {
    try {
      const res = await fetch(
        "https://hp-latex.reluconsultancy.net/api/api/profile-data/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: userId,
            page: pg,
            page_size: pageSize,
            month: month,
            is_original: is_original,
          }),
        }
      );
      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.total_pages || 1);
      setPage(data.current_page || pg);
    } catch (err) {
      console.error(err);
      setPosts([]);
      setTotalPages(1);
      setPage(1);
    }
  };

  const openModal = async (row: ParticipationRow) => {
    setModalUser(row);
    await fetchPage(row.userId, 1);
    setModalOpen(true);
  };

  const COL_CLASSES = ["w-[18%]", "w-[30%]", "w-[14%]", "w-[14%]", "w-[12%]"];

  return (
    <>
      <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md shadow-hpBlue/10">
        <table className="min-w-[900px] table-fixed text-sm font-medium text-slate-700 lg:min-w-full">
          <colgroup>
            {COL_CLASSES.map((cls, i) => (
              <col key={i} className={cls} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10 bg-hpBlue text-white">
            <tr>
              <th className="px-6 py-4 text-left">Country</th>
              <th className="px-6 py-4 text-left">Participant/Company</th>
              <th className="px-6 py-4 text-left">Followers</th>
              <th className="px-6 py-4 text-left">Total Posts</th>
              {/* <th className="px-6 py-4 text-left">Irrelevant Posts</th> */}
              <th className="px-6 py-4 text-left">
                <span className="inline-flex items-center gap-1">
                  Weekly Consistency
                  <HeaderInfoTooltip text="weekly consistency = (active_weeks / campaign_weeks_completed) * 100" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              sortedCountries.map((country) => {
                const list = rowsByCountry[country];
                const totalPosts = list.reduce((s, r) => s + r.posts, 0);
                // const totalIrrelevantPosts = list.reduce((s, r) => s + (r.irrelevantPosts ?? 0), 0);
                const totalFollowers = list.reduce(
                  (s, r) => s + (r.followers ?? 0),
                  0
                );
                const avgConsistency = Math.round(
                  list.reduce((s, r) => s + r.consistencyPct, 0) / list.length
                );
                const open = !!openCountries[country];

                return (
                  <React.Fragment key={country}>
                    <tr
                      className="cursor-pointer border-t-4 border-white bg-blue-50 text-blue-900"
                      onClick={() => toggleCountry(country)}
                    >
                      <td className="px-6 py-3 font-semibold">
                        <ChevronDownIcon
                          className={`mr-1 inline h-4 w-4 transform ${open ? "" : "-rotate-90"
                            }`}
                        />
                        {country}
                      </td>
                      <td className="px-6 py-3 font-semibold">Participants</td>
                      <td className="px-6 py-3 font-semibold">
                        {totalFollowers.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-semibold">{totalPosts}</td>
                      {/* <td className="px-6 py-3 font-semibold">{totalIrrelevantPosts ?? 0}</td> */}
                      <td className="px-6 py-3 font-semibold">
                        <ConsistencyValue value={avgConsistency} />
                      </td>
                    </tr>

                    {open &&
                      list.map((row, idx) => (
                        <tr
                          key={row.userId}
                          className={idx % 2 ? "bg-slate-50" : "bg-white"}
                        >
                          <td className="px-6 py-3" />
                          <td
                            className="flex cursor-pointer items-center gap-2 px-6 py-3 text-blue-600 hover:underline"
                            onClick={() => openModal(row)}
                          >
                            <EyeIcon
                              className=" h-4 w-4 shrink-0"
                              title="View Posts"
                            />
                            {row.user}
                          </td>
                          <td className="px-6 py-3">
                            {(row.followers ?? 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-3">{row.posts}</td>
                          {/* <td className="px-6 py-3">{row.irrelevantPosts ?? 0}</td> */}
                          <td className="px-6 py-3">
                            <ConsistencyValue value={row.consistencyPct} />
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            {sortedCountries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POSTS MODAL */}
      {modalOpen && modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 max-h-screen py-3">
          <div className="flex h-full w-[94%] max-w-2xl flex-col overflow-y-hidden rounded-2xl bg-white p-4 sm:p-6">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-semibold">
                Posts by {modalUser.user}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <ul className="max-h-120 grow-1 flex h-full flex-col gap-3 overflow-y-auto">
              {posts.map((p, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex gap-4">
                    <span className="pt-1 font-medium text-slate-500">
                      {(page - 1) * pageSize + i + 1}.
                    </span>
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-gray-600">
                        Posted: <b>{new Date(p.postedAt).toLocaleString()}</b>
                      </p>
                      <a
                        href={p.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-all text-blue-600 underline"
                      >
                        {p.postUrl}
                      </a>
                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                          <EyeIcon className="h-4 w-4" />
                          Reach: {getReachCount(p).toLocaleString()}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                          <HandThumbUpIcon className="h-4 w-4" />
                          Likes: {(p.totalReactionCount ?? 0).toLocaleString()}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          Comments: {(p.commentsCount ?? 0).toLocaleString()}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                          Shares: {(p.repostsCount ?? 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* pagination */}
            <div className="mt-4 flex justify-center gap-4 shrink-0">
              <button
                onClick={() => fetchPage(modalUser.userId, page - 1)}
                disabled={page <= 1}
                className="px-4 py-1 rounded border bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-2 py-1">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => fetchPage(modalUser.userId, page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-1 rounded border bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParticipationTable;
