import { monthOptions } from "../../utlis/monthOptions";

interface Props {
  value: string;
  onChange: (m: string) => void;
}

const MonthPicker = ({ value, onChange }: Props) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-9 w-full md:w-[120px] rounded border border-gray-300 bg-white px-2 text-sm
                         focus:border-hpBlue focus:ring-2 focus:ring-hpBlue/30
                         hover:border-gray-400 transition"
  >
    {monthOptions.map((m) => (
      <option key={m} value={m}>
        {m}
      </option>
    ))}
  </select>
);

export default MonthPicker;
