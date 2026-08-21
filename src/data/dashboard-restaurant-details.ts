import { managedRestaurants } from "@/data/dashboard-restaurants";

export type DetailPeriod = "daily" | "monthly";
export type DetailMetric = "revenue" | "orders" | "customers";
export type MenuDiet = "veg" | "non-veg" | "egg";

export interface RestaurantTrendPoint {
  id: string;
  label: string;
  fullLabel: string;
  revenue: number;
  previousRevenue: number;
  completedOrders: number;
  previousCompletedOrders: number;
  cancelledOrders: number;
  previousCancelledOrders: number;
  customerVisits: number;
  previousCustomerVisits: number;
}

export interface RestaurantOutletDetail {
  id: string;
  name: string;
  locality: string;
  address: string;
  isMainBranch: boolean;
  contribution: number;
  seatingCapacity: number;
  serviceStatus: "online" | "paused" | "onboarding";
  daily: RestaurantTrendPoint[];
  monthly: RestaurantTrendPoint[];
}

export interface RestaurantMenuItem {
  id: string;
  name: string;
  category: string;
  diet: MenuDiet;
  price: number;
  orders: number;
  revenue: number;
  available: boolean;
  outletIds: string[];
  bestseller: boolean;
}

export interface DashboardRestaurantDetail {
  restaurantId: string;
  cuisines: string[];
  outlets: RestaurantOutletDetail[];
  menuItems: RestaurantMenuItem[];
}

interface OutletSeed {
  name: string;
  locality: string;
  address: string;
  share: number;
}

type MenuSeed = [name: string, category: string, diet: MenuDiet, price: number];

const outletSeeds: Record<string, OutletSeed[]> = {
  "rst-copper-tandoor": [
    { name: "Connaught Place", locality: "Connaught Place", address: "N-Block, Outer Circle, Connaught Place", share: 0.46 },
    { name: "Saket", locality: "Saket", address: "Saket District Centre", share: 0.31 },
    { name: "Punjabi Bagh", locality: "Punjabi Bagh", address: "Club Road, West Punjabi Bagh", share: 0.23 },
  ],
  "rst-nawabs-table": [
    { name: "Karol Bagh", locality: "Karol Bagh", address: "Ajmal Khan Road, Karol Bagh", share: 0.59 },
    { name: "Chandni Chowk", locality: "Chandni Chowk", address: "Gali Paranthe Wali, Chandni Chowk", share: 0.41 },
  ],
  "rst-saffron-junction": [
    { name: "Saket", locality: "Saket", address: "Sector 6, Pushp Vihar", share: 0.61 },
    { name: "Dwarka", locality: "Dwarka", address: "Sector 12 Market, Dwarka", share: 0.39 },
  ],
  "rst-dilli-chaat-company": [
    { name: "Chandni Chowk", locality: "Chandni Chowk", address: "Kinari Bazaar Road", share: 0.67 },
    { name: "Lajpat Nagar", locality: "Lajpat Nagar", address: "Central Market, Lajpat Nagar II", share: 0.33 },
  ],
  "rst-madras-filter-room": [
    { name: "Green Park", locality: "Green Park", address: "Main Market, Green Park", share: 0.43 },
    { name: "Malviya Nagar", locality: "Malviya Nagar", address: "Shivalik Road, Malviya Nagar", share: 0.34 },
    { name: "Mayur Vihar", locality: "Mayur Vihar", address: "Phase 1 Market, Mayur Vihar", share: 0.23 },
  ],
  "rst-bamboo-wok": [
    { name: "Sector 29", locality: "Sector 29", address: "Leisure Valley Road, Gurugram", share: 1 },
  ],
  "rst-trattoria-nove": [
    { name: "Hauz Khas", locality: "Hauz Khas", address: "Deer Park Road, Hauz Khas Village", share: 1 },
  ],
  "rst-the-roasted-bean": [
    { name: "Greater Kailash", locality: "Greater Kailash", address: "M-Block Market, Greater Kailash I", share: 0.58 },
    { name: "Hauz Khas", locality: "Hauz Khas", address: "SDA Market, Hauz Khas", share: 0.42 },
  ],
  "rst-green-leaf-bhojanalya": [
    { name: "Sector 18", locality: "Sector 18", address: "Atta Market, Sector 18, Noida", share: 0.62 },
    { name: "Sector 62", locality: "Sector 62", address: "Electronic City, Sector 62, Noida", share: 0.38 },
  ],
  "rst-sugar-saffron": [
    { name: "Golf Course Road", locality: "Golf Course Road", address: "One Horizon Centre, Gurugram", share: 1 },
  ],
  "rst-spice-route-kitchen": [
    { name: "Dwarka", locality: "Dwarka", address: "Sector 12 City Centre, Dwarka", share: 1 },
  ],
  "rst-coastal-table": [
    { name: "Sector 104", locality: "Sector 104", address: "Hazipur Market, Sector 104, Noida", share: 0.64 },
    { name: "Sector 18", locality: "Sector 18", address: "Wave Silver Tower, Sector 18, Noida", share: 0.36 },
  ],
};

const cuisineProfiles: Record<string, string[]> = {
  "rst-copper-tandoor": ["North Indian", "Mughlai", "Tandoor"],
  "rst-nawabs-table": ["Awadhi", "Mughlai", "Kebabs"],
  "rst-saffron-junction": ["Hyderabadi", "Biryani", "North Indian"],
  "rst-dilli-chaat-company": ["Street Food", "Chaat", "Fast Food"],
  "rst-madras-filter-room": ["South Indian", "Breakfast", "Cafe"],
  "rst-bamboo-wok": ["Chinese", "Asian", "Thai"],
  "rst-trattoria-nove": ["Italian", "Pizza", "Continental"],
  "rst-the-roasted-bean": ["Cafe", "Continental", "Desserts"],
  "rst-green-leaf-bhojanalya": ["North Indian", "Thali", "Pure Veg"],
  "rst-sugar-saffron": ["Desserts", "Bakery", "Patisserie"],
  "rst-spice-route-kitchen": ["Indian", "Coastal", "Regional"],
  "rst-coastal-table": ["Seafood", "Kerala", "Coastal"],
};

const menuProfiles: Record<string, MenuSeed[]> = {
  "rst-copper-tandoor": [
    ["Butter Chicken", "Main Course", "non-veg", 495], ["Dal Makhani", "Main Course", "veg", 345], ["Paneer Tikka", "Starters", "veg", 395], ["Chicken Seekh Kebab", "Starters", "non-veg", 445], ["Garlic Naan", "Breads", "veg", 110], ["Phirni", "Desserts", "veg", 185],
  ],
  "rst-nawabs-table": [
    ["Galouti Kebab", "Kebabs", "non-veg", 525], ["Awadhi Dum Biryani", "Biryani", "non-veg", 495], ["Paneer Pasanda", "Main Course", "veg", 425], ["Kakori Kebab", "Kebabs", "non-veg", 565], ["Warqi Paratha", "Breads", "veg", 125], ["Shahi Tukda", "Desserts", "veg", 210],
  ],
  "rst-saffron-junction": [
    ["Hyderabadi Dum Biryani", "Biryani", "non-veg", 465], ["Paneer Biryani", "Biryani", "veg", 395], ["Chicken 65", "Starters", "non-veg", 385], ["Mirchi Ka Salan", "Sides", "veg", 195], ["Double Ka Meetha", "Desserts", "veg", 185], ["Boiled Egg Biryani", "Biryani", "egg", 345],
  ],
  "rst-dilli-chaat-company": [
    ["Aloo Tikki Chaat", "Chaat", "veg", 120], ["Raj Kachori", "Chaat", "veg", 165], ["Dahi Bhalla", "Chaat", "veg", 145], ["Paneer Kathi Roll", "Rolls", "veg", 225], ["Egg Kathi Roll", "Rolls", "egg", 245], ["Kulfi Falooda", "Desserts", "veg", 170],
  ],
  "rst-madras-filter-room": [
    ["Ghee Roast Masala Dosa", "Breakfast", "veg", 245], ["Podi Idli", "Breakfast", "veg", 185], ["Mysore Masala Dosa", "Breakfast", "veg", 265], ["Mini Tiffin", "Combos", "veg", 295], ["Egg Appam", "Breakfast", "egg", 235], ["Filter Coffee", "Beverages", "veg", 95],
  ],
  "rst-bamboo-wok": [
    ["Chilli Garlic Noodles", "Noodles", "veg", 320], ["Kung Pao Chicken", "Main Course", "non-veg", 445], ["Crispy Corn", "Starters", "veg", 295], ["Chicken Dimsum", "Dimsum", "non-veg", 365], ["Thai Basil Tofu", "Main Course", "veg", 395], ["Caramel Custard", "Desserts", "egg", 225],
  ],
  "rst-trattoria-nove": [
    ["Truffle Mushroom Pizza", "Pizza", "veg", 680], ["Spaghetti Carbonara", "Pasta", "non-veg", 725], ["Burrata Pomodoro", "Starters", "veg", 595], ["Chicken Piccata", "Main Course", "non-veg", 795], ["Aglio e Olio", "Pasta", "veg", 585], ["Classic Tiramisu", "Desserts", "egg", 395],
  ],
  "rst-the-roasted-bean": [
    ["Avocado Toast", "All Day Breakfast", "veg", 365], ["Grilled Chicken Sandwich", "Sandwiches", "non-veg", 395], ["Shakshuka", "All Day Breakfast", "egg", 425], ["Pesto Pasta", "Pasta", "veg", 445], ["Basque Cheesecake", "Desserts", "egg", 285], ["Single Origin Pour Over", "Coffee", "veg", 225],
  ],
  "rst-green-leaf-bhojanalya": [
    ["Unlimited Punjabi Thali", "Thali", "veg", 249], ["Chole Bhature", "Main Course", "veg", 185], ["Paneer Butter Masala", "Main Course", "veg", 325], ["Dal Tadka", "Main Course", "veg", 245], ["Tandoori Roti", "Breads", "veg", 45], ["Gulab Jamun", "Desserts", "veg", 95],
  ],
  "rst-sugar-saffron": [
    ["Saffron Tres Leches", "Cakes", "veg", 345], ["Tiramisu Jar", "Desserts", "egg", 295], ["Kesar Pista Entremet", "Patisserie", "veg", 365], ["Belgian Chocolate Tart", "Patisserie", "egg", 325], ["Rose Milk Cake", "Cakes", "veg", 285], ["Almond Croissant", "Bakery", "egg", 245],
  ],
  "rst-spice-route-kitchen": [
    ["Chettinad Chicken", "Main Course", "non-veg", 445], ["Malabar Parotta", "Breads", "veg", 95], ["Pepper Paneer", "Main Course", "veg", 385], ["Mutton Sukka", "Starters", "non-veg", 525], ["Egg Appam", "Breads", "egg", 165], ["Payasam", "Desserts", "veg", 175],
  ],
  "rst-coastal-table": [
    ["Kerala Fish Curry", "Main Course", "non-veg", 565], ["Prawn Ghee Roast", "Starters", "non-veg", 625], ["Vegetable Stew", "Main Course", "veg", 395], ["Chicken Ishtu", "Main Course", "non-veg", 475], ["Appam", "Breads", "veg", 85], ["Elaneer Payasam", "Desserts", "veg", 225],
  ],
};

const dayLabelFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
const fullDayFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const monthLabels = ["Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26"];

function hashText(value: string): number {
  return [...value].reduce((total, char) => (total * 31 + char.charCodeAt(0)) % 100_003, 17);
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function distribute(total: number, count: number, seed: number): number[] {
  if (total <= 0) return Array.from({ length: count }, () => 0);
  const weights = Array.from({ length: count }, (_, index) => 70 + ((seed + index * 37 + (index % 5) * 19) % 61));
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const values = weights.map((weight) => Math.floor((total * weight) / weightTotal));
  let remainder = total - values.reduce((sum, value) => sum + value, 0);
  let cursor = seed % count;
  while (remainder > 0) {
    values[cursor] += 1;
    remainder -= 1;
    cursor = (cursor + 7) % count;
  }
  return values;
}

function makeDailySeries(completed: number, averageTicket: number, seed: number): RestaurantTrendPoint[] {
  const cancelled = Math.round(completed * (0.035 + (seed % 4) * 0.007));
  const customers = Math.round(completed * (1.32 + (seed % 5) * 0.08));
  const revenue = completed * averageTicket;
  const completedValues = distribute(completed, 30, seed);
  const cancelledValues = distribute(cancelled, 30, seed + 13);
  const customerValues = distribute(customers, 30, seed + 29);
  const revenueValues = distribute(revenue, 30, seed + 47);

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 6, 23 + index));
    const previousFactor = 0.84 + ((seed + index * 11) % 9) / 100;
    return {
      id: date.toISOString().slice(0, 10),
      label: dayLabelFormatter.format(date),
      fullLabel: fullDayFormatter.format(date),
      revenue: revenueValues[index],
      previousRevenue: Math.round(revenueValues[index] * previousFactor),
      completedOrders: completedValues[index],
      previousCompletedOrders: Math.round(completedValues[index] * previousFactor),
      cancelledOrders: cancelledValues[index],
      previousCancelledOrders: Math.round(cancelledValues[index] * previousFactor),
      customerVisits: customerValues[index],
      previousCustomerVisits: Math.round(customerValues[index] * previousFactor),
    };
  });
}

function makeMonthlySeries(currentCompleted: number, averageTicket: number, seed: number): RestaurantTrendPoint[] {
  const monthIds = [
    "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02",
    "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08",
  ];
  return monthLabels.map((label, index) => {
    const factor = index === 11 ? 1 : 0.68 + index * 0.026 + ((seed + index * 7) % 8) / 100;
    const completedOrders = Math.round(currentCompleted * factor);
    const cancelledOrders = Math.round(completedOrders * (0.036 + ((seed + index) % 4) * 0.007));
    const customerVisits = Math.round(completedOrders * (1.32 + (seed % 5) * 0.08));
    const revenue = Math.round(completedOrders * averageTicket * (index === 11 ? 1 : 0.96 + ((seed + index) % 6) / 100));
    const previousFactor = 0.86 + ((seed + index * 5) % 8) / 100;
    return {
      id: monthIds[index],
      label: label.slice(0, 3),
      fullLabel: label,
      revenue,
      previousRevenue: Math.round(revenue * previousFactor),
      completedOrders,
      previousCompletedOrders: Math.round(completedOrders * previousFactor),
      cancelledOrders,
      previousCancelledOrders: Math.round(cancelledOrders * previousFactor),
      customerVisits,
      previousCustomerVisits: Math.round(customerVisits * previousFactor),
    };
  });
}

function buildDetail(restaurantId: string, index: number): DashboardRestaurantDetail {
  const restaurant = managedRestaurants[index];
  const seeds = outletSeeds[restaurantId];
  const seed = hashText(restaurantId);
  const averageTicket = 430 + (seed % 8) * 55;
  const completedByOutlet = distribute(restaurant.ordersThisMonth, seeds.length, seed + 5);

  const outlets = seeds.map((outlet, outletIndex): RestaurantOutletDetail => {
    const id = `${restaurantId}-${slugify(outlet.name)}`;
    const completed = completedByOutlet[outletIndex];
    return {
      id,
      name: outlet.name,
      locality: outlet.locality,
      address: outlet.address,
      isMainBranch: outletIndex === 0,
      contribution: outlet.share,
      seatingCapacity: 36 + ((seed + outletIndex * 17) % 58),
      serviceStatus:
        restaurant.status === "pending"
          ? "onboarding"
          : restaurant.status === "active"
            ? "online"
            : "paused",
      daily: makeDailySeries(completed, averageTicket, seed + outletIndex * 101),
      monthly: makeMonthlySeries(completed, averageTicket, seed + outletIndex * 101),
    };
  });

  const allOutletIds = outlets.map((outlet) => outlet.id);
  const menuSeeds = menuProfiles[restaurantId];
  const menuOrderWeights = distribute(Math.max(restaurant.ordersThisMonth * 2, menuSeeds.length * 8), menuSeeds.length, seed + 71);
  const menuItems = menuSeeds.map((item, itemIndex): RestaurantMenuItem => {
    const [name, category, diet, price] = item;
    const orders = menuOrderWeights[itemIndex];
    const outletIds =
      allOutletIds.length > 1 && itemIndex === menuSeeds.length - 1
        ? allOutletIds.slice(0, -1)
        : allOutletIds;
    return {
      id: `${restaurantId}-menu-${itemIndex + 1}`,
      name,
      category,
      diet,
      price,
      orders,
      revenue: orders * price,
      available: restaurant.status !== "blocked" && restaurant.status !== "pending",
      outletIds,
      bestseller: itemIndex === 0,
    };
  });

  return {
    restaurantId,
    cuisines: cuisineProfiles[restaurantId],
    outlets,
    menuItems,
  };
}

export const dashboardRestaurantDetails: DashboardRestaurantDetail[] = managedRestaurants.map(
  (restaurant, index) => buildDetail(restaurant.id, index),
);

export function getDashboardRestaurantDetail(restaurantId: string): DashboardRestaurantDetail | undefined {
  return dashboardRestaurantDetails.find((detail) => detail.restaurantId === restaurantId);
}

export function aggregateRestaurantSeries(
  outlets: RestaurantOutletDetail[],
  period: DetailPeriod,
): RestaurantTrendPoint[] {
  const source = outlets.map((outlet) => outlet[period]);
  const pointCount = source[0]?.length ?? 0;
  return Array.from({ length: pointCount }, (_, index) => {
    const points = source.map((series) => series[index]);
    const first = points[0];
    return {
      id: first.id,
      label: first.label,
      fullLabel: first.fullLabel,
      revenue: points.reduce((sum, point) => sum + point.revenue, 0),
      previousRevenue: points.reduce((sum, point) => sum + point.previousRevenue, 0),
      completedOrders: points.reduce((sum, point) => sum + point.completedOrders, 0),
      previousCompletedOrders: points.reduce((sum, point) => sum + point.previousCompletedOrders, 0),
      cancelledOrders: points.reduce((sum, point) => sum + point.cancelledOrders, 0),
      previousCancelledOrders: points.reduce((sum, point) => sum + point.previousCancelledOrders, 0),
      customerVisits: points.reduce((sum, point) => sum + point.customerVisits, 0),
      previousCustomerVisits: points.reduce((sum, point) => sum + point.previousCustomerVisits, 0),
    };
  });
}
