"use client";

import { useSearchParams } from "next/navigation";
import { QrCode } from "lucide-react";

/** Shows the table number carried by a QR menu link after hydration. */
export function TableContextBadge({ outletName }: { outletName: string }) {
  const table = useSearchParams().get("table");
  const tableNumber = table && /^\d{1,3}$/.test(table) ? Number(table) : null;

  if (tableNumber === null) return null;

  return (
    <p className="mb-6 inline-flex items-center gap-2 rounded-pill border border-primary/20 bg-primary-soft px-4 py-2 text-sm font-semibold text-primary-strong">
      <QrCode className="size-4" aria-hidden="true" />
      You are at Table {tableNumber} · {outletName}
    </p>
  );
}
