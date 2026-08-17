import { Outlet } from "react-router-dom";
import SidebarNav from "../components/dashboard/SidebarNav";
import { Bars3Icon } from "@heroicons/react/24/solid";
import hpLogo from "../assets/logo.webp";
import { useEffect, useRef } from "react";
import { useInactiveTabRefresh } from "../utlis/useInactiveTabRefresh";

const participationMetricsPath = "/reluconsultancy/dashboard/participation";

const Dashboard = () => {
  const mobileAsideToggleRef = useRef<HTMLInputElement>(null);
  useInactiveTabRefresh();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <main className="flex h-[100dvh] overflow-hidden bg-gray-50 bg-gray/10 tracking-normal">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 overflow-hidden bg-white shadow-md md:block">
        <SidebarNav />
      </aside>
      {/* section content */}
      <section className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 md:py-6">
        <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
          <h2 className="flex min-w-0 items-center gap-2 text-2xl font-semibold sm:text-3xl">
            <a
              href={participationMetricsPath}
              className="shrink-0 transition hover:opacity-80"
              aria-label="Refresh dashboard and open Participation Metrics"
            >
              <img src={hpLogo} alt="Relu logo" className="h-12 w-auto object-contain scale-125 origin-left" />
            </a>
            <span>Dashboard</span>
          </h2>
          <div>
            <label htmlFor="primaryAside" className="cursor-pointer w-fit ">
              <Bars3Icon className="h-7 w-7"></Bars3Icon>
            </label>
          </div>
          <input
            ref={mobileAsideToggleRef}
            type="checkbox"
            className="hidden"
            id="primaryAside"
          />
          <aside className="mobile-aside w-full h-full bg-white shadow-md overflow-hidden">
            <SidebarNav
              onNavigate={() => {
                if (mobileAsideToggleRef.current) {
                  mobileAsideToggleRef.current.checked = false;
                }
              }}
            />
          </aside>
          <label htmlFor="primaryAside" className="overlay"></label>
        </div>

        <Outlet />
      </section>
    </main>
  );
};

export default Dashboard;
