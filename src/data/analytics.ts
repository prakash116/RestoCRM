export type AnalyticsPeriod = "7d" | "30d" | "90d" | "1y";
export type AnalyticsMetric = "revenue" | "customers" | "restaurants";
export type MembershipPlan = "Starter" | "Growth" | "Pro" | "Enterprise";
export type MembershipStatus = "Active" | "Expiring" | "Expired";

export interface AnalyticsPoint {
  label: string;
  revenue: number;
  previousRevenue: number;
  customers: number;
  restaurants: number;
}

export interface RestaurantPerformance {
  id: string;
  name: string;
  locality: string;
  city: "Delhi" | "Gurugram" | "Noida" | "Faridabad";
  plan: MembershipPlan;
  status: MembershipStatus;
  revenue: number;
  customers: number;
  rating: number;
  growth: number;
  sparkline: number[];
}

export const analyticsPeriods: { id: AnalyticsPeriod; label: string; fullLabel: string }[] = [
  { id: "7d", label: "7D", fullLabel: "Last 7 days" },
  { id: "30d", label: "30D", fullLabel: "Last 30 days" },
  { id: "90d", label: "90D", fullLabel: "Last 90 days" },
  { id: "1y", label: "1Y", fullLabel: "Last 12 months" },
];

export const analyticsSeries: Record<AnalyticsPeriod, AnalyticsPoint[]> = {
  "7d": [
    { label: "14 Aug", revenue: 1_284_000, previousRevenue: 1_176_000, customers: 236_000, restaurants: 171 },
    { label: "15 Aug", revenue: 1_332_000, previousRevenue: 1_221_000, customers: 248_000, restaurants: 173 },
    { label: "16 Aug", revenue: 1_298_000, previousRevenue: 1_246_000, customers: 251_000, restaurants: 175 },
    { label: "17 Aug", revenue: 1_486_000, previousRevenue: 1_302_000, customers: 276_000, restaurants: 177 },
    { label: "18 Aug", revenue: 1_542_000, previousRevenue: 1_351_000, customers: 292_000, restaurants: 180 },
    { label: "19 Aug", revenue: 1_671_000, previousRevenue: 1_421_000, customers: 318_000, restaurants: 182 },
    { label: "20 Aug", revenue: 1_842_000, previousRevenue: 1_633_000, customers: 342_000, restaurants: 184 },
  ],
  "30d": [
    { label: "22 Jul", revenue: 1_052_000, previousRevenue: 1_011_000, customers: 186_000, restaurants: 154 },
    { label: "25 Jul", revenue: 1_118_000, previousRevenue: 1_049_000, customers: 194_000, restaurants: 157 },
    { label: "28 Jul", revenue: 1_086_000, previousRevenue: 1_071_000, customers: 201_000, restaurants: 160 },
    { label: "31 Jul", revenue: 1_216_000, previousRevenue: 1_102_000, customers: 213_000, restaurants: 162 },
    { label: "03 Aug", revenue: 1_298_000, previousRevenue: 1_147_000, customers: 228_000, restaurants: 165 },
    { label: "06 Aug", revenue: 1_264_000, previousRevenue: 1_194_000, customers: 239_000, restaurants: 167 },
    { label: "09 Aug", revenue: 1_412_000, previousRevenue: 1_252_000, customers: 256_000, restaurants: 170 },
    { label: "12 Aug", revenue: 1_486_000, previousRevenue: 1_331_000, customers: 273_000, restaurants: 174 },
    { label: "14 Aug", revenue: 1_442_000, previousRevenue: 1_386_000, customers: 284_000, restaurants: 176 },
    { label: "16 Aug", revenue: 1_584_000, previousRevenue: 1_438_000, customers: 301_000, restaurants: 179 },
    { label: "18 Aug", revenue: 1_692_000, previousRevenue: 1_512_000, customers: 322_000, restaurants: 182 },
    { label: "20 Aug", revenue: 1_842_000, previousRevenue: 1_633_000, customers: 342_000, restaurants: 184 },
  ],
  "90d": [
    { label: "23 May", revenue: 724_000, previousRevenue: 681_000, customers: 118_000, restaurants: 118 },
    { label: "01 Jun", revenue: 792_000, previousRevenue: 719_000, customers: 129_000, restaurants: 123 },
    { label: "10 Jun", revenue: 846_000, previousRevenue: 768_000, customers: 141_000, restaurants: 129 },
    { label: "19 Jun", revenue: 812_000, previousRevenue: 794_000, customers: 146_000, restaurants: 135 },
    { label: "28 Jun", revenue: 936_000, previousRevenue: 831_000, customers: 163_000, restaurants: 141 },
    { label: "07 Jul", revenue: 1_024_000, previousRevenue: 887_000, customers: 181_000, restaurants: 148 },
    { label: "16 Jul", revenue: 1_116_000, previousRevenue: 951_000, customers: 202_000, restaurants: 154 },
    { label: "25 Jul", revenue: 1_248_000, previousRevenue: 1_043_000, customers: 226_000, restaurants: 161 },
    { label: "03 Aug", revenue: 1_326_000, previousRevenue: 1_164_000, customers: 249_000, restaurants: 168 },
    { label: "08 Aug", revenue: 1_418_000, previousRevenue: 1_281_000, customers: 271_000, restaurants: 173 },
    { label: "13 Aug", revenue: 1_512_000, previousRevenue: 1_392_000, customers: 294_000, restaurants: 178 },
    { label: "17 Aug", revenue: 1_676_000, previousRevenue: 1_503_000, customers: 321_000, restaurants: 181 },
    { label: "20 Aug", revenue: 1_842_000, previousRevenue: 1_633_000, customers: 342_000, restaurants: 184 },
  ],
  "1y": [
    { label: "Sep", revenue: 486_000, previousRevenue: 442_000, customers: 72_000, restaurants: 76 },
    { label: "Oct", revenue: 542_000, previousRevenue: 471_000, customers: 81_000, restaurants: 84 },
    { label: "Nov", revenue: 618_000, previousRevenue: 512_000, customers: 93_000, restaurants: 93 },
    { label: "Dec", revenue: 706_000, previousRevenue: 574_000, customers: 109_000, restaurants: 105 },
    { label: "Jan", revenue: 794_000, previousRevenue: 643_000, customers: 126_000, restaurants: 116 },
    { label: "Feb", revenue: 888_000, previousRevenue: 711_000, customers: 145_000, restaurants: 128 },
    { label: "Mar", revenue: 1_012_000, previousRevenue: 806_000, customers: 166_000, restaurants: 139 },
    { label: "Apr", revenue: 1_146_000, previousRevenue: 912_000, customers: 193_000, restaurants: 151 },
    { label: "May", revenue: 1_288_000, previousRevenue: 1_041_000, customers: 224_000, restaurants: 162 },
    { label: "Jun", revenue: 1_436_000, previousRevenue: 1_177_000, customers: 258_000, restaurants: 171 },
    { label: "Jul", revenue: 1_624_000, previousRevenue: 1_384_000, customers: 301_000, restaurants: 178 },
    { label: "Aug", revenue: 1_842_000, previousRevenue: 1_633_000, customers: 342_000, restaurants: 184 },
  ],
};

export const restaurantPerformance: RestaurantPerformance[] = [
  {
    id: "copper-tandoor",
    name: "Copper Tandoor",
    locality: "Connaught Place",
    city: "Delhi",
    plan: "Enterprise",
    status: "Active",
    revenue: 342_800,
    customers: 18_420,
    rating: 4.9,
    growth: 18.4,
    sparkline: [28, 34, 31, 42, 46, 55, 64],
  },
  {
    id: "nawabs-table",
    name: "Nawab's Table",
    locality: "Golf Course Road",
    city: "Gurugram",
    plan: "Pro",
    status: "Active",
    revenue: 318_600,
    customers: 16_890,
    rating: 4.8,
    growth: 15.1,
    sparkline: [26, 30, 35, 33, 44, 49, 57],
  },
  {
    id: "trattoria-nove",
    name: "Trattoria Nove",
    locality: "Hauz Khas",
    city: "Delhi",
    plan: "Enterprise",
    status: "Expiring",
    revenue: 286_200,
    customers: 14_760,
    rating: 4.8,
    growth: 12.7,
    sparkline: [22, 29, 27, 36, 41, 45, 52],
  },
  {
    id: "sugar-and-saffron",
    name: "Sugar & Saffron",
    locality: "Sector 18",
    city: "Noida",
    plan: "Growth",
    status: "Active",
    revenue: 254_900,
    customers: 13_240,
    rating: 4.7,
    growth: 11.9,
    sparkline: [24, 21, 31, 34, 38, 43, 48],
  },
  {
    id: "madras-filter-room",
    name: "Madras Filter Room",
    locality: "Defence Colony",
    city: "Delhi",
    plan: "Pro",
    status: "Active",
    revenue: 231_400,
    customers: 12_910,
    rating: 4.7,
    growth: 9.8,
    sparkline: [19, 25, 28, 26, 33, 39, 43],
  },
  {
    id: "bamboo-wok",
    name: "Bamboo Wok",
    locality: "Cyber Hub",
    city: "Gurugram",
    plan: "Growth",
    status: "Active",
    revenue: 218_700,
    customers: 11_860,
    rating: 4.6,
    growth: 8.6,
    sparkline: [18, 22, 21, 29, 31, 36, 41],
  },
  {
    id: "saffron-junction",
    name: "Saffron Junction",
    locality: "Nehru Place",
    city: "Delhi",
    plan: "Growth",
    status: "Expiring",
    revenue: 196_300,
    customers: 10_480,
    rating: 4.5,
    growth: 7.2,
    sparkline: [17, 19, 25, 23, 30, 32, 37],
  },
  {
    id: "the-roasted-bean",
    name: "The Roasted Bean",
    locality: "Sector 15",
    city: "Faridabad",
    plan: "Starter",
    status: "Expired",
    revenue: 142_800,
    customers: 8_260,
    rating: 4.4,
    growth: -2.4,
    sparkline: [31, 29, 27, 30, 25, 24, 22],
  },
];

export const ratingDistribution = [
  { stars: 5, share: 62, reviews: 11_532 },
  { stars: 4, share: 25, reviews: 4_650 },
  { stars: 3, share: 9, reviews: 1_674 },
  { stars: 2, share: 3, reviews: 558 },
  { stars: 1, share: 1, reviews: 186 },
] as const;

export const analyticsScopeFactors = {
  city: {
    All: 1,
    Delhi: 0.42,
    Gurugram: 0.26,
    Noida: 0.2,
    Faridabad: 0.12,
  },
  plan: {
    All: 1,
    Starter: 0.16,
    Growth: 0.34,
    Pro: 0.3,
    Enterprise: 0.2,
  },
} as const;
