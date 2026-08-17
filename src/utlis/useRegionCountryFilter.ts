import { useEffect, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  REGION_COUNTRY_MAP,
  REGION_OPTIONS,
} from "./dashboardFilters";

export type FilterOption = {
  label: string;
  value: string;
};

const areArraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

// const toOptions = (countries: Iterable<string>): FilterOption[] =>
//   Array.from(countries).map((country) => ({
//     label: country,
//     value: country,
//   }));

const toOptions = (countries: Iterable<string>): FilterOption[] =>
  Array.from(countries).map((country) => ({
    label: country,
    value: country,
  }));

export const REGION_FILTER_OPTIONS: FilterOption[] = REGION_OPTIONS.filter(
  (opt) => opt.value !== ""
).map((opt) => ({
  label: opt.label,
  value: opt.value,
}));

export const DEFAULT_COUNTRY_FILTER_OPTIONS: FilterOption[] = toOptions(
  new Set(Object.values(REGION_COUNTRY_MAP).flat())
);

export const useRegionCountryFilter = (
  regions: string[],
  setCountries: Dispatch<SetStateAction<string[]>>
) => {
  const countryOptions = useMemo(() => {
    if (regions.length === 0) return DEFAULT_COUNTRY_FILTER_OPTIONS;

    const merged = new Set<string>();
    regions.forEach((region) => {
      (REGION_COUNTRY_MAP[region] ?? []).forEach((country) => merged.add(country));
    });

    if (merged.size === 0) return DEFAULT_COUNTRY_FILTER_OPTIONS;
    return toOptions(merged);
  }, [regions]);

  useEffect(() => {
    const validSet = new Set(countryOptions.map((opt) => opt.value));
    setCountries((prev) => {
      const next = prev.filter((value) => validSet.has(value));
      return areArraysEqual(prev, next) ? prev : next;
    });
  }, [countryOptions, setCountries]);

  return { countryOptions };
};
