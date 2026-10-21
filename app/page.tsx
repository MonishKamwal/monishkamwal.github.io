import Link from "next/link";
import TopBar from "@/components/chrome/TopBar";
import Reveal from "@/components/Reveal";
import SketchDemo from "@/components/home/SketchDemo";
import Bookend from "@/components/home/Bookend";
import { home, skills, journeyEntry } from "@/lib/content";

const washById: Record<string, string> = {
  architecture: "bg-wash-sage",
  journey: "bg-wash-ochre",
  skills: "bg-wash-rose",
};

export default function HomePage() {
  const [arch, journeyTeaser, skillsTeaser] = home.teasers;

  return (
    <>
      <TopBar variant="home" />

      {/* §1 — Hero (white, no label → menu stays hidden here) */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <h1 className="font-display text-6xl leading-none tracking-[-0.02em] text-ink sm:text-8xl">
            {home.hero.name}
          </h1>
          <p className="mt-6 text-sm text-muted sm:text-base">
            {home.hero.tagline}
          </p>
        </Reveal>
        <span
          aria-hidden
          className="absolute bottom-10 animate-pulse text-2xl text-ochre"
        >
          ↓
        </span>
      </section>

      {/* §2 — Live demo (Data "well" ground — foreshadows Data mode) */}
      <section
        data-section-label={home.demo.sectionIndicator}
        className="bg-well px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              {home.demo.title}
            </h2>
            <p className="mt-3 max-w-xl text-muted">{home.demo.lede}</p>
          </Reveal>
          <div className="mt-10">
            <SketchDemo />
          </div>
          <Reveal className="mt-8">
            <Link href={home.demo.cta.href} className="ink-link text-sm">
              {home.demo.cta.label} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* §3 — Architecture teaser (sage) */}
      <Teaser
        label={arch.sectionIndicator}
        wash={washById[arch.id]}
        title={arch.title}
        lede={arch.lede}
        body={arch.body}
        ctaHref={arch.cta.href}
        ctaLabel={arch.cta.label}
      />

      {/* §4 — Journey teaser (ochre) */}
      <section
        data-section-label={journeyTeaser.sectionIndicator}
        className={`${washById[journeyTeaser.id]} px-6 py-24 sm:py-28`}
      >
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              {journeyTeaser.title}
            </h2>
            <p className="mt-2 text-muted">{journeyTeaser.lede}</p>
          </Reveal>
          <ul className="mt-10 flex flex-col gap-8">
            {(journeyTeaser.featuredSlugs ?? []).map((slug, i) => {
              const e = journeyEntry(slug);
              if (!e) return null;
              return (
                <Reveal as="li" key={slug} delay={i * 60}>
                  <p className="micro-label">
                    {formatDate(e.date)} · {e.phase}
                  </p>
                  <Link
                    href={`/journey#${e.slug}`}
                    className="font-display text-2xl text-ink transition-colors hover:text-ochre"
                  >
                    {e.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{e.summary}</p>
                </Reveal>
              );
            })}
          </ul>
          <Reveal className="mt-10">
            <Link href={journeyTeaser.cta.href} className="ink-link text-sm">
              {journeyTeaser.cta.label} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* §5 — Skills teaser (rose) */}
      <section
        data-section-label={skillsTeaser.sectionIndicator}
        className={`${washById[skillsTeaser.id]} px-6 py-24 sm:py-28`}
      >
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              {skillsTeaser.title}
            </h2>
            <p className="mt-2 text-muted">{skillsTeaser.lede}</p>
          </Reveal>
          <ul className="mt-10 flex flex-col gap-4">
            {skills.competencies.map((comp, i) => (
              <Reveal
                as="li"
                key={comp.id}
                delay={i * 50}
                className={i % 2 === 1 ? "sm:ml-16" : ""}
              >
                <span className="text-xl text-ink sm:text-2xl">
                  {comp.tools.map((t) => t.name).join(" · ")}
                </span>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10">
            <Link href={skillsTeaser.cta.href} className="ink-link text-sm">
              {skillsTeaser.cta.label} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* §6 — Bookend (white) */}
      <section
        data-section-label={home.bookend.sectionIndicator}
        id="contact"
        className="flex min-h-[80vh] items-center justify-center px-6 py-24"
      >
        <Bookend />
      </section>
    </>
  );
}

function Teaser({
  label,
  wash,
  title,
  lede,
  body,
  ctaHref,
  ctaLabel,
}: {
  label: string;
  wash: string;
  title: string;
  lede: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <section
      data-section-label={label}
      className={`${wash} px-6 py-24 sm:py-28`}
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            {title}
          </h2>
          <p className="mt-2 text-muted">{lede}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
            {body}
          </p>
          <Link href={ctaHref} className="ink-link mt-8 inline-block text-sm">
            {ctaLabel} →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}
