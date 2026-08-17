import MultiSelectFilter from "./MultiSelectFilter";
import {
  DASHBOARD_MONTH_OPTIONS,
  STATISTICS_MONTH_FILTER_OPTIONS,
  STATISTICS_PERIOD_LABELS,
} from "../../utlis/dashboardFilters";
import { REGION_FILTER_OPTIONS } from "../../utlis/useRegionCountryFilter";
import { useDashboardFilters } from "../../utlis/useDashboardFilters";
import { useLocation } from "react-router-dom";

const DashboardFiltersPanel = () => {
  const { pathname } = useLocation();
  const isStatisticsPage = pathname.endsWith("/statistics");
  const monthOptions = isStatisticsPage
    ? STATISTICS_MONTH_FILTER_OPTIONS
    : DASHBOARD_MONTH_OPTIONS;
  const {
    months,
    regions,
    countries,
    countryOptions,
    setMonths,
    setRegions,
    setCountries,
    clearFilters,
  } = useDashboardFilters({ monthOptions });

  const hasActiveFilters =
    months.length > 0 || regions.length > 0 || countries.length > 0;

  return (
    <section className="mx-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm shadow-slate-200/70">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Filters
          </p>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="rounded-full px-2 py-1 text-[11px] font-semibold text-hpBlue transition hover:bg-hpBlue/5 hover:text-hpBlue/80 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-300"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <div>
          <p className="mb-1 text-[11px] font-semibold text-slate-600">Month</p>
          <MultiSelectFilter
            label="Month"
            placeholder="All Months"
            selectedValues={months}
            onChange={setMonths}
            options={monthOptions.map((month) => ({
              label:
                month in STATISTICS_PERIOD_LABELS
                  ? STATISTICS_PERIOD_LABELS[month as keyof typeof STATISTICS_PERIOD_LABELS]
                  : month,
              value: month,
            }))}
            widthClassName="w-full"
            size="compact"
          />
        </div>

        <div>
          <p className="mb-1 text-[11px] font-semibold text-slate-600">Region</p>
          <MultiSelectFilter
            label="Region"
            placeholder="All Regions"
            selectedValues={regions}
            onChange={setRegions}
            options={REGION_FILTER_OPTIONS}
            widthClassName="w-full"
            size="compact"
          />
        </div>

        <div>
          <p className="mb-1 text-[11px] font-semibold text-slate-600">Country</p>
          <MultiSelectFilter
            label="Country"
            placeholder="All Countries"
            selectedValues={countries}
            onChange={setCountries}
            options={countryOptions}
            widthClassName="w-full"
            size="compact"
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardFiltersPanel;
