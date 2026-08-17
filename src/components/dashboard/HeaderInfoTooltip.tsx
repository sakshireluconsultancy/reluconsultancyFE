import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useId, useState } from "react";
import { createPortal } from "react-dom";

type HeaderInfoTooltipProps = {
  text: string;
};

const TOOLTIP_WIDTH = 288;
const VIEWPORT_GAP = 12;

const HeaderInfoTooltip = ({ text }: HeaderInfoTooltipProps) => {
  const tooltipId = useId();
  const [position, setPosition] = useState<{ left: number; top: number } | null>(
    null
  );

  const showTooltip = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const width = Math.min(TOOLTIP_WIDTH, window.innerWidth - VIEWPORT_GAP * 2);
    const centeredLeft = rect.left + rect.width / 2 - width / 2;
    const left = Math.min(
      Math.max(VIEWPORT_GAP, centeredLeft),
      window.innerWidth - width - VIEWPORT_GAP
    );

    setPosition({ left, top: rect.bottom + 8 });
  };

  return (
    <span className="inline-flex align-middle">
      <button
        type="button"
        aria-label="Show formula"
        aria-describedby={position ? tooltipId : undefined}
        onMouseEnter={(event) => showTooltip(event.currentTarget)}
        onMouseLeave={() => setPosition(null)}
        onFocus={(event) => showTooltip(event.currentTarget)}
        onBlur={() => setPosition(null)}
        className="rounded-full focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        <InformationCircleIcon className="h-4 w-4" />
      </button>

      {position &&
        createPortal(
          <span
            id={tooltipId}
            role="tooltip"
            style={{
              left: position.left,
              top: position.top,
              width: `min(${TOOLTIP_WIDTH}px, calc(100vw - ${VIEWPORT_GAP * 2}px))`,
            }}
            className="pointer-events-none fixed z-[100] rounded-md bg-slate-900 px-3 py-2 text-left text-xs font-normal leading-5 text-white shadow-lg"
          >
            {text}
          </span>,
          document.body
        )}
    </span>
  );
};

export default HeaderInfoTooltip;
