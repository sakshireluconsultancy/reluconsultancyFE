import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import SectionContent from "./SectionContent";
import { useLocation, useNavigate } from "react-router-dom";

interface LeaderboardLinkProps {
  sectionId?: string;
}

const LeaderboardLink = ({ sectionId }: LeaderboardLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === "/reluconsultancy/partner") {
      navigate("/reluconsultancy/leaderboard/external");
    } else if (location.pathname === "/reluconsultancy") {
      navigate("/reluconsultancy/leaderboard/internal");
    } else {
      navigate("/reluconsultancy");
    }
  };

  return (
    <div
      className="lg:pt-10 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50"
      id={sectionId}
    >
      <SectionContent alignment="center" title="Live Leaderboard">
        <div className="p-2 bg-gray-50 text-center rounded-md">
          <div
            onClick={handleHomeClick}
            className="relative inline-flex items-center gap-2
                     bg-footer px-6 py-3 font-semibold text-white
                     transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            🔗 View Leaderboard Live
            <ArrowTopRightOnSquareIcon className="w-5" />
          </div>
        </div>
      </SectionContent>
    </div>
  );
};

export default LeaderboardLink;
