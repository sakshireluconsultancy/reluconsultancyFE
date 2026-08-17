import needHelpBanner from "../assets/need-help-banner.jpg";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function NeedHelp({}: { sectionId?: string }) {
  return (
    <div className="bg-slate-50">
      <div className="flex flex-col md:flex-row items-center bg-white overflow-hidden">
        {/* Left: full-height image */}
        <div
          className="w-full md:w-1/2 h-[500px]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
          }}
        >
          <img
            src={needHelpBanner}
            alt="Students getting help"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: contact text */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          <h3 className="text-2xl font-bold mb-4">Need Help? Contact Us!</h3>
          <p className="text-base text-black/80 mb-6">
            For any questions or support related to the HP Latex Buzz Challenge,
            please reach out to{" "}
            <a
              href="mailto:moniykka.nathan@hp.com"
              className="text-[#558392] hover:underline"
            >
              moniykka.nathan@hp.com
            </a>
            .
          </p>
          <a
            href="https://hp-latex.reluconsultancy.net/api/api/HP-Latex-Buzz-Challenge-FAQ.pdf" target="_blank"
            className="inline-flex items-center space-x-2 text-black font-medium hover:text-black/80 hover:underline transition"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full">
              <ChevronRightIcon className="w-5 h-5" />
            </div>
            <span>FAQ</span>
          </a>
        </div>
      </div>
    </div>
  );
}
