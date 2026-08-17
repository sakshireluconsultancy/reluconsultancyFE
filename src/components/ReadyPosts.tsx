import SectionContent from "./SectionContent";
import post1 from "../assets/post1.jpg";
import post2 from "../assets/post2.jpg";
import post3 from "../assets/post3.jpg";
import post4 from "../assets/post4.jpg";

interface AssetLink {
  id: number;
  label: string;
  href: string;
}

interface Post {
  id: number;
  img: string;
  title: string;
  desc: string;
  href: string;
}

const assets: AssetLink[] = [
  {
    id: 1,
    label: "Social Media Calendar with Captions",
    href: "https://url.us.m.mimecastprotect.com/s/y4rHCERv5vsPypzZyUwh8h7Wa8M?domain=hp.widen.net",
  },
  {
    id: 2,
    label: "HP DAM: Collection Contents",
    href: "https://assetmanager.hp.com/dam/collection/contents/collection:901d6eee-a808-4ff0-866d-0c45a46fc636?elqTrackId=a77f2256d9e64028945fa7d4a7743ad9&elq=2c84851ae3324914989d1a0b6cecf0b9&elqaid=15157&elqat=1&elqCampaignId=&elqak=8AF56960CBEED8386B6ECE9BC78EF7F91B0594A6ADED2C0646C42C14AA5DC598AC9B",
  },
];

const posts: Post[] = [
  {
    id: 1,
    img: post1,
    title: "Post 1",
    desc: "HP Latex R530 awareness",
    href: "https://hp.widen.net/s/jpwffxjzrh/hp-latex-r530---intro-post_3462064",
  },
  {
    id: 2,
    img: post2,
    title: "Post 2",
    desc: "HP Latex R530 first customer impression at PacPrint 2025",
    href: "https://hp.widen.net/s/bsdnxnbpwm/customer-first-impression-r530-at-pacprint_4107377",
  },
  {
    id: 3,
    img: post3,
    title: "Post 3",
    desc: "HP Latex L730 & L830 awareness",
    href: "https://hp.widen.net/s/ssflltzmpr/hp-latex-730-and-830---social_static---enau_3898499",
  },
  {
    id: 4,
    img: post4,
    title: "Post 4",
    desc: "HP Latex L730 W first customer impression at PacPrint 2025",
    href: "https://hp.widen.net/s/nnxzsc2tvq/customer-first-impression-l730-at-pacprint_4112661",
  },
];

export default function ReadyPosts({
  sectionId = "ready-posts",
}: {
  sectionId?: string;
}) {
  return (
    <div className="py-12 bg-slate-50">
      <SectionContent
        alignment="left"
        title="Start posting today with our ready-to-use posts!"
        id={sectionId}
      >
        <p className="text-base text-black/80 max-w-2xl">
          To help you get started, we’re providing ready-to-use assets — making
          it easy to create and share your HP Latex content right away.
        </p>

        <ol className="list-decimal list-inside mt-4 space-y-2 text-base">
          <li>
            Content with Captions:&nbsp;
            <a
              href={assets[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#558392] hover:underline"
            >
              {assets[0].label}
            </a>
          </li>
          <li>
            Social Posts:&nbsp;
            <a
              href={assets[1].href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#558392] hover:underline"
            >
              {assets[1].label}
            </a>
          </li>
        </ol>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {posts.map(({ id, img, title, desc, href }) => (
            <div
              key={id}
              className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
            >
              <img src={img} alt={title} className="w-full h-60 object-cover" />
              <div className="p-4 flex-1 flex flex-col bg-white border-t border-slate-50">
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <p className="text-sm text-black/70 flex-1">{desc}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Post Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </SectionContent>
    </div>
  );
}
