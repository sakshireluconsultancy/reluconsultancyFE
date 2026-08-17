import SectionContent from "./SectionContent";
import cap from "../assets/cap.png";
import tshirt from "../assets/tshirt.png";
// import headset from "../assets/headset.avif";
import headsets from "../assets/headsets.png"

const data = [
  {
    id: 1,
    img: cap,
    title: "Monthly Prize:",
    desc: "Win a 6 x USD 100 Food vouchers (USD 100)! Awarded to the highest scorer each month.",
  },
  {
    id: 2,
    img: tshirt,
    title: "Bonus Months Prize:",
    desc: "Top the leaderboard in June $ August and score a 2 x USD 200 Ferrari Merchandise (USD 400)",
  },
  {
    id: 3,
    img: headsets,
    title: "Grand Prize:",
    desc: "Win USD 2,000 MDF for the highest cumulative score at the end of the challenge!",
  },
  {
    id: 4,
    img: headsets,
    title: "Consolation prize:",
    desc: "Win 2 x USD 1,500 MDF for second and third place overall at the end of the challenge!",
  },
];

interface PrizesProps {
  title?: string;
  sectionId?: string;
}

const Prizes = ({ title = "Prizes", sectionId = "prizes" }: PrizesProps) => (
  <div className="py-12">
    <SectionContent alignment="left" title={title} id={sectionId}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {data.map(({ id, img, title, desc }) => {
          const [mainText, noteText] = desc.split("\n");

          return (
            <div
              key={id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <img
                src={img}
                alt={title}
                className="w-full h-48 object-contain bg-[#ededef]"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>

                {/* Main description */}
                <p className="text-base md:text-lg text-black">
                  {mainText}
                </p>

                {/* Note text */}
                {noteText && (
                  <p className="mt-2 text-sm text-gray-600">
                    {noteText}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionContent>
  </div>
);

export default Prizes;
