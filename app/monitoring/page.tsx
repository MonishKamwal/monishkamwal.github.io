import type { Metadata } from "next";
import { DataShell } from "@/components/data/DataShell";
import { MonitoringPage } from "@/components/data/monitoring/MonitoringPage";
import { monitoring } from "@/lib/content";

export const metadata: Metadata = {
  title: monitoring.title,
  description: monitoring.subtitle,
};

// Monitoring (Data mode): is it holding up against real visitors? Renders live
// from drift.json + feedback.json (and their histories). See DESIGN.md §7.3.
export default function Monitoring() {
  return (
    <DataShell current="/monitoring">
      <MonitoringPage />
    </DataShell>
  );
}
