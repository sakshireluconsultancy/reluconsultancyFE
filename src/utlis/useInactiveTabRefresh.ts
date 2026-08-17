import { useEffect } from "react";

interface InactiveTabRefreshOptions {
  intervalMs?: number;
  refresh?: () => void;
}

const DEFAULT_REFRESH_INTERVAL_MS = 1 * 60 * 1000;
const LOG_PREFIX = "[InactiveTabRefresh]";
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
] as const;

const refreshPage = () => {
  window.location.reload();
};

export const useInactiveTabRefresh = ({
  intervalMs = DEFAULT_REFRESH_INTERVAL_MS,
  refresh = refreshPage,
}: InactiveTabRefreshOptions = {}) => {
  useEffect(() => {
    let intervalId: number | undefined;
    let inactivityTimeoutId: number | undefined;
    let hiddenAt: number | undefined;

    const clearRefreshInterval = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    const clearInactivityTimeout = () => {
      if (inactivityTimeoutId !== undefined) {
        window.clearTimeout(inactivityTimeoutId);
        inactivityTimeoutId = undefined;
      }
    };

    const startInactivityTimeout = () => {
      clearInactivityTimeout();

      if (document.hidden) return;

      inactivityTimeoutId = window.setTimeout(() => {
        console.log(`${LOG_PREFIX} visible tab inactive, refreshing`, {
          intervalMs,
        });
        refresh();
      }, intervalMs);
    };

    const startRefreshInterval = () => {
      if (intervalId !== undefined) return;

      hiddenAt = Date.now();
      clearInactivityTimeout();
      console.log(`${LOG_PREFIX} tab hidden, refresh timer started`, {
        intervalMs,
        hiddenAt,
      });

      intervalId = window.setInterval(() => {
        console.log(`${LOG_PREFIX} inactive interval reached, refreshing`, {
          intervalMs,
          hiddenDurationMs: hiddenAt ? Date.now() - hiddenAt : 0,
        });
        refresh();
      }, intervalMs);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        startRefreshInterval();
        return;
      }

      const hiddenDurationMs = hiddenAt ? Date.now() - hiddenAt : 0;
      clearRefreshInterval();
      hiddenAt = undefined;
      console.log(`${LOG_PREFIX} tab visible again`, {
        intervalMs,
        hiddenDurationMs,
      });
      startInactivityTimeout();

      if (hiddenDurationMs >= intervalMs) {
        console.log(`${LOG_PREFIX} hidden duration passed interval, refreshing`, {
          intervalMs,
          hiddenDurationMs,
        });
        refresh();
      }
    };

    if (document.hidden) {
      startRefreshInterval();
    } else {
      startInactivityTimeout();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, startInactivityTimeout, { passive: true });
    });

    return () => {
      clearRefreshInterval();
      clearInactivityTimeout();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, startInactivityTimeout);
      });
    };
  }, [intervalMs, refresh]);
};
