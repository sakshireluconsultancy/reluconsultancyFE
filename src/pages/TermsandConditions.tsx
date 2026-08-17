import { useState } from "react";
import Footer from "../components/Footer";
import {
  ArrowLeftCircleIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "Promoter",
    answer:
      'The promoter of this competition is HP PPS Asia Pacific Pte Ltd, 1 Depot Close, Singapore 109841 ("HP").',
  },
  {
    question: "Eligibility",
    answer: (
      <p>
        The HP Latex Buzz Challenge (“Challenge”) is open to HP channel partners
        and HP employees located in Australia, New Zealand, India, Korea,
        Thailand, Philippines, Vietnam, Singapore, Malaysia, Cambodia, Myanmar
        and Indonesia (“Participants”). Participants must be of legal working
        age in their jurisdiction and authorized to represent their company. HP
        reserves the right to disqualify entries if eligibility requirements are
        not met.
      </p>
    ),
  },
  {
    question: "Game of Skill",
    answer:
      "This Challenge is a game of skill. Winners are determined based on performance and merit. No element of chance is involved. ",
  },
  {
    question: "Challenge Period",
    answer:
      "The Challenge runs from 3 June 2025 to 30 January 2026. All activities must be completed during this period.",
  },
  {
    question: "How to Participate",
    answer: (
      <>
        <p className=" py-2">
          To participate in the HP Latex Buzz Challenge, Participants are
          required to complete a series of activities that support the
          visibility and awareness of HP Latex products.
        </p>
        <p className=" py-2">
          Specific activities and instructions will be communicated by HP
          throughout the Challenge period (3 June 2025 – 30 January 2026).
          Participants will receive regular guidance via monthly email and
          through the official campaign landing page, including details such as
          challenge instructions, posting timelines, eligible platforms, and
          point values for each task.
        </p>
        <p className=" py-2">
          Participation may include, but is not limited to:
        </p>
        <ul
          className=" py-2"
          style={{ listStyleType: "disc", paddingLeft: "20px" }}
        >
          {" "}
          <li>
            Publishing social media content related to HP Latex using
            campaign-specific hashtags (e.g., <code>#HPLatexBuzzChallenge</code>
            , <code>#HPLatexChampion</code>) on LinkedIn, Facebook, or Instagram
          </li>
          <li>
            Sharing customer success stories, testimonials, or original insights
            that showcase HP Latex technology
          </li>
        </ul>
        <p className=" py-2">
          For HP employees, content may be shared through verified personal or
          business social media accounts. For channel partners, all content must
          be posted through verified business or company-affiliated social media
          channels.
        </p>
        <p className=" py-2">
          All activities must adhere to HP’s
          <a
            style={{ color: "blue", padding: "0 2px" }}
            target="_blank"
            href="https://brandcentral.hp.com/"
          >
            brand and messaging guidelines
          </a>
          and, where applicable, must clearly disclose any sponsorship,
          affiliation, or material connection with HP to comply with local
          advertising and endorsement regulations (e.g., in Singapore).
        </p>
        <p className=" py-2">
          HP reserves the right to verify the authenticity and quality of
          submitted activities before awarding points or prizes.
        </p>
        <p className=" py-2">
          A point system will be used to evaluate performance. A full breakdown
          of points per activity will be provided at the start of the challenge.
        </p>
      </>
    ),
  },
  {
    question: "Leaderboard and Publicity",
    answer: (
      <>
        <p>
          A leaderboard will be maintained and updated monthly during the
          Challenge. The leaderboard will:
        </p>
        <ul
          className=" py-2 list-dash"
          style={{ listStyleType: "disc", paddingLeft: "20px" }}
        >
          <li>Display company names only</li>
          <li>Show point scores</li>
          <li>
            Not display individual names (except for HP internal participants,
            where relevant).
          </li>
        </ul>
        <p>
          Participants consent to HP publishing their company names and scores
          in marketing materials, internal communications, and regional
          announcements.
        </p>
      </>
    ),
  },
  {
    question: "Prizes",
    answer: (
      <>
        <p>
          Prizes include Ferrari merchandise, shopping vouchers, marketing
          support, and other non-cash benefits. Prizes are awarded based on
          final leaderboard positions.
        </p>
        <p>Eligibility criteria:</p>
        <ul
          className=" py-2 list-dash"
          style={{ listStyleType: "disc", paddingLeft: "20px" }}
        >
          <li>
            Only Participants who comply with these terms and conditions are
            eligible
          </li>
          <li>All activities must be submitted and verified by HP</li>
          <li>
            In the event of a tie, HP may run a tiebreaker or apply qualitative
            criteria to be determined in its sole and absolute discretion.
          </li>
        </ul>
        <p>
          Prizes are non-transferable, non-exchangeable, and not redeemable for
          cash unless stated.
        </p>
      </>
    ),
  },
  {
    question: "Notification and Delivery of Prizes",
    answer:
      "Winners will be notified by HP via email within 30 days of the Challenge end date. Prizes will be delivered within a reasonable period after the end of the challenge digitally or physically based on the nature of the reward. Participants are responsible for providing accurate delivery details. ",
  },
  {
    question: "Taxes and Legal Compliance",
    answer:
      "Participants are responsible for all taxes or charges arising from prize receipt. HP assumes no responsibility for tax obligations. Participants should consult a tax advisor. This Challenge complies with the laws of the countries where it is offered. For Singapore, posts must clearly state if they are sponsored by HP. ",
  },
  {
    question: "Disqualification and Fair Play",
    answer: (
      <>
        <p>HP reserves the right to disqualify participants who:</p>
        <ul
          className=" py-2 list-dash"
          style={{ listStyleType: "disc", paddingLeft: "20px" }}
        >
          <li>Provide false or misleading information</li>
          <li>Engage in fraudulent or unethical conduct</li>
          <li>Violate any terms of the Challenge.</li>
        </ul>
      </>
    ),
  },
  {
    question: "Privacy and Data Use",
    answer: (
      <>
        <p>
          Participants acknowledge and agree that HP may collect, use, and
          disclose personal and company data for the purpose of administering
          the Challenge. This may include sharing such data with HP’s
          affiliates, partners, and third-party service providers supporting the
          execution of the Challenge. Data may be processed or stored in
          jurisdictions outside the participant’s country of residence. HP
          handles all personal information in accordance with its Privacy
          Statement, which can be accessed here:
          <br></br>
          <a
            style={{ color: "blue", padding: "0 2px" }}
            target="_blank"
            href="https://www.hp.com/privacy/"
          >
            https://www.hp.com/privacy
          </a>
        </p>
        <p>
          For participants in Korea:<br></br> In compliance with applicable
          Korean privacy laws, including the Personal Information Protection Act
          (PIPA), HP notifies you that your personal information may be
          transferred to and processed by HP entities or service providers
          located outside of Korea for the purpose of Challenge management. By
          participating in the Challenge, you consent to such cross-border data
          transfers. You may contact HP’s Data Protection Officer via the form
          available at: HP Privacy feedback form Worldwide | HP® Official Site
        </p>
      </>
    ),
  },
  {
    question: "Modifications and Cancellation",
    answer:
      "HP reserves the right to modify, suspend, or cancel the Challenge at any time without prior notice, including if the Challenge is not capable of being run as planned for any reason beyond HP’s reasonable control. ",
  },
  {
    question: "Governing Law and Jurisdiction",
    answer:
      "These Terms and Conditions shall be governed by the laws of the participant’s country of residence. Any disputes arising in connection with the Challenge shall be subject to the exclusive jurisdiction of the competent courts in that country, unless otherwise required by applicable law. ",
  },
];

const TermsandCondition = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const navigate = useNavigate();
  return (
    <div className=" bg-white ">
      <div className="px-4 py-10 max-w-6xl mx-auto ">
        <div className="flex items-start py-6 ">
          <ArrowLeftCircleIcon
            onClick={() => navigate("/")}
            className="h-10 text-slate-300 cursor-pointer hover:text-slate-300 transition duration-200 hover:scale-110 transform"
          />
        </div>
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="">
              <div
                onClick={() => toggleFAQ(index)}
                className=" bg-white hover:bg-slate-50 cursor-pointer px-4 py-3  shadow flex justify-between items-center"
              >
                <span className=" text-lg ">{faq.question}</span>
                {openIndex === index ? (
                  <MinusIcon className="w-8 h-8 text-slate-600" />
                ) : (
                  <PlusIcon className="w-8 h-8 text-slate-600" />
                )}
              </div>
              {openIndex === index && (
                <div className=" mt-2 px-4 py-2 text-base">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsandCondition;
