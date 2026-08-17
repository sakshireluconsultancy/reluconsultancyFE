import speakericon from "../assets/announce-icon.png";
import { useNavigate } from "react-router-dom";
import hplogo from "../assets/hp-logo.png";
import bannerimg from "../assets/pexels-kindelmedia-7688660.jpg";
import { CountdownTimer } from "../pages/LeaderboardPageInternal";

const Header = () => {
  const navigate = useNavigate();
  const ends = new Date(2026, 0, 31, 23, 59, 59);

  

  return (
    <>
      <div className="xl:h-screen flex xl:flex-row flex-col gap-3 xl:gap-0">
        <div className="w-full xl:w-[52%] md:gap-10 lg:gap-4 gap-10 flex flex-col h-full px-3 md:px-6 py-6 xl:ml-[2vw] xl:pr-0">
          <nav className="flex items-center gap-2 md:gap-6">
            <div
              className="flex items-center gap-2 shrink-0"
              onClick={() => navigate("/")}
            >
              <img src={hplogo} alt="HP Logo" className="h-14  w-auto" />
            </div>

            <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-4 3xl:gap-6 ml-auto font-semibold text-[14px] m-0 text-black/80">
              <li>
                <a
                  className="transition hover:text-hpBlue hover:underline"
                  href="#liveLeaderboard"
                >
                  Live Leaderboard
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-hpBlue hover:underline"
                  href="#overview"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-hpBlue hover:underline"
                  href="#participationSteps"
                >
                  How to Participate
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-hpBlue hover:underline"
                  href="#scoreCard"
                >
                  Score Card
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-hpBlue hover:underline"
                  href="#prizes"
                >
                  Prizes
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex-grow flex flex-col justify-center">
            <div className="flex flex-col  text-center xl:text-start">
              <div className="flex flex-col md:flex-row xl:flex-col gap-2 align-items justify-center xl:justify-start">
                <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold">
                  HP Latex
                </h1>
                <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold">
                  Buzz Challenge 2.0
                </h1>
              </div>
              <p className="text-xl  md:text-xl xl:text-3xl font-bold mt-5 mb-6 xl:mb-8">
                Spark the buzz. Score the win.
              </p>
            </div>
            <div className=" text-center bg-black text-white w-full max-w-[350px] text-base xl:text-lg py-3 px-6 rounded-xl mx-auto xl:mx-0">
              <a href="https://assetmanager.hp.com/dam/collection/contents/collection:901d6eee-a808-4ff0-866d-0c45a46fc636">
                Start Posting Today!
              </a>
              {/* <p className="text-center"> Start Posting Today!</p> */}
            </div>
            <div className="flex justify-center xl:justify-start xl:mt-16 mt-4">
              <div className=" text-base font-semibold  flex justify-center flex-col md:flex-row items-center text-center sm:text-left ">
                <p className="mb-2 lg:mb-0 text-xl"> Challenge ends in:</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-2 md:gap-2">
                  <img src={speakericon} className="h-12 w-auto pt-2"></img>
                  <CountdownTimer end={ends} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="xl:h-full w-full  xl:w-2/3 "
          style={{
            clipPath: "polygon(15% 0, 100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          <div className=" h-full ">
            <img
              src={bannerimg}
              alt="Banner"
              className=" w-full  h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
