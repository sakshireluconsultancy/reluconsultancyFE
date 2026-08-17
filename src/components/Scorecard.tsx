import SectionContent from "./SectionContent";

const scoringNotes = [
  "Points will be accumulated across Instagram, Facebook and LinkedIn from 6 May 2026 to 31 October 2026.",
  "Tiebreaker: The final decision will be based on final score + highest overall engagement",
  "Prizes will be awarded monthly. Grand prize will be awarded at the end of challenge.",
  "Bonus prizes: June, August",
];

const bars = [
  {
    points: 500,
    label: "per post",
    placeHolderVales: "1HP Latex Post",
    color: "bg-[#024AD8]",
    width: "w-full md:w-[300px]",
  },
  {
    points: 1000,
    label: "per participants",
    placeHolderVales: "Participants join challenge",
    color: "bg-[#4A7DE3]",
    width: "w-full md:w-2/5",
  },
  {
    points: 500,
    label: "flat per month",
    placeHolderVales: "4 posts or more in a month",
    color: "bg-[#6F97E9]",
    width: "w-full md:w-3/5",
  },
  {
    points: 1000,
    label: "flat per post",
    placeHolderVales: "Customer Success/win post in a month",
    color: "bg-[#94B3EF]",
    width: "w-full md:w-4/5",
  },
  {
    points: 1000,
    label: "flat per month",
    placeHolderVales: "Most Engaging post of the month",
    color: "bg-[#98b0de]",
    width: "w-full md:w-5/5",
  },
];


const Scorecard = ({ sectionId }: { sectionId: string }) => (
  <div className="bg-slate-50 overflow-hidden">
    <SectionContent title="" id={sectionId}>
      <div className="py-12">
        <h2 className="text-4xl font-bold mb-6">Score Card</h2>
        <ul className="mb-6 list-disc space-y-3 pl-6 text-base text-black md:text-lg">
          {scoringNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <div className="space-y-6">
          {bars.map(({ points, label, placeHolderVales, color, width }) => (
            <div key={points} className="flex flex-col md:flex-row md:items-center gap-4">
              <div
                className={`${color} ${width} p-4 md:px-6 md:py-4 flex flex-col gap-3 md:flex-row md:items-end`}
              >
                <span className="text-white text-4xl font-bold">+{points}</span>
                <span className="text-white mt-2 md:mt-0 text-base md:text-lg">
                  {label}
                </span>
              </div>

              <div>
                { placeHolderVales }
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContent>
  </div>
);

export default Scorecard;
