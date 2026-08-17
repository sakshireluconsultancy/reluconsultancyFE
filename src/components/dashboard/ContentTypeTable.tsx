import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export interface CT_Row {
  id: string;
  participant: string;
  postUrl: string;
  content: string;
  postedAt: string;
  status: "pending" | "original" | "not_original" | "not_relevant";
  profilePic?: string;
}

interface Props {
  rows: CT_Row[];
  emptyMsg: string;
  showAction: boolean;
  onSelect: (row: CT_Row, choice: Exclude<CT_Row["status"], "pending">) => void;
}

const ContentTypeTable = ({ rows, emptyMsg, showAction, onSelect }: Props) => {
  const colCount = showAction ? 5 : 4;
  const [asc, setAsc] = useState<boolean>(false);
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});
  const CHAR_LIMIT = 200;

  const toggleSort = () => setAsc((prev) => !prev);
  const toggleExpand = (id: string) => {
    setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getContentPreview = (content: string, expanded: boolean) => {
    const isTruncated = content.length > CHAR_LIMIT;
    if (!isTruncated || expanded) {
      return { text: content, isTruncated };
    }
    return { text: content.slice(0, CHAR_LIMIT), isTruncated };
  };

  rows.sort((a, b) => {
    const dateA = new Date(a.postedAt).getTime();
    const dateB = new Date(b.postedAt).getTime();
    return asc ? dateA - dateB : dateB - dateA;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md shadow-hpBlue/10">
      <table className="min-w-[860px] table-fixed border-collapse text-sm align-middle lg:min-w-full">
        <thead className="sticky top-0 z-10">
          <tr className="bg-hpBlue text-left text-white font-semibold">
            <th className="w-[180px] px-4 py-3">Participant</th>
            <th className="w-[220px] px-4 py-3">Post URL</th>
            <th
              className="w-[200px] cursor-pointer select-none px-4 py-3"
              onClick={toggleSort}
            >
              <span className="inline-flex items-center gap-2">
                Posted At
                {asc ? (
                  <ArrowUpIcon className="h-4 w-4" aria-label="Sorted ascending" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" aria-label="Sorted descending" />
                )}
              </span>
            </th>
            <th className="w-[300px] px-4 py-3">Post Content</th>
            {showAction && <th className="w-[160px] px-4 py-3 text-center">Action</th>}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="py-12 text-center">
                {emptyMsg}
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.id} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                <td className="w-[180px] break-words px-4 py-3 font-semibold">{r.participant}</td>

                <td className="w-[220px] break-all px-4 py-3 text-hpBlue underline">
                  <a href={r.postUrl} target="_blank" rel="noopener noreferrer">
                    {r.postUrl}
                  </a>
                </td>

                <td className="w-[200px] px-4 py-3">{formatDate(r.postedAt)}</td>

                <td className="break-words px-4 py-3">
                  {(() => {
                    const expanded = !!expandedById[r.id];
                    const { text, isTruncated } = getContentPreview(r.content ?? "", expanded);
                    return (
                      <>
                        <span>{text}</span>
                        {isTruncated && !expanded && <span>...</span>}
                        {isTruncated && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(r.id)}
                            className="ml-2 font-medium text-hpBlue underline hover:opacity-80"
                          >
                            {expanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </td>

                {showAction && (
                  <td className="px-4 py-3 text-center">
                    {r.status === "pending" ? (
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const val = e.target.value as Exclude<CT_Row["status"], "pending">;
                          if (val) onSelect(r, val);
                        }}
                        className="h-9 w-full max-w-[9rem] cursor-pointer rounded border border-gray bg-white px-2 text-sm shadow-md shadow-hpBlue/10 hover:border-gray-400 focus:border-hpBlue focus:ring-2 focus:ring-hpBlue/30"
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        <option value="original">Success Story original</option>
                        <option value="not_original">Success Story not original</option>
                        <option value="not_relevant">Not relevant</option>
                      </select>
                    ) : r.status === "original" ? (
                      <CheckCircleIcon className="mx-auto h-8 w-8 text-emerald-600" />
                    ) : (
                      <XMarkIcon className="mx-auto h-6 w-6 text-amber-500" />
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTypeTable;
