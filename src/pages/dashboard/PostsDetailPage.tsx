import {
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { postAPI } from "../../API/apiClient";
import { monthOptions } from "../../utlis/monthOptions";
import { useDashboardFilters } from "../../utlis/useDashboardFilters";

const PostsDetail = () => {
  const params = new URLSearchParams(useLocation().search);
  const contentInit = params.get("content") ?? "all";
  const { months } = useDashboardFilters();
  const selectedMonths = useMemo(
    () => (months.length > 0 ? months : [monthOptions[monthOptions.length - 1]]),
    [months]
  );
  const monthLabel = selectedMonths.join(", ");

  const [region, setRegion] = React.useState("all");
  const [content, setContent] = React.useState(contentInit);
  const [loading, setLoading] = React.useState(true);
  const [postData, setPostData] = React.useState({
    internal: {
      total_posts_this_month: 0,
      posts_per_participant: {},
      original_content_posts: 0,
      posting_consistency: 0,
    },
    external: {
      total_posts_this_month: 0,
      posts_per_participant: {},
      original_content_posts: 0,
      posting_consistency: 0,
    },
  });

  const onChangeContent = (c: any) => {
    setContent(c);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allData = await postAPI("posting-metrics/", {
          participants: "All_participants",
          month: selectedMonths,
        });

        setPostData({
          internal: allData?.internal ?? allData ?? postData.internal,
          external: allData?.external ?? postData.external,
        });
      } catch (error) {
        console.error("Error fetching posting metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonths]);

  // Build rows array with region key
  const rows = useMemo(() => {
    const result: {
      user: string;
      posts: number;
      consistencyPct: number;
      region: string;
      content: string;
    }[] = [];

    if (region === "all" || region === "internal") {
      Object.entries(postData.internal.posts_per_participant).forEach(
        ([user, posts]) => {
          const postsNum = Number(posts);
          const isOriginal =
            postsNum > 0 && postData.internal.original_content_posts > 0;
          const contentType = isOriginal ? "original" : "reshare";

          if (content === "all" || content === contentType) {
            result.push({
              user,
              posts: postsNum,
              consistencyPct: postData.internal.posting_consistency,
              region: "Internal",
              content: contentType,
            });
          }
        }
      );
    }

    if (region === "all" || region === "partner") {
      Object.entries(postData.external.posts_per_participant).forEach(
        ([user, posts]) => {
          const postsNum = Number(posts);
          const isOriginal =
            postsNum > 0 && postData.external.original_content_posts > 0;
          const contentType = isOriginal ? "original" : "reshare";

          if (content === "all" || content === contentType) {
            result.push({
              user,
              posts: postsNum,
              consistencyPct: postData.external.posting_consistency,
              region: "Partner",
              content: contentType,
            });
          }
        }
      );
    }

    return result.sort((a, b) => b.posts - a.posts);
  }, [postData, region, content]);

  // Group rows by region for summary rows
  const rowsByRegion = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        if (!acc[row.region]) acc[row.region] = [];
        acc[row.region].push(row);
        return acc;
      },
      {} as Record<string, typeof rows>
    );
  }, [rows]);

  const sortedRegions = useMemo(
    () => Object.keys(rowsByRegion),
    [rowsByRegion]
  );

  const totalPosts = useMemo(() => {
    if (region === "internal") return postData.internal.total_posts_this_month;
    if (region === "partner") return postData.external.total_posts_this_month;
    return (
      postData.internal.total_posts_this_month +
      postData.external.total_posts_this_month
    );
  }, [region, postData]);

  return (
    <main className="flex flex-col gap-6 bg-gray-50 p-6">
      {/* <Link
        to="../.."
        relative="path"
        className="text-hpBlue hover:underline flex items-center gap-2 w-fit"
      >
        <ArrowLeftIcon className="h-4 w-4 text-hpBlue" />
        <span>Back to dashboard</span>
      </Link> */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Posts per Participant – {monthLabel}
          </h2>
          <h3 className="text-xl text-gray-700">Total Posts: {totalPosts}</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-9 w-32 rounded border border-gray-300 bg-white px-3 text-sm
                       focus:border-hpBlue focus:ring-2 focus:ring-hpBlue/30
                       hover:border-gray-400 transition"
          >
            <option value="all">All Regions</option>
            <option value="internal">Internal</option>
            <option value="partner">Partner</option>
          </select>

          <select
            value={content}
            onChange={(e) => onChangeContent(e.target.value)}
            className="h-9 w-28 rounded border border-gray-300 bg-white px-3 text-sm
                       focus:border-hpBlue focus:ring-2 focus:ring-hpBlue/30
                       hover:border-gray-400 transition"
          >
            <option value="all">All Content</option>
            <option value="original">Original</option>
            <option value="reshare">Re-share</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md mt-6 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col items-center gap-3 py-12 text-gray-500">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-hpBlue border-t-transparent"></div>
            <p className="text-lg font-medium">Loading data...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-md mt-6 max-h-[75vh] overflow-y-auto">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-500">
              <InformationCircleIcon className="h-10 w-10 text-hpBlue" />
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">Adjust filters or choose another month.</p>
            </div>
          ) : (
            <table className="min-w-full text-sm font-medium text-slate-700">
              <thead className="sticky top-0 z-10 bg-hpBlue text-white shadow-sm shadow-hpBlue/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm">
                    Participant / Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm">
                    Total Posts
                  </th>
                  <th className="px-6 py-4 text-left text-sm">
                    Weekly Consistency
                  </th>
                  {/* <th className="px-6 py-4 text-left text-sm">
                    Region
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {sortedRegions.map((regionName) => {
                  const regionRows = rowsByRegion[regionName];
                  const totalPostsInRegion = regionRows.reduce(
                    (sum, r) => sum + r.posts,
                    0
                  );
                  const avgConsistency = Math.round(
                    regionRows.reduce((sum, r) => sum + r.consistencyPct, 0) /
                      regionRows.length
                  );

                  return (
                    <React.Fragment key={regionName}>
                      {/* Region Summary Row */}
                      <tr className="bg-blue-50 border-t-4 border-white text-blue-900 w-fit">
                        <td className="px-6 py-3 font-semibold">
                          {regionName}
                        </td>
                        <td className="px-6 py-3 font-semibold">
                          {totalPostsInRegion}
                        </td>
                        <td className="px-6 py-3 font-semibold">
                          {avgConsistency}%
                        </td>
                        {/* <td className="px-6 py-3 font-semibold"></td> */}
                      </tr>

                      {/* Participant Rows */}
                      {regionRows.map((row, i) => (
                        <tr
                          key={row.user}
                          className={`${
                            i % 2 === 0 ? "bg-slate-50" : "bg-slate-50"
                          } `}
                        >
                          <td className="px-6 py-3">{row.user}</td>
                          <td className="px-6 py-3">{row.posts}</td>
                          <td className="px-6 py-3">{row.consistencyPct}%</td>
                          {/* <td className="px-6 py-3">{row.region}</td> */}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
};

export default PostsDetail;
