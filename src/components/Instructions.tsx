import Section from "./SectionContent";
import step1Img from "../assets/step-1.png";
import step2Img from "../assets/step-2.png";
import step3Img from "../assets/step-3.png";

const cards = [
  {
    img: step1Img,
    step: 1,
    title: "Post HP Latex content on your social media platforms:",
    description: "Instagram, LinkedIn, and/or Facebook.",
  },
  {
    img: step2Img,
    step: 2,
    title: "Include hashtags:",
    description:
      "#HPLatexBuzzChallenge (For original posts, add #HPLatexBonus).",
  },
  {
    img: step3Img,
    step: 3,
    title: "Post more to score more",
    description: "and win.",
  },
];

const Instructions = ({ sectionId }: { sectionId?: string }) => (
  <div className="py-4 xl:py-10 bg-white">
    <Section alignment="left" title="How to Participate" id={sectionId}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {cards.map(({ img, step, title, description }, i) => (
          <div
            key={step}
            className={`flex flex-col items-center text-center gap-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl animate-fadeUp [animation-delay:${
              i * 150
            }ms]`}
          >
            <img src={img} alt={`Step ${step} icon`} className="w-16 h-16" />
            <h3 className="font-semibold text-lg">Step {step}</h3>
            <p className="text-base md:text-lg">
              {title}{" "}
              <span className="font-medium">{description}</span>
            </p>
          </div>
        ))}
      </div>
    </Section>
  </div>
);

export default Instructions;
