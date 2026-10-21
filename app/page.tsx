import HomeScroll from "@/components/home/HomeScroll";

// Home — the six-section scroll (Hero · Demo · Behind the Scenes · Journey ·
// Skills · Contact). All of it is client-driven motion, so the page is a thin
// server shell around the HomeScroll client component. See DESIGN.md §5.
export default function HomePage() {
  return <HomeScroll />;
}
