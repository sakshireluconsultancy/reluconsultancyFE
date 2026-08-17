import SectionContent from "./SectionContent";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const card =
  "flex flex-col justify-center items-center items-start gap-3 xl:gap-4 p-6 bg-gray-50 rounded-xl  shadow transition " +
  "duration-300 hover:-translate-y-2 hover:shadow-lg  animate-fadeUp";

interface GuidelinesProps {
  rules: string[];
  title?: string;
}

const Guidelines = ({ rules, title = "Guidelines" }: GuidelinesProps) => (
  <div className=" py-10 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50  ">
    <SectionContent alignment="center" title={title}>
      <div className="grid gap-4 xl:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule, i) => (
          <div
            data-aos="fade-down"
            key={i}
            className={`${card} [animation-delay:${
              i * 100
            }ms] bg-white rounded-md animate-fadeUp`}
          >
            <CheckCircleIcon className="w-12 h-12 text-secondary shrink-0" />
            <p className=" text-center my-3 xl:my-5">{rule}</p>
          </div>
        ))}
      </div>
    </SectionContent>
  </div>
);

export default Guidelines;
