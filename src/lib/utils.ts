import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Converts an array of records to a CSV string with headers
export function convertObjectsToCsv(
  rows: Array<Record<string, unknown>>
): string {
  if (!rows || rows.length === 0) {
    return "";
  }

  const headers = Array.from(
    rows.reduce<Set<string>>((set, row) => {
      Object.keys(row || {}).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  );

  const escapeCsvValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    let str = value instanceof Date ? value.toISOString() : String(value);
    // Escape quotes by doubling them
    str = str.replace(/"/g, '""');
    // Wrap in quotes if contains comma, quote, or newline
    if (/[",\n]/.test(str)) {
      return `"${str}"`;
    }
    return str;
  };

  const headerLine = headers.map((h) => escapeCsvValue(h)).join(",");
  const dataLines = rows.map((row) =>
    headers
      .map((key) => escapeCsvValue((row as Record<string, unknown>)[key]))
      .join(",")
  );

  return [headerLine, ...dataLines].join("\n");
}

// Triggers a download of the given CSV content as a file in the browser
export function downloadCsv(filename: string, csvContent: string) {
  if (!csvContent) return;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convenience helper: directly download CSV from objects
export function downloadCsvFromObjects(
  filename: string,
  rows: Array<Record<string, unknown>>
) {
  const csv = convertObjectsToCsv(rows);
  downloadCsv(filename, csv);
}
