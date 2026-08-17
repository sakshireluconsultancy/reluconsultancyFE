import Instructions from "../components/Instructions";
import Overview from "../components/Overview";
// import PointsTable from "../components/PointsTable";
// import BonusTier from "../components/BonusTier";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Leaderboard from "../components/LeaderboardLink";
import NeedHelp from "../components/NeedHelp";
import Prizes from "../components/Prizes";
import ReadyPosts from "../components/ReadyPosts";
import Scorecard from "../components/Scorecard";

// const partnerTiers: Tier[] = [
//   { id: 1, prize: " 💰 1 × USD $2,000 MDF", Icon: TrophyIcon },
//   {
//     id: 2,
//     prize: " 🎧 1 × Hyper X Wireless headset worth USD $250",
//     Icon: GiftIcon,
//   },
//   { id: 2, prize: "🧢 8 x Ferrari caps", Icon: GiftIcon },
//   { id: 3, prize: "👕 3 x Ferrari T-shirts", Icon: GiftIcon },
//   { id: 4, prize: "🎖️ Participation badge", Icon: CheckCircleIcon },
// ];

// const partnerRules = [
//   "Only public posts are eligible.",
//   "Channel partner entries must be from verified business accounts.",
//   "Participants must be identifiable.GAI HP LF Pro Channel Partners can only join.",
//   "Duplicate or irrelevant posts won’t count.",
//   "Posts must focus on HP Latex products and themes.",
//   "Content breaching brand guidelines will be excluded.",
// ];

const LandingPagePartner = () => (
  <main className="flex flex-col">
    <Header />
    <Leaderboard sectionId="liveLeaderboard" />
    <Overview sectionId="overview" />
    <Instructions sectionId="participationSteps" />
    {/* <Guidelines rules={partnerRules} /> */}
    <Scorecard sectionId="scoreCard" />
    {/* <PointsTable /> */}
    {/* <BonusTier /> */}
    <Prizes title="Partner Rewards" sectionId="prizes" />
    <ReadyPosts />
    <NeedHelp />
    <Footer />
  </main>
);

export default LandingPagePartner;
