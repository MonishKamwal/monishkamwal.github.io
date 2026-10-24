import type { Metadata } from "next";
import { DataShell } from "@/components/data/DataShell";
import { QualityPage } from "@/components/data/quality/QualityPage";
import { quality } from "@/lib/content";

export const metadata: Metadata = {
  title: quality.title,
  description: quality.subtitle,
};

// Quality (Data mode): the model's report card, regenerated on every deploy.
// Renders live from evidence.json. See DESIGN.md §7.2.
export default function Quality() {
  return (
    <DataShell current="/quality">
      <QualityPage />
    </DataShell>
  );
}
