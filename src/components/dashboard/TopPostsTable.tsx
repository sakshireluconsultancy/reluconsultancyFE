import { useEffect, useMemo, useState } from "react";

export type PostRow = {
  id: string;
  author: string;
  title: string;
  reach: number;
  shares: number;
  comments: number;
  like: number;
  repost: number;
  profileUrl?: string;
  participantType?: "internal" | "external";
};

interface Props {
  rows: PostRow[];
}

const TopPostsTable = ({ rows }: Props) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const currentRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }, [rows, page]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          reach: acc.reach + row.reach,
          like: acc.like + row.like,
          shares: acc.shares + row.shares,
          comments: acc.comments + row.comments,
        }),
        { reach: 0, like: 0, shares: 0, comments: 0 }
      ),
    [rows]
  );

  const totalPages = Math.ceil(rows.length / pageSize);

  useEffect(() => {
    setPage(1);
  }, [rows]);

  if (rows.length === 0) {
    return (
      <div className="overflow-x-auto rounded-xl bg-white shadow animate-fadeUp">
        <div className="p-8 text-center text-gray-500">
          No posts found for the selected criteria.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-full overflow-x-auto rounded-2xl bg-white shadow-md shadow-hpBlue/10">
        <table className="min-w-[720px] text-sm font-medium text-slate-700 lg:min-w-full">
          <thead className="sticky top-0 z-10 bg-hpBlue text-white shadow-sm shadow-hpBlue/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm">Participants</th>
              <th className="px-6 py-4 text-left text-sm">Engagement</th>
              <th className="px-6 py-4 text-left text-sm">Like</th>
              <th className="px-6 py-4 text-left text-sm">Shares</th>
              <th className="px-6 py-4 text-left text-sm">Comments</th>
              {/* <th className="px-6 py-4 text-left text-sm">Type</th> */}
            </tr>
          </thead>

          <tbody>
            {currentRows.map(
              (
                {
                  id,
                  author,
                  reach,
                  shares,
                  // participantType,
                  comments,
                  like,
                },
                i
              ) => (
                <tr
                  key={id}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} `}
                >
                  <td className="px-6 py-3">{author}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`font-medium ${
                        reach > 0 ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {reach.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`font-medium ${
                        like > 0 ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {like.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`font-medium ${
                        shares > 0 ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {shares.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`font-medium ${
                        comments > 0 ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {comments.toLocaleString()}
                    </span>
                  </td>
                  {/* <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full border px-2 py-1 text-xs font-semibold ${
                        participantType === "internal"
                          ? "border-tertiary text-tertiary"
                          : "border-hpBlue text-hpBlue"
                      }`}
                    >
                      {participantType === "internal" ? "Internal" : "External"}
                    </span>
                  </td> */}
                </tr>
              )
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-hpBlue/20 bg-blue-50 text-slate-900">
              <td className="px-6 py-4 font-bold">Total</td>
              <td className="px-6 py-4 font-bold">
                {totals.reach.toLocaleString()}
              </td>
              <td className="px-6 py-4 font-bold">
                {totals.like.toLocaleString()}
              </td>
              <td className="px-6 py-4 font-bold">
                {totals.shares.toLocaleString()}
              </td>
              <td className="px-6 py-4 font-bold">
                {totals.comments.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex items-center justify-between bg-gray-50 px-6 py-4 text-sm text-slate-600">
          <span>
            Showing {currentRows.length} participant{rows.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="flex w-full items-center justify-start gap-2 border-t bg-white px-1 py-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center rounded-md border text-xs disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-xs font-medium">{page}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center rounded-md border text-xs disabled:opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default TopPostsTable;
