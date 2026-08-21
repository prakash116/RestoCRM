"use client";

import {
  managedRestaurants,
  type ManagedRestaurant,
  type MembershipStatus,
  type RestaurantStatus,
} from "@/data/dashboard-restaurants";

interface RestaurantSnapshot {
  version: 1;
  records: ManagedRestaurant[];
}

const STORAGE_KEY = "dineboard.dashboard-restaurants.v1";
const CHANGE_EVENT = "dineboard-dashboard-restaurants-change";
const DEFAULT_SNAPSHOT: RestaurantSnapshot = { version: 1, records: managedRestaurants };

export const DEFAULT_RESTAURANT_REGISTRY_SNAPSHOT = JSON.stringify(DEFAULT_SNAPSHOT);
let volatileSnapshot = DEFAULT_RESTAURANT_REGISTRY_SNAPSHOT;

function isRestaurantStatus(value: unknown): value is RestaurantStatus {
  return value === "active" || value === "inactive" || value === "blocked" || value === "pending";
}

function isRestorableRestaurantStatus(
  value: unknown,
): value is Exclude<RestaurantStatus, "blocked"> {
  return value === "active" || value === "inactive" || value === "pending";
}

function isMembershipStatus(value: unknown): value is MembershipStatus {
  return value === "active" || value === "expiring" || value === "expired" || value === "not_started";
}

function isManagedRestaurant(value: unknown): value is ManagedRestaurant {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ManagedRestaurant>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.locality === "string" &&
    (record.city === "Delhi" || record.city === "Gurugram" || record.city === "Noida") &&
    typeof record.ownerName === "string" &&
    typeof record.email === "string" &&
    typeof record.phone === "string" &&
    (record.plan === "Restaurant Pro" ||
      record.plan === "Digital Presence" ||
      record.plan === "QR Starter") &&
    isRestaurantStatus(record.status) &&
    (record.statusBeforeBlock === undefined || isRestorableRestaurantStatus(record.statusBeforeBlock)) &&
    isMembershipStatus(record.membership) &&
    (record.planActive === undefined || typeof record.planActive === "boolean") &&
    typeof record.onboardingProgress === "number" &&
    typeof record.outletCount === "number" &&
    typeof record.rating === "number" &&
    typeof record.ordersThisMonth === "number"
  );
}

export function subscribeRestaurantRegistry(callback: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function getRestaurantRegistrySnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? volatileSnapshot;
  } catch {
    return volatileSnapshot;
  }
}

export function getServerRestaurantRegistrySnapshot(): string {
  return DEFAULT_RESTAURANT_REGISTRY_SNAPSHOT;
}

export function parseRestaurantRegistry(snapshot: string): ManagedRestaurant[] {
  try {
    const value = JSON.parse(snapshot) as Partial<RestaurantSnapshot>;
    if (value.version !== 1 || !Array.isArray(value.records)) return managedRestaurants;
    const records = value.records.filter(isManagedRestaurant);
    if (records.length !== value.records.length) return managedRestaurants;
    const baselineCounts = new Map(managedRestaurants.map((record) => [record.id, record.outletCount]));
    return records.map((record) => ({
      ...record,
      outletCount: baselineCounts.get(record.id) ?? record.outletCount,
    }));
  } catch {
    return managedRestaurants;
  }
}

export function saveRestaurantRegistry(records: ManagedRestaurant[]): void {
  const snapshot = JSON.stringify({ version: 1, records } satisfies RestaurantSnapshot);
  volatileSnapshot = snapshot;

  try {
    window.localStorage.setItem(STORAGE_KEY, snapshot);
  } catch {
    /* The in-memory snapshot keeps controls working when storage is unavailable. */
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}
