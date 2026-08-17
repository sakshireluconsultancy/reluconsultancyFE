import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DASHBOARD_MONTH_OPTIONS,
  REGION_COUNTRY_MAP,
} from "./dashboardFilters";
import {
  DEFAULT_COUNTRY_FILTER_OPTIONS,
  type FilterOption,
  REGION_FILTER_OPTIONS,
} from "./useRegionCountryFilter";

const MONTH_PARAM = "month";
const REGION_PARAM = "region";
const COUNTRY_PARAM = "country";

const parseValues = (value: string | null) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const areArraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const toCountryOptions = (countries: Iterable<string>): FilterOption[] =>
  Array.from(countries).map((country) => ({
    label: country,
    value: country,
  }));

type UseDashboardFiltersOptions = {
  monthOptions?: readonly string[];
};

export const useDashboardFilters = ({
  monthOptions = DASHBOARD_MONTH_OPTIONS,
}: UseDashboardFiltersOptions = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const months = useMemo(
    () => {
      const validMonths = new Set(monthOptions);
      return parseValues(searchParams.get(MONTH_PARAM)).filter((month) =>
        validMonths.has(month)
      );
    },
    [monthOptions, searchParams]
  );

  const regions = useMemo(() => {
    const validRegions = new Set(REGION_FILTER_OPTIONS.map((option) => option.value));
    return parseValues(searchParams.get(REGION_PARAM)).filter((region) =>
      validRegions.has(region)
    );
  }, [searchParams]);

  const setParamValues = useCallback(
    (key: string, values: string[]) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const cleaned = values.filter(Boolean);
        if (cleaned.length > 0) {
          next.set(key, cleaned.join(","));
        } else {
          next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const countryOptions = useMemo(() => {
    if (regions.length === 0) return DEFAULT_COUNTRY_FILTER_OPTIONS;

    const merged = new Set<string>();
    regions.forEach((region) => {
      (REGION_COUNTRY_MAP[region] ?? []).forEach((country) => merged.add(country));
    });

    if (merged.size === 0) return DEFAULT_COUNTRY_FILTER_OPTIONS;
    return toCountryOptions(merged);
  }, [regions]);

  const countries = useMemo(() => {
    const validCountries = new Set(countryOptions.map((option) => option.value));
    return parseValues(searchParams.get(COUNTRY_PARAM)).filter((country) =>
      validCountries.has(country)
    );
  }, [countryOptions, searchParams]);

  useEffect(() => {
    const currentCountries = parseValues(searchParams.get(COUNTRY_PARAM));
    if (!areArraysEqual(currentCountries, countries)) {
      setParamValues(COUNTRY_PARAM, countries);
    }
  }, [countries, searchParams, setParamValues]);

  return {
    months,
    regions,
    countries,
    countryOptions,
    setMonths: (values: string[]) => setParamValues(MONTH_PARAM, values),
    setRegions: (values: string[]) => setParamValues(REGION_PARAM, values),
    setCountries: (values: string[]) => setParamValues(COUNTRY_PARAM, values),
    clearFilters: () => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete(MONTH_PARAM);
        next.delete(REGION_PARAM);
        next.delete(COUNTRY_PARAM);
        return next;
      });
    },
  };
};
