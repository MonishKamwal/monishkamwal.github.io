import Link from "next/link";
import styles from "./story.module.css";

// The docking ribbon at the foot of a Story page: "Next · <Page> → <peek>".
// A real route link (client transition), so the reading chain flows page to page.
// Structural prop so About can point it at Contact (the Home bookend), not a page.
export function ReadNext({ next }: { next: { name: string; href: string; peek: string } }) {
  return (
    <nav className={`reveal ${styles.readNext}`} aria-label="Continue reading">
      <Link className={styles.rnLink} href={next.href}>
        <span className={styles.rnCue}>Next</span>
        <span className={styles.rnRow}>
          <span className={styles.rnName}>{next.name}</span>
          <svg className={styles.rnArrow} viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M1 6h15M11 1l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.rnPeek}>{next.peek}</span>
      </Link>
    </nav>
  );
}
