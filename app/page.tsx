import StaticRun from "./components/run/StaticRun";
import StaticGraph from "./components/run/StaticGraph";

export default function Home() {
  return (
    <main>
      <StaticRun graph={<StaticGraph />} />
      <footer className="flex flex-wrap justify-between gap-4 px-[clamp(20px,5vw,72px)] py-10 text-sm font-bold text-muted">
        <span>© 2026 Erin Nodland</span>
        <span>Built with Claude Code</span>
      </footer>
    </main>
  );
}
