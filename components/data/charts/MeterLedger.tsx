import { fmtComma } from "@/lib/data/format";
import { StatusChip, type ChipKind } from "../ui";

export type LedgerRow = {
  code: string;
  kind: Exclude<ChipKind, "mock">;
  color: string;
  count: number;
};

// The status-code ledger (Performance): every response accounted for, as a row
// of meters. Ported from the prototype's status ledger. An empty 5xx row reads
// as clean because nothing failed.
export function MeterLedger({ rows, total }: { rows: LedgerRow[]; total: number }) {
  return (
    <div>
      {rows.map((r) => {
        const share = total > 0 ? r.count / total : 0;
        return (
          <div className="meter-row" key={r.code}>
            <StatusChip kind={r.kind} label={r.code} />
            <div className="meter-track">
              <div
                className="meter-fill"
                style={{ width: `${Math.max(1.2, share * 100)}%`, background: r.color }}
              />
            </div>
            <div className="meter-num">
              {fmtComma(r.count)}
              <span className="sh">{(share * 100).toFixed(share > 0.05 ? 1 : 2)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
