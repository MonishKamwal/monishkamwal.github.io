// The WCAG-clean twin of every chart (DESIGN.md §7.1): "tooltips enhance,
// tables guarantee". Right-aligned, tabular numerals on the numeric columns.
export function DataTable({
  heads,
  rows,
  numCols,
  champRow,
}: {
  heads: string[];
  rows: React.ReactNode[][];
  numCols: number[];
  /** index of a row to tint as the champion (Quality runs table). */
  champRow?: number;
}) {
  return (
    <div className="tscroll">
      <table className="dtable">
        <thead>
          <tr>
            {heads.map((h, i) => (
              <th key={i} className={numCols.includes(i) ? "num" : undefined}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={ri === champRow ? "row-champ" : undefined}>
              {r.map((c, i) => (
                <td key={i} className={numCols.includes(i) ? "num" : undefined}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
