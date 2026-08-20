export type RevenuePeriod = "7d" | "30d" | "90d" | "1y";
export type RevenueMetric = "grossRevenue" | "netPayout" | "pendingAmount";
export type PaymentProvider = "DineBoard Pay" | "Razorpay";
export type SettlementStatus = "Settled" | "Pending" | "On hold";

export interface RevenuePoint {
  label: string;
  grossRevenue: number;
  previousGross: number;
  netPayout: number;
  pendingAmount: number;
  orders: number;
  successRate: number;
}

export interface RestaurantRevenue {
  id: string;
  name: string;
  locality: string;
  city: "Delhi" | "Gurugram" | "Noida" | "Faridabad";
  provider: PaymentProvider;
  grossRevenue: number;
  orders: number;
  gatewayFees: number;
  netPayout: number;
  status: SettlementStatus;
  settlementDate: string;
  sparkline: number[];
}

export const revenuePeriods: { id: RevenuePeriod; label: string; fullLabel: string }[] = [
  { id: "7d", label: "7D", fullLabel: "Last 7 days" },
  { id: "30d", label: "30D", fullLabel: "Last 30 days" },
  { id: "90d", label: "90D", fullLabel: "Last 90 days" },
  { id: "1y", label: "1Y", fullLabel: "Last 12 months" },
];

function makeSeries(
  labels: string[],
  grossRevenue: number[],
  pendingAmount: number[],
  orders: number[],
): RevenuePoint[] {
  return labels.map((label, index) => {
    const progress = index / Math.max(labels.length - 1, 1);
    const gross = grossRevenue[index];

    return {
      label,
      grossRevenue: gross,
      previousGross: Math.round(gross * (0.94 - progress * 0.065)),
      netPayout:
        gross -
        Math.round(gross * 0.0152) -
        Math.round(gross * 0.0337) -
        pendingAmount[index],
      pendingAmount: pendingAmount[index],
      orders: orders[index],
      successRate: 97.84 + progress * 0.46,
    };
  });
}

export const revenueSeries: Record<RevenuePeriod, RevenuePoint[]> = {
  "7d": makeSeries(
    ["15 Aug", "16 Aug", "17 Aug", "18 Aug", "19 Aug", "20 Aug", "21 Aug"],
    [58_000, 122_000, 185_000, 257_000, 334_000, 409_000, 486_000],
    [22_000, 18_000, 26_000, 20_000, 24_000, 19_000, 46_000],
    [72, 148, 226, 312, 401, 494, 588],
  ),
  "30d": makeSeries(
    ["23 Jul", "26 Jul", "29 Jul", "01 Aug", "04 Aug", "07 Aug", "10 Aug", "13 Aug", "15 Aug", "17 Aug", "19 Aug", "21 Aug"],
    [123_000, 264_000, 399_000, 509_000, 656_000, 814_000, 966_000, 1_134_000, 1_281_000, 1_455_000, 1_639_000, 1_842_000],
    [28_000, 36_000, 31_000, 45_000, 39_000, 58_000, 47_000, 73_000, 65_000, 92_000, 84_000, 117_000],
    [151, 325, 489, 622, 801, 990, 1_179, 1_384, 1_560, 1_770, 2_000, 2_268],
  ),
  "90d": makeSeries(
    ["24 May", "01 Jun", "10 Jun", "19 Jun", "28 Jun", "07 Jul", "16 Jul", "25 Jul", "03 Aug", "09 Aug", "15 Aug", "21 Aug"],
    [325_000, 651_000, 970_000, 1_341_000, 1_706_000, 2_118_000, 2_591_000, 3_035_000, 3_520_000, 4_024_000, 4_587_000, 5_184_000],
    [72_000, 91_000, 80_000, 110_000, 94_000, 131_000, 117_000, 146_000, 129_000, 162_000, 143_000, 312_000],
    [401, 798, 1_187, 1_643, 2_087, 2_588, 3_160, 3_699, 4_287, 4_896, 5_577, 6_291],
  ),
  "1y": makeSeries(
    ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    [1_021_000, 2_141_000, 3_352_000, 4_799_000, 6_178_000, 7_685_000, 9_234_000, 10_806_000, 12_519_000, 14_296_000, 16_208_000, 18_420_000],
    [320_000, 280_000, 412_000, 360_000, 526_000, 480_000, 612_000, 570_000, 744_000, 690_000, 910_000, 1_288_000],
    [1_249, 2_622, 4_101, 5_871, 7_558, 9_400, 11_291, 13_208, 15_297, 17_462, 19_793, 22_575],
  ),
};

export const gatewayAdoption = [
  { provider: "Razorpay", restaurants: 128, share: 69.6, volume: 1_283_000 },
  { provider: "DineBoard Pay", restaurants: 56, share: 30.4, volume: 559_000 },
] as const satisfies readonly {
  provider: PaymentProvider;
  restaurants: number;
  share: number;
  volume: number;
}[];

export const restaurantRevenue: RestaurantRevenue[] = [
  {
    id: "copper-tandoor",
    name: "Copper Tandoor",
    locality: "Connaught Place",
    city: "Delhi",
    provider: "DineBoard Pay",
    grossRevenue: 312_800,
    orders: 742,
    gatewayFees: 8_446,
    netPayout: 304_354,
    status: "Settled",
    settlementDate: "21 Aug, 4:30 PM",
    sparkline: [38, 42, 40, 49, 55, 61, 68],
  },
  {
    id: "nawabs-table",
    name: "Nawab's Table",
    locality: "Golf Course Road",
    city: "Gurugram",
    provider: "Razorpay",
    grossRevenue: 278_200,
    orders: 681,
    gatewayFees: 7_511,
    netPayout: 270_689,
    status: "Pending",
    settlementDate: "22 Aug, 11:00 AM",
    sparkline: [34, 39, 45, 43, 51, 57, 63],
  },
  {
    id: "trattoria-nove",
    name: "Trattoria Nove",
    locality: "Hauz Khas",
    city: "Delhi",
    provider: "DineBoard Pay",
    grossRevenue: 246_800,
    orders: 594,
    gatewayFees: 6_664,
    netPayout: 240_136,
    status: "Settled",
    settlementDate: "21 Aug, 5:15 PM",
    sparkline: [31, 36, 34, 42, 48, 52, 59],
  },
  {
    id: "sugar-and-saffron",
    name: "Sugar & Saffron",
    locality: "Sector 18",
    city: "Noida",
    provider: "Razorpay",
    grossRevenue: 218_900,
    orders: 528,
    gatewayFees: 5_910,
    netPayout: 212_990,
    status: "On hold",
    settlementDate: "KYC review",
    sparkline: [28, 33, 31, 38, 41, 47, 51],
  },
  {
    id: "madras-filter-room",
    name: "Madras Filter Room",
    locality: "Defence Colony",
    city: "Delhi",
    provider: "Razorpay",
    grossRevenue: 192_600,
    orders: 486,
    gatewayFees: 5_200,
    netPayout: 187_400,
    status: "Pending",
    settlementDate: "22 Aug, 2:00 PM",
    sparkline: [26, 30, 35, 33, 39, 44, 48],
  },
  {
    id: "bamboo-wok",
    name: "Bamboo Wok",
    locality: "Cyber Hub",
    city: "Gurugram",
    provider: "DineBoard Pay",
    grossRevenue: 166_200,
    orders: 438,
    gatewayFees: 4_487,
    netPayout: 161_713,
    status: "Settled",
    settlementDate: "21 Aug, 6:00 PM",
    sparkline: [22, 29, 27, 34, 38, 41, 46],
  },
  {
    id: "saffron-junction",
    name: "Saffron Junction",
    locality: "Nehru Place",
    city: "Delhi",
    provider: "DineBoard Pay",
    grossRevenue: 136_400,
    orders: 364,
    gatewayFees: 3_683,
    netPayout: 132_717,
    status: "Pending",
    settlementDate: "22 Aug, 4:30 PM",
    sparkline: [19, 24, 22, 28, 33, 36, 41],
  },
  {
    id: "the-roasted-bean",
    name: "The Roasted Bean",
    locality: "Sector 15",
    city: "Faridabad",
    provider: "Razorpay",
    grossRevenue: 84_600,
    orders: 248,
    gatewayFees: 2_284,
    netPayout: 82_316,
    status: "Pending",
    settlementDate: "Manual reconciliation",
    sparkline: [18, 21, 20, 25, 24, 28, 31],
  },
];

export const paymentMethodMix = [
  { label: "UPI", share: 72, amount: 1_326_240 },
  { label: "Cards", share: 19, amount: 349_980 },
  { label: "Wallets", share: 6, amount: 110_520 },
  { label: "Net banking", share: 3, amount: 55_260 },
] as const;

export const revenueScopeFactors = {
  city: {
    All: 1,
    Delhi: 0.43,
    Gurugram: 0.26,
    Noida: 0.2,
    Faridabad: 0.11,
  },
  provider: {
    All: 1,
    "DineBoard Pay": 0.304,
    Razorpay: 0.696,
  },
} as const;
