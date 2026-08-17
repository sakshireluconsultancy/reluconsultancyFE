export const DASHBOARD_MONTH_OPTIONS = [
  "June-26",
  "July-26",
  "August-26",
  "September-26",
  "October-26",
  "November-26",
  "December-26",
] as const;

export const STATISTICS_PERIOD_OPTIONS = [
  "All_month",
  "Q3",
  "Q4",
  "Q1",
] as const;

export const STATISTICS_MONTH_FILTER_OPTIONS = [
  ...DASHBOARD_MONTH_OPTIONS,
  ...STATISTICS_PERIOD_OPTIONS,
] as const;

export const STATISTICS_PERIOD_LABELS: Record<(typeof STATISTICS_PERIOD_OPTIONS)[number], string> = {
  All_month: "All Month",
  Q3: "FY26Q3",
  Q4: "FY26Q4",
  Q1: "FY27Q1",
};

export const REGION_OPTIONS = [
  { label: "All Regions", value: "" },
  { label: "GAI", value: "gai" },
  { label: "AMS", value: "ams" },
  { label: "EMEA", value: "emea" },
] as const;

export const REGION_COUNTRY_MAP: Record<string, string[]> = {
  gai: [
    "Australia",
    "New Zealand",
    "Indonesia",
    "Singapore",
    "Malaysia",
    "Thailand",
    "Philippines",
    "Vietnam",
    "Korea",
    "India",
  ],
  emea: [
    "Albania",
    "Andorra",
    "Armenia",
    "Austria",
    "Azerbaijan",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Kosovo",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "North Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    "Vatican City",
    "Bahrain",
    "Iran",
    "Iraq",
    "Israel",
    "Jordan",
    "Kuwait",
    "Lebanon",
    "Oman",
    "Palestine",
    "Qatar",
    "Saudi Arabia",
    "Syria",
    "United Arab Emirates",
    "Yemen",
    "Algeria",
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cameroon",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Democratic Republic of the Congo",
    "Republic of the Congo",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Ivory Coast",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "São Tomé and Príncipe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Tanzania",
    "Togo",
    "Tunisia",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ],
  ams: [
    "USA",
    "Canada",
    "Mexico",
    "Belize",
    "Costa Rica",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Nicaragua",
    "Panama",
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Guyana",
    "Paraguay",
    "Peru",
    "Suriname",
    "Uruguay",
    "Venezuela",
    "Antigua and Barbuda",
    "Bahamas",
    "Barbados",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "Grenada",
    "Haiti",
    "Jamaica",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Trinidad and Tobago",
  ],
};

export const toGraphMonth = (m: string): string => {
  if (!m) return "";
  const [mon, yy] = m.split("-");
  return `${mon}-20${yy}`;
};

export const toApiMonthMap: Record<string, string> = DASHBOARD_MONTH_OPTIONS.reduce(
  (acc, month) => {
    acc[month] = toGraphMonth(month);
    return acc;
  },
  {} as Record<string, string>
);

export const toApiRegions = (regions: string[]): string[] =>
  regions.map((region) => {
    const normalized = region.trim().toLowerCase();
    if (normalized === "gai" || normalized === "asia") return "GAI";
    if (normalized === "ams") return "AMS";
    if (normalized === "emea" || normalized === "europe") return "EMEA";
    return region.toUpperCase();
  });


  export const toApiCountries = (countries: string[]): string[] =>
  countries.map((country) => {
    const normalized = country.trim().toLowerCase();

    if (normalized === "us") return "US";

    return country.toUpperCase();
  });
