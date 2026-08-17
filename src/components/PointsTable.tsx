import SectionContent from "./SectionContent";

const rows = [
  ["1 HP Latex post", "+100 per post"],
  ["If 4 posts or more in a month", "+500 flat per month"],
  [
    "HP Latex original creation (visual and copy) post per month (not provided by HP mktg)",
    "+1000 flat per month",
  ],
];

const card =
  "flex justify-between items-center p-4 bg-white rounded-xl shadow " +
  "hover:-translate-y-2 hover:shadow-lg transition duration-300 animate-fadeUp";

const PointsTable = () => (
  <div className="py-20 bg-gradient-to-r from-slate-50 via-indigo-100 to-slate-300 ">
    <SectionContent alignment="center" title="Point System">
      <div className="grid gap-4 sm:hidden">
        {rows.map(([activity, points], i) => (
          <div
            key={activity}
            className={`${card} [animation-delay:${i * 100}ms]`}
          >
            <span className="font-medium">{activity}</span>
            <span className="font-bold text-hpBlue">{points}</span>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-left border  bg-gradient-to-r from-pink-700 via-red-400 to-rose-100  rounded-md animate-fadeUp">
          <thead className=" text-white rounded-t-md">
            <tr className="rounded-t-md">
              <th className="py-2 px-4">Activity</th>
              <th className="py-2 px-4">Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([activity, points], i) => (
              <tr
                key={activity}
                className={`border-t hover:bg-gray-50 ${
                  i % 2 === 0
                    ? "hover:bg-gray bg-white"
                    : "bg-gray hover:bg-white"
                } transition [animation-delay:${i * 100}ms]`}
              >
                <td className="py-2 px-4">{activity}</td>
                <td className="py-2 px-4">{points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionContent>
  </div>
);

export default PointsTable;
