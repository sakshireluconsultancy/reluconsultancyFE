import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPagePartner from "./pages/LandingPagePartner";
import LandingPageInternal from "./pages/LandingPageInternal";
import Dashboard from "./pages/Dashboard";
import "aos/dist/aos.css";
import KpiDetail from "./pages/dashboard/KpiDetailPage";
import PostsDetail from "./pages/dashboard/PostsDetailPage";
import PostingPage from "./pages/dashboard/PostingPage";
import ParticipationPage from "./pages/dashboard/ParticipationPage";
import EngagementPage from "./pages/dashboard/EngagementPage";
import RegistrationPage from "./pages/dashboard/RegistrationPage";
import ScoringPage from "./pages/dashboard/ScoringPage";
import TermsandCondition from "./pages/TermsandConditions";
import LeaderboardPageExternal from "./pages/LeaderboardPageExternal";
import LeaderboardPageInternal from "./pages/LeaderboardPageInternal";
import ContentTypePage from "./pages/dashboard/ContentTypePage";
import StatisticsPage from "./pages/dashboard/StatisticsPage";

const App = () => (
  <Router>
    <Routes>
      
      <Route path="/" element={<Navigate to="/reluconsultancy" replace />} />

      <Route path="/reluconsultancy" element={<LandingPageInternal />} />
      <Route path="/reluconsultancy/partner" element={<LandingPagePartner />} />

      {/* dashboard + section routes */}
      <Route path="/reluconsultancy/dashboard" element={<Dashboard />}>
        <Route index element={<Navigate to="participation" replace />} />

        {/* section pages */}
        <Route path="participation" element={<ParticipationPage />} />
        <Route path="posting" element={<PostingPage />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="engagement" element={<EngagementPage />} />
        <Route path="scoring" element={<ScoringPage />} />
        <Route path="content-type" element={<ContentTypePage />} />
        <Route path="statistics" element={<StatisticsPage/>}/>

        {/* detail pages include the section segment */}
        <Route path="participation/kpi/:id" element={<KpiDetail />} />
        <Route path="engagement/kpi/:id" element={<KpiDetail />} />
        <Route path="posting/posts" element={<PostsDetail />} />
      </Route>

      {/* stand-alone leaderboards */}
      <Route path="/reluconsultancy/leaderboard/external" element={<LeaderboardPageExternal />} />
      <Route path="/reluconsultancy/leaderboard/internal" element={<LeaderboardPageInternal />} />

      {/* terms & conditions */}
      <Route path="/reluconsultancy/termsandconditions" element={<TermsandCondition />} />
    </Routes>
  </Router>
);

export default App;
