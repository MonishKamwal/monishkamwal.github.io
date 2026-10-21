import styles from "./story.module.css";

// The one-line "Click/Tap … to read the full story" instruction under a page
// lead. `text` is the trailing clause from content (e.g. "any entry to read the
// full story"); the leading verb swaps with the input device via CSS.
export function CardHint({
  text,
  stagger,
}: {
  text: string;
  stagger?: number;
}) {
  return (
    <p
      className={`card-hint micro reveal ${styles.cardHint}`}
      data-stagger={stagger}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <circle cx="8" cy="8" r="6" />
        <circle cx="8" cy="8" r="1.8" fill="currentColor" stroke="none" />
      </svg>
      <span>
        <span className={styles.onFine}>Click</span>
        <span className={styles.onTouch}>Tap</span> {text}
      </span>
    </p>
  );
}
