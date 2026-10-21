import { site } from "@/lib/content";

// The slide-in menu (opened by useHomeMotion via #menuBtn/#mScrim/#mClose).
// Four groups — Start · The Data · The Story · More — from site.nav. The
// Contact item carries #mContact so the loop can deep-link the Home bookend.
const menuGroups = [
  { label: "Start", items: [{ label: site.nav.homeLabel, href: "/", id: "mHome" }] },
  ...site.nav.groups.map((g) => ({
    label: g.label,
    items: g.items.map((it) => ({
      label: it.label,
      href: it.href,
      id: it.label === "Contact" ? "mContact" : undefined,
    })),
  })),
];

export function Menu() {
  return (
    <>
      <div className="m-scrim" id="mScrim" />
      <aside className="menu-panel" id="menuPanel" aria-hidden="true" aria-label="Site menu">
        <div className="menu-head">
          <span className="micro">{site.nav.menuLabel}</span>
          <button className="m-close" id="mClose" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M2 2l16 16M18 2L2 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav>
          {menuGroups.map((g) => (
            <div className="menu-group" key={g.label}>
              <span className="menu-cat micro">{g.label}</span>
              {g.items.map((it) => (
                <a className="menu-link" href={it.href} id={it.id} key={it.label}>
                  {it.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
