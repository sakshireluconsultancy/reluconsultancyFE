import { NavLink, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import hpLogo from "../../assets/logo.webp";
import DashboardFiltersPanel from "./DashboardFiltersPanel";

const participationMetricsPath = "/reluconsultancy/dashboard/participation";

const links = [
  { to: "participation", label: "Participation Metrics", icon: UserGroupIcon },
  { to: "posting", label: "Posting Metrics", icon: ChartBarIcon },
  { to: "registration", label: "Registration Metrics", icon: UserPlusIcon },
  { to: "engagement", label: "Content Engagement", icon: ChatBubbleLeftRightIcon },
  { to: "scoring", label: "Scoring & Leaderboard", icon: TrophyIcon },
  { to: "content-type", label: "Content Type", icon: ClipboardDocumentCheckIcon },
  { to: "statistics", label: "Statistics", icon: DocumentChartBarIcon },
] as const;

interface SidebarNavProps {
  onNavigate?: () => void;
}

const SidebarNav = ({ onNavigate }: SidebarNavProps) => {
  const location = useLocation();
  const hideFilters = location.pathname.endsWith("/posting");

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-white via-white to-slate-50">
      <div className="shrink-0 px-4 pb-3 pt-5">
        <h2 className="flex items-center gap-3 ">
          <a
            href={participationMetricsPath}
            className="flex items-center justify-center transition hover:opacity-80"
            aria-label="Refresh dashboard and open Participation Metrics"
          >
            <img src={hpLogo} alt="Relu logo" className="h-14 w-auto object-contain scale-125 origin-left" />
          </a>
          <span className="text-xl font-bold tracking-[0.025em] text-slate-950">
            Dashboard
          </span>
        </h2>
      </div>

      <div className="dashboard-sidebar-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-3 pt-3">
        <nav className="flex flex-col gap-1.5 px-3 mb-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={`${to}${location.search}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition
           ${
             isActive
               ? "bg-hpBlue text-white shadow-md shadow-hpBlue/20"
               : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm"
           }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-hpBlue"
                    }`}
                  />
                  <span className="min-w-0 truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        {/* <DashboardFiltersPanel /> */}
        {!hideFilters && <DashboardFiltersPanel />}
      </div>
    </div>
  );
};

export default SidebarNav;
