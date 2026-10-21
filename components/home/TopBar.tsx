// Fixed top bar: the current-section indicator (left) and the hero-gated menu
// button (right). Both are driven by useHomeMotion via their ids — the markup
// is static. Reuses the global .topbar/.menu-btn chrome.
export function TopBar() {
  return (
    <div className="topbar">
      <span className="indicator" id="indicator" aria-live="polite" />
      <button
        className="menu-btn"
        id="menuBtn"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="menuPanel"
      >
        <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M1 1h24M1 7h24M1 13h24" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
