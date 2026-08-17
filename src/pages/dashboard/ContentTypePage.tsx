import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { getAPI, postAPI } from "../../API/apiClient";
import ContentTypeTable, {
  type CT_Row,
} from "../../components/dashboard/ContentTypeTable";
import { toApiRegions } from "../../utlis/dashboardFilters";
import { useDashboardFilters } from "../../utlis/useDashboardFilters";

type Tab = "pending" | "original" | "not_original" | "not_relevant";

const TAB_LABEL: Record<Tab, string> = {
  pending: "Pending",
  original: "Success Story original",
  not_original: "Success Story not original",
  not_relevant: "Not relevant",
};

type RegionTimeUpdate = {
  last_update: string;
  next_update: string;
};

type ReviewDataItem = {
  _id?: string;
  "content-type"?: unknown;
  content_type?: unknown;
  contentType?: unknown;
  author?: {
    name?: string;
    profilePicUrl?: string;
  };
  postUrl?: string;
  text?: string;
  postedAt?: string;
};

type ReviewDataResponse = {
  status?: boolean;
  data: ReviewDataItem[];
  region_times_updates?: Record<string, RegionTimeUpdate | null>;
};

type ReviewDataApiResponse = ReviewDataResponse | ReviewDataItem[];

const EMPTY_ROWS: Record<Tab, CT_Row[]> = {
  pending: [],
  original: [],
  not_original: [],
  not_relevant: [],
};

const normalizeContentType = (value: unknown): Tab => {
  const raw = String(value ?? "pending")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (raw === "success_story") return "original";
  if (["irrelevant", "not_relevant", "not_relevent"].includes(raw)) {
    return "not_relevant";
  }
  if (raw === "original" || raw === "not_original") return raw;

  return "pending";
};

const getReviewItems = (response: ReviewDataApiResponse) =>
  Array.isArray(response) ? response : response.data;

const getReviewRegionUpdates = (response: ReviewDataApiResponse) =>
  Array.isArray(response) ? {} : response.region_times_updates ?? {};

const getReviewContentType = (item: ReviewDataItem) =>
  item["content-type"] ?? item.content_type ?? item.contentType;

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

const useRefMap = <T extends string>(keys: readonly T[]) => {
  const m = useRef<Record<T, HTMLButtonElement | null>>({} as Record<T, HTMLButtonElement | null>);
  keys.forEach((k) => {
    if (!m.current[k]) m.current[k] = null;
  });
  return m;
};

const ContentTypePage = () => {
  const tabs = Object.keys(TAB_LABEL) as Tab[];
  const { months, regions, countries } = useDashboardFilters();

  const [active, setActive] = useState<Tab>("pending");
  const [rows, setRows] = useState<Record<Tab, CT_Row[]>>({
    pending: [],
    original: [],
    not_original: [],
    not_relevant: [],
  });
  const [regionTimeUpdates, setRegionTimeUpdates] = useState<
    Record<string, RegionTimeUpdate | null>
  >({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [confirm, setConfirm] = useState<{
    open: boolean;
    row: CT_Row | null;
    choice: Exclude<Tab, "pending"> | null;
  }>({ open: false, row: null, choice: null });

  const btnRefs = useRefMap(tabs);
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
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [active, btnRefs]);

  const loadReviewData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const response = await getAPI<
      {
        participants: string;
        month: string;
        region: string;
        country: string;
      },
      ReviewDataApiResponse
    >(
      "review-data/",
      {
        participants: "All_participants",
        month: months.join(","),
        region: toApiRegions(regions).join(","),
        country: countries.join(","),
      },
      { suppressErrorToast: true }
    );

    if (!response) {
      setRows(EMPTY_ROWS);
      setRegionTimeUpdates({});
      setLoadError("Unable to load post review data. Please check the connection and try again.");
      setLoading(false);
      return;
    }

    const reviewItems = getReviewItems(response);
    const regionUpdates = getReviewRegionUpdates(response);

    if (
      (!Array.isArray(response) && response.status === false) ||
      !Array.isArray(reviewItems)
    ) {
      setRows(EMPTY_ROWS);
      setRegionTimeUpdates(regionUpdates);
      setLoadError("Post review data is not available right now.");
      setLoading(false);
      return;
    }

    const bucket: Record<Tab, CT_Row[]> = {
      pending: [],
      original: [],
      not_original: [],
      not_relevant: [],
    };

    const seen = new Set<string>();
    reviewItems.forEach((item) => {
      if (!item?._id || seen.has(item._id)) return;
      seen.add(item._id);
      const tabKey = normalizeContentType(getReviewContentType(item));

      bucket[tabKey].push({
        id: item._id,
        participant: item.author?.name ?? "-",
        postUrl: item.postUrl ?? "",
        content: item.text ?? "",
        postedAt: item.postedAt ?? "",
        status: tabKey,
        profilePic: item.author?.profilePicUrl,
      });
    });

    setRows(bucket);
    setRegionTimeUpdates(regionUpdates);
    setLoading(false);
  }, [months, regions, countries]);

  useEffect(() => {
    void loadReviewData();
  }, [loadReviewData]);

  const mutateBackend = async (_id: string, choice: Exclude<Tab, "pending">) => {
    const contentTypeValue = choice === "not_relevant" ? "irrelevant" : choice;
    try {
      const res = await postAPI<
        { _id: string; "content-type": string },
        { status: boolean | number | string }
      >(
        "review-data/",
        { _id, "content-type": contentTypeValue },
        { suppressErrorToast: true, suppressSuccessToast: true }
      );
      return res !== undefined && res.status !== false && res.status !== 0;
    } catch {
      return false;
    }
  };

  const commitChoice = async (row: CT_Row, choice: Exclude<Tab, "pending">) => {
    const ok = await mutateBackend(row.id, choice);
    if (!ok) {
      toast.error("Action failed - please retry");
      return;
    }
    setRows((prev) => {
      const pendingFiltered = prev.pending.filter((r) => r.id !== row.id);
      return {
        ...prev,
        pending: pendingFiltered,
        [choice]: [{ ...row, status: choice }, ...prev[choice]],
      };
    });
    toast.success(`Marked as ${TAB_LABEL[choice]}`);
  };

  const handleSelect = (row: CT_Row, choice: Exclude<Tab, "pending">) => {
    setConfirm({ open: true, row, choice });
  };

  const counts = useMemo(
    () => ({
      pending: rows.pending.length,
      original: rows.original.length,
      not_original: rows.not_original.length,
      not_relevant: rows.not_relevant.length,
    }),
    [rows]
  );

  return (
    <div className="flex h-full min-w-0 flex-col gap-6">
      <Toaster richColors position="top-right" />

      <h2 className="shrink-0 text-xl font-bold leading-tight sm:text-2xl">
        Success Story Post Review
      </h2>

      <RegionTimestampCards updates={regionTimeUpdates} />

      <div className="flex min-w-0 flex-row items-center justify-between">
        <div className="relative isolate mb-4 w-full max-w-full overflow-x-auto rounded-xl bg-white/80 px-3 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur-md sm:w-fit sm:px-4">
          <span
            className="absolute bottom-0 h-[3px] rounded-full bg-hpBlue transition-all duration-300"
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.left}px)`,
            }}
          />
          <div className="flex w-max items-center gap-1">
            {tabs.map((t) => {
              const on = t === active;
              return (
                <button
                  key={t}
                  ref={(n) => {
                    btnRefs.current[t] = n;
                  }}
                  onClick={() => setActive(t)}
                  className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${on ? "text-hpBlue" : "hover:text-hpBlue"
                    }`}
                >
                  {TAB_LABEL[t]}
                  <span
                    className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-semibold ${on ? "bg-hpBlue/10 text-hpBlue" : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {counts[t]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {loading ? (
          <div className="py-20 text-center">Loading...</div>
        ) : loadError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-8 text-center shadow-sm">
            <p className="font-semibold text-amber-900">{loadError}</p>
            <button
              type="button"
              onClick={() => void loadReviewData()}
              className="mt-4 rounded-md bg-hpBlue px-5 py-2 text-sm font-semibold text-white transition hover:bg-hpBlue/90"
            >
              Retry
            </button>
          </div>
        ) : (
          <ContentTypeTable
            rows={rows[active]}
            emptyMsg="No records found."
            showAction={active === "pending"}
            onSelect={handleSelect}
          />
        )}

        {confirm.open && confirm.row && confirm.choice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-lg">
              <span className="mb-6 flex items-center justify-center">
                {confirm.choice === "original" ? (
                  <CheckCircleIcon className="h-10 w-10 text-emerald-500" />
                ) : (
                  <ExclamationCircleIcon className="h-10 w-10 text-tertiary" />
                )}
              </span>

              <h3 className="mb-2 text-center text-lg font-semibold">
                Assign as {TAB_LABEL[confirm.choice]}
              </h3>

              <h3 className="mb-4 text-center text-lg text-slate-600">
                Are you sure you want to mark this post as {TAB_LABEL[confirm.choice]}?
              </h3>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setConfirm({ open: false, row: null, choice: null })}
                  className="rounded-md border border-slate-300 px-6 py-2 text-sm transition hover:bg-slate-100"
                >
                  No
                </button>
                <button
                  onClick={async () => {
                    const { row, choice } = confirm;
                    setConfirm({ open: false, row: null, choice: null });
                    await commitChoice(row!, choice!);
                  }}
                  className={`rounded-md px-6 py-2 text-sm text-white transition ${confirm.choice === "not_original" || confirm.choice === "not_relevant"
                    ? "bg-tertiary hover:bg-tertiary/80"
                    : "bg-emerald-600 hover:bg-emerald-500"
                    }`}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTypePage;
