import type { Metadata } from "next";
import { DataShell } from "@/components/data/DataShell";
import { PerformancePage } from "@/components/data/performance/PerformancePage";
import { performance as perf } from "@/lib/content";

export const metadata: Metadata = {
  title: perf.title,
  description: perf.subtitle,
};

// Performance (Data mode): a snapshot from the last EKS dress rehearsal, served
// straight from api-metrics.json. See DESIGN.md §7.4.
export default function Performance() {
  return (
    <DataShell current="/performance">
      <PerformancePage />
    </DataShell>
  );
}
