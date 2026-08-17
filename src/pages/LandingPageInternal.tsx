import Overview from "../components/Overview";
import Instructions from "../components/Instructions";
import Prizes from "../components/Prizes";
import Leaderboard from "../components/LeaderboardLink";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AOS from "aos";
import { useEffect } from "react";
import Scorecard from "../components/Scorecard";
import ReadyPosts from "../components/ReadyPosts";
import NeedHelp from "../components/NeedHelp";

const LandingPageInternal = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Duration in ms
  }, []);
  return (
    <main className="flex flex-col">
      <Header />
      <Leaderboard sectionId="liveLeaderboard" />
      <Overview sectionId="overview" />
      <Instructions sectionId="participationSteps" />
      <Scorecard sectionId="scoreCard" />
      <Prizes sectionId="prizes" />
      <ReadyPosts />
      <NeedHelp />
      {/* <Prizes tiers={internalTiers} /> */}
      <Footer />
    </main>
  );
};

export default LandingPageInternal;
