import Section from "./SectionContent";

interface OverviewProps {
  sectionId?: string;
}

const Overview: React.FC<OverviewProps> = ({ sectionId }) => {
  // const cardData = [
  //   {
  //     icon: <GrDocumentVerified className="h-8 w-8 text-hpBlue" />,
  //     id: 1,
  //     title: "What's in it for you",
  //     description: (
  //       <>
  //         <ul className="pl-4 list-disc">
  //           <li>Be Recognized as a HP Latex Ambassador</li>
  //           <li>Boost HP Latex visibility</li>
  //           <li>Build Trust</li>
  //         </ul>
  //       </>
  //     ),
  //   },
  //   {
  //     icon: <MdDateRange className="h-8 w-8 text-hpBlue" />,
  //     id: 2,
  //     title: "Challenge Period",
  //     description: "3 June 25- 30 January 2026",
  //   },
  //   // {
  //   //   icon: <GiPlatform className="h-8 w-8 text-hpBlue" />,
  //   //   id: 3,
  //   //   title: "Eligible Platforms",
  //   //   description:
  //   //     "LinkedIn, Facebook, Instagram (public / business accounts only)",
  //   //   description2: "The participant with the highest score wins.",
  //   // },
  // ];

  return (
    <div className="py-4 xl:pt-0 xl:pb-10 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 ">
      <Section alignment="left" title="Challenge Overview" id={sectionId}>
        <p className="leading-relaxed animate-fadeUp text-base md:text-lg text-gray-700">
          The HP Latex Buzz Challenge puts you in the spotlight. Post HP Latex
          content on your social media platforms. Each post helps build your
          voice as an HP Latex ambassador. The more you post, the more points
          you earn—and the better your chance to win.
        </p>
        <p className="leading-relaxed animate-fadeUp text-base md:text-lg text-gray-700 mt-4">
          Challenge Period: 3 May 2026 – 31 October 2026
        </p>
        <p className="leading-relaxed animate-fadeUp text-base md:text-lg text-gray-700 mt-4">
          <ul className="pl-4 list-disc">
            <li>
              Open to all HP Latex Team in Greater Asia & India (exclude Japan)
            </li>
            <li>Post on your social platforms</li>
            <li>Use official hashtags</li>
            <li>Score points and win prizes</li>
          </ul>
        </p>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-12 mt-5">
          {cardData.map((item) => {
            return (
              <div
                className="border-gray bg-white my-3 rounded-3xl flex flex-col items-center gap-5 shadow-md w-full py-5 p-5  "
                key={item.id}
              >
                <div className="h-14 w-14 bg-slate-100 shadow-md rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex flex-col justify-center items-center my-5">
                  <p className="text-xl font-semibold">{item.title}</p>
                  <div className="text-gray-600 my-5">{item.description}</div>
                </div>
              </div>
            );
          })}
        </div> */}
      </Section>
    </div>
  );
};

export default Overview;
