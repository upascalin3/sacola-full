"use client";

export type ActivityIcon = "success" | "edit" | "delete" | "warning" | "report";

export interface ActivityItem {
  id: string;
  icon: ActivityIcon;
  title: string;
  description?: string;
  timestamp: number; // epoch ms
}

const STORAGE_KEY = "recentActivities";
const MAX_ITEMS = 20;

function readActivities(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ActivityItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeActivities(items: ActivityItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  window.dispatchEvent(new CustomEvent("activity:updated"));
}

export function addActivity(
  partial: Omit<ActivityItem, "id" | "timestamp"> & { timestamp?: number }
) {
  const items = readActivities();
  const next: ActivityItem = {
    id: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
    timestamp: partial.timestamp ?? Date.now(),
    icon: partial.icon,
    title: partial.title,
    description: partial.description,
  };
  const updated = [next, ...items].sort((a, b) => b.timestamp - a.timestamp);
  writeActivities(updated);
}

export function getRecentActivities(): ActivityItem[] {
  return readActivities().sort((a, b) => b.timestamp - a.timestamp);
}

export function subscribeToActivityUpdates(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("activity:updated", handler);
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) handler();
  });
  return () => {
    window.removeEventListener("activity:updated", handler);
  };
}
