import SectionContent from "./SectionContent";

const card =
  "group relative overflow-hidden  bg-gray-50 p-6 shadow " +
  "hover:-translate-y-2 hover:shadow-lg transition duration-300 animate-fadeUp";

const BonusTier = () => (
  <SectionContent alignment="center" title="Bonus Tier">
    <div className={card}>
      <div className="absolute -inset-0.5 bg-gradient-to-br from-hpBlue/20 to-white opacity-0 group-hover:opacity-100 transition pointer-events-none" />

      <div className="relative flex flex-col gap-4">
        <p className="flex items-start gap-2">Best original content</p>

        <p className="flex items-center gap-2 font-semibold">
          Panel Judgement (Claire and Parry)
        </p>
      </div>
    </div>
  </SectionContent>
);

export default BonusTier;
