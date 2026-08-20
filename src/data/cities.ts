import type { CityOption } from "@/types/content";

/** The city the platform launches with. */
export const DEFAULT_CITY_ID = "delhi";

/**
 * Delhi is live; the rest are pipeline markets rendered as disabled options in
 * the location selector so the roadmap is visible without over-promising.
 */
export const cities: CityOption[] = [
  {
    id: "delhi",
    name: "Delhi",
    state: "Delhi",
    available: true,
    localities: [
      "Connaught Place",
      "Hauz Khas",
      "Saket",
      "Vasant Kunj",
      "Greater Kailash",
      "Defence Colony",
      "Lajpat Nagar",
      "Karol Bagh",
      "Chandni Chowk",
      "Rajouri Garden",
      "Green Park",
      "Nehru Place",
      "Malviya Nagar",
      "Punjabi Bagh",
      "Janakpuri",
      "Dwarka",
      "Rohini",
      "Pitampura",
      "Model Town",
      "Kalkaji",
      "Safdarjung Enclave",
      "Mayur Vihar",
      "Preet Vihar",
      "Paschim Vihar",
    ],
  },
  { id: "gurugram", name: "Gurugram", state: "Haryana", available: false, localities: [] },
  { id: "noida", name: "Noida", state: "Uttar Pradesh", available: false, localities: [] },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", available: false, localities: [] },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", available: false, localities: [] },
];

export function getCity(cityId: string): CityOption | undefined {
  return cities.find((city) => city.id === cityId);
}
