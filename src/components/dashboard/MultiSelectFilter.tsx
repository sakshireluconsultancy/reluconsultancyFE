import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";

export type MultiSelectOption = {
  label: string;
  value: string;
};

interface MultiSelectFilterProps {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (next: string[]) => void;
  widthClassName?: string;
  placeholder?: string;
  singleSelect?: boolean;
  size?: "default" | "compact";
}

const MultiSelectFilter = ({
  label,
  options,
  selectedValues,
  onChange,
  widthClassName = "w-full lg:w-[220px]",
  placeholder,
  singleSelect = false,
  size = "default",
}: MultiSelectFilterProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [draftValues, setDraftValues] = useState<string[]>(selectedValues);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  useEffect(() => {
    if (!open) {
      setDraftValues(selectedValues);
      setQuery("");
    }
  }, [selectedValues, open]);

  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const draftSet = useMemo(() => new Set(draftValues), [draftValues]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedLabels = useMemo(
    () =>
      options
        .filter((opt) => selectedSet.has(opt.value))
        .map((opt) => opt.label),
    [options, selectedSet]
  );

  const toggle = (value: string) => {
    if (singleSelect) {
      const next = draftSet.has(value) ? [] : [value];
      setDraftValues(next);
      onChange(next);
      setQuery("");
      setOpen(false);
      return;
    }

    if (draftSet.has(value)) {
      setDraftValues((prev) => prev.filter((v) => v !== value));
      return;
    }
    setDraftValues((prev) => [...prev, value]);
  };

  const clearAll = () => {
    setDraftValues([]);
    setQuery("");
  };

  const allSelected =
    options.length > 0 && options.every((option) => draftSet.has(option.value));

  const toggleSelectAll = () => {
    setDraftValues(allSelected ? [] : options.map((option) => option.value));
  };

  const cancel = () => {
    setDraftValues(selectedValues);
    setQuery("");
    setOpen(false);
  };

  const apply = () => {
    onChange(draftValues);
    setOpen(false);
  };

  const hasChanges =
    draftValues.length !== selectedValues.length ||
    draftValues.some((value) => !selectedSet.has(value));

  const compact = size === "compact";

  return (
    <div ref={wrapperRef} className={`relative ${widthClassName}`}>
      <button
        type="button"
        onClick={() => {
          if (!open) {
            setDraftValues(selectedValues);
            setQuery("");
          }
          setOpen((s) => !s);
        }}
        className={`flex w-full items-center justify-between border border-slate-300 bg-white text-left shadow-sm transition hover:border-slate-400 focus:border-hpBlue focus:outline-none focus:ring-2 focus:ring-hpBlue/30 ${
          compact
            ? "h-9 rounded-lg px-2.5"
            : "h-11 rounded-xl px-3"
        }`}
      >
        <p className={`min-w-0 truncate font-medium text-slate-800 ${
          compact ? "text-xs" : "text-sm"
        }`}>
          {selectedLabels.length
            ? selectedLabels.slice(0, 2).join(", ") +
              (selectedLabels.length > 2 ? ` +${selectedLabels.length - 2}` : "")
            : placeholder ?? `Select ${label.toLowerCase()}`}
        </p>
        <ChevronDownIcon
          className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className={`absolute z-30 mt-2 w-full border border-slate-200 bg-white shadow-xl shadow-slate-300/30 ${
          compact ? "rounded-lg p-2" : "rounded-xl p-3"
        }`}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              {singleSelect
                ? draftValues.length > 0
                  ? "1 selected"
                  : "No selection"
                : `${draftValues.length} selected`}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <XMarkIcon className="h-3 w-3" />
              Clear
            </button>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}...`}
            className={`mb-2 w-full rounded-lg border border-slate-300 px-2 focus:border-hpBlue focus:outline-none focus:ring-2 focus:ring-hpBlue/20 ${
              compact ? "h-8 text-xs" : "h-9 text-sm"
            }`}
          />

          {!singleSelect && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className={`mb-2 flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 ${
                allSelected
                  ? "bg-blue-50 text-blue-900"
                  : "hover:bg-slate-50"
              } ${compact ? "text-xs" : "text-sm"}`}
            >
              <span className="flex-1 text-left">Select all</span>
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  allSelected
                    ? "border-hpBlue bg-hpBlue text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {allSelected && <CheckIcon className="h-3 w-3" />}
              </span>
            </button>
          )}

          <div className={`${compact ? "max-h-44" : "max-h-52"} overflow-y-auto rounded-lg border border-slate-100`}>
            {filteredOptions.map((opt) => {
              const active = draftSet.has(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={`flex w-full cursor-pointer items-start justify-between gap-3 px-3 py-2 ${
                    active ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50"
                  } ${compact ? "text-xs" : "text-sm"}`}
                >
                  <span className="flex-1 text-left break-words">{opt.label}</span>
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      active
                        ? "border-hpBlue bg-hpBlue text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {active && <CheckIcon className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
            {filteredOptions.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-slate-500">No matching options</p>
            )}
          </div>

          {!singleSelect && (
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={cancel}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={!hasChanges}
                className="rounded-md bg-hpBlue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-hpBlue/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;
