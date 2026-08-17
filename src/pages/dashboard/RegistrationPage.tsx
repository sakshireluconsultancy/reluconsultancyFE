import { useEffect, useMemo, useState } from "react";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React from "react";
import { toast } from "sonner";
import { getAPI } from "../../API/apiClient";
import { useSearchParams } from "react-router-dom";

type RegistrationSocials = {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
};

type RegistrationApiUser = {
  user_id: string;
  name?: string;
  company_name?: string;
  created_at?: string;
  socials?: RegistrationSocials;
};

type RegistrationRegion = {
  count?: number;
  countries?: Record<string, RegistrationApiUser[]>;
};

type RegionTimeUpdate = {
  last_update: string;
  next_update: string;
};

type RegistrationMetricsResponse = {
  total_registered_users?: number;
  region_wise_counts?: Record<string, number>;
  registration_by_regions?: Record<string, RegistrationRegion>;
  region_times_updates?: Record<string, RegionTimeUpdate | null>;
};

type RegistrationRow = {
  id: string;
  region: string;
  country: string;
  companyName: string;
  createdAt?: string;
  socials: RegistrationSocials;
};

const formatRegistrationDate = (date?: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", {
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

const getSocialLabel = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname.replace(/^\/|\/$/g, "");
    return path.split("/").filter(Boolean).pop() || parsedUrl.hostname;
  } catch {
    return url;
  }
};

const flattenRegistrationRows = (
  data?: RegistrationMetricsResponse
): RegistrationRow[] => {
  const regions = data?.registration_by_regions ?? {};

  return Object.entries(regions).flatMap(([region, regionData]) =>
    Object.entries(regionData.countries ?? {}).flatMap(([country, users]) =>
      users.map((user) => ({
        id: user.user_id,
        region,
        country,
        companyName: user.company_name || user.name || "-",
        createdAt: user.created_at,
        socials: user.socials ?? {},
      }))
    )
  );
};

const RegistrationSocialLink = ({
  label,
  url,
}: {
  label: string;
  url?: string;
}) => {
  const cleanUrl = url?.trim();

  if (!cleanUrl) {
    return (
      <span className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-400">
        {label}
      </span>
    );
  }

  return (
    <a
      href={cleanUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={cleanUrl}
      className="inline-flex h-8 max-w-[170px] items-center gap-1 rounded-lg border border-hpBlue/20 bg-hpBlue/5 px-3 text-xs font-semibold text-hpBlue transition hover:border-hpBlue/40 hover:bg-hpBlue/10"
    >
      <LinkIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{getSocialLabel(cleanUrl)}</span>
    </a>
  );
};

const RegistrationTable = ({
  rows,
  regionCounts,
  regions,
}: {
  rows: RegistrationRow[];
  regionCounts: Record<string, number>;
  regions: string[];
}) => {
  const regionTabs = useMemo(() => {
    const regions = Array.from(
      new Set([...Object.keys(regionCounts), ...rows.map((row) => row.region)])
    );
    return [
      { id: "all", label: "All", count: rows.length },
      ...regions.map((region) => ({
        id: region,
        label: region,
        count: regionCounts[region] ?? rows.filter((row) => row.region === region).length,
      })),
    ];
  }, [regionCounts, rows]);

  const [activeRegion, setActiveRegion] = useState("all");
  const [openCountries, setOpenCountries] = useState<Record<string, boolean>>(
    {}
  );

  const toggleCountry = (country: string) =>
    setOpenCountries((prev) => ({ ...prev, [country]: !prev[country] }));

  // active region highlight


  const isLocked = regions.length === 1;

  const isTabDisabled = (tab: { id: string; count: number }) => {
    if (regions.length === 0) {
      return tab.id !== "all" && tab.count === 0;
    }

    return tab.id !== "all" && !regions.includes(tab.id.toLowerCase());
  };

  const isTabActive = (tabId: string) => {
    if (isLocked) {

      return tabId !== "all" && regions.includes(tabId.toLowerCase());
    }

    return activeRegion === tabId;
  };


  const isSelected = (tabId: string) => {
    return regions.includes(tabId.toLowerCase());
  };

  useEffect(() => {
    if (
      activeRegion !== "all" &&
      !regionTabs.some((tab) => tab.id === activeRegion)
    ) {
      setActiveRegion("all");
    }
  }, [activeRegion, regionTabs]);

  const filteredRows = useMemo(
    () =>
      activeRegion === "all"
        ? rows
        : rows.filter((row) => row.region === activeRegion),
    [activeRegion, rows]
  );

  const rowsByCountry = useMemo(
    () =>
      filteredRows.reduce<Record<string, RegistrationRow[]>>((acc, row) => {
        const key = row.country || "Unknown";
        (acc[key] ||= []).push(row);
        return acc;
      }, {}),
    [filteredRows]
  );

  const sortedCountries = useMemo(
    () =>
      Object.keys(rowsByCountry).sort((a, b) => {
        const totalA = rowsByCountry[a].length;
        const totalB = rowsByCountry[b].length;
        return totalB - totalA || a.localeCompare(b);
      }),
    [rowsByCountry]
  );

  useEffect(() => {
    setOpenCountries({});
  }, [activeRegion]);

  const COL_CLASSES = [
    "min-w-[170px]",
    "w-[24%]",
    "w-[16%]",
    "w-[15%]",
    "w-[15%]",
    "w-[16%]",
  ];

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-full overflow-x-auto rounded-xl bg-white/80 px-3 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur-md sm:w-fit sm:px-4">
        <div className="flex w-max items-center gap-1">
          {regionTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              disabled={isTabDisabled(tab)}
              onClick={() => {

                if (!isLocked) {
                  setActiveRegion(tab.id);
                }

              }}
              

              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition
${isTabActive(tab.id)
                  ? "bg-hpBlue text-white"
                  : isSelected(tab.id)
                    ? "border border-hpBlue bg-hpBlue/10 text-hpBlue"
                    : isTabDisabled(tab)
                      ? "cursor-not-allowed text-slate-400"
                      : "text-slate-600 hover:text-hpBlue"
                }`}
            >
              {tab.label}
              <span
                className={`flex h-5 min-w-[20px] items-center justify-center rounded-full 
                  px-1 text-[11px] font-semibold 
                  ${isTabActive(tab.id)
                    ? "bg-hpBlue text-white"
                    : "bg-slate-100 text-slate-600"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-hpBlue/10">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] table-fixed text-sm font-medium text-slate-700 lg:min-w-full">
            <colgroup>
              {COL_CLASSES.map((cls, i) => (
                <col key={i} className={cls} />
              ))}
            </colgroup>
            <thead className="sticky top-0 z-10 bg-hpBlue text-white">
              <tr>
                <th className="px-6 py-4 text-left">Country</th>
                <th className="px-6 py-4 text-left">Participant/Company</th>
                <th className="px-6 py-4 text-left">Registration Date</th>
                <th className="px-6 py-4 text-left">Instagram Handle</th>
                <th className="px-6 py-4 text-left">Facebook Handle</th>
                <th className="px-6 py-4 text-left">LinkedIn Handle</th>
              </tr>
            </thead>
            <tbody>
              {sortedCountries.map((country) => {
                const list = rowsByCountry[country];
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
                      <td className="px-6 py-3 font-semibold">Companies</td>
                      <td className="px-6 py-3 font-semibold">
                        {list.length} registered
                      </td>
                      <td className="px-6 py-3 font-semibold text-slate-400">
                        -
                      </td>
                      <td className="px-6 py-3 font-semibold text-slate-400">
                        -
                      </td>
                      <td className="px-6 py-3 font-semibold text-slate-400">
                        -
                      </td>
                    </tr>

                    {open &&
                      list.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={idx % 2 ? "bg-slate-50" : "bg-white"}
                        >
                          <td className="px-6 py-3" />
                          <td className="px-6 py-3 font-semibold text-slate-900">
                            {row.companyName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-slate-600">
                            {formatRegistrationDate(row.createdAt)}
                          </td>
                          <td className="px-6 py-3">
                            <RegistrationSocialLink
                              label="Instagram"
                              url={row.socials.instagram}
                            />
                          </td>
                          <td className="px-6 py-3">
                            <RegistrationSocialLink
                              label="Facebook"
                              url={row.socials.facebook}
                            />
                          </td>
                          <td className="px-6 py-3">
                            <RegistrationSocialLink
                              label="LinkedIn"
                              url={row.socials.linkedin}
                            />
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}

              {sortedCountries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No registration data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-slate-50 px-6 py-4 text-sm text-slate-600">
          <span>
            Showing {filteredRows.length} registration
            {filteredRows.length !== 1 ? "s" : ""}
          </span>
          <span>{sortedCountries.length} countr{sortedCountries.length === 1 ? "y" : "ies"}</span>
        </div>
      </div>
    </div>
  );
};

const RegistrationPage = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [regionCounts, setRegionCounts] = useState<Record<string, number>>({});
  const [regionTimeUpdates, setRegionTimeUpdates] = useState<
    Record<string, RegionTimeUpdate | null>
  >({});


  const [searchParams] = useSearchParams();

  const regions = useMemo(
    () =>
      searchParams
        .get("region")
        ?.split(",")
        .map((r) => r.trim().toLowerCase())
        .filter(Boolean) ?? [],
    [searchParams]
  );

  const filteredRows = useMemo(() => {
    if (regions.length === 0) return rows;

    return rows.filter((row) =>
      regions.includes(row.region.toLowerCase())
    );
  }, [rows, regions]);

  const filteredRegionCounts = useMemo(() => {
    if (regions.length === 0) return regionCounts;

    return {
      GAI: regions.includes("gai") ? (regionCounts.GAI ?? 0) : 0,
      AMS: regions.includes("ams") ? (regionCounts.AMS ?? 0) : 0,
      EMEA: regions.includes("emea") ? (regionCounts.EMEA ?? 0) : 0,
    };
  }, [regions, regionCounts]);


  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAPI<undefined, RegistrationMetricsResponse>(
          "registration-metrics"
        );
        setRegionCounts(data?.region_wise_counts ?? {});
        setRegionTimeUpdates(data?.region_times_updates ?? {});
        setRows(
          flattenRegistrationRows(data).sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
        );
      } catch (e) {
        toast.error("Failed to load registration data");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  return (
    <>
      <div className="mb-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Registration Metrics</h2>
        <RegionTimestampCards updates={regionTimeUpdates} />
      </div>

      {loading ? (
        <div className="py-20 text-center">Loading registrations...</div>
      ) : (
        <RegistrationTable
          rows={filteredRows}
          regionCounts={filteredRegionCounts}
          regions={regions}
        />
      )}
    </>
  );
};

export default RegistrationPage;