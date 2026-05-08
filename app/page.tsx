import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

const displayFont = "var(--font-unbounded), 'Arial Black', sans-serif";
const bodyFont = "var(--font-epilogue), system-ui, sans-serif";

function AccentBreak() {
  return (
    <section
      id="projects"
      style={{ backgroundColor: "var(--accent)" }}
    >
      <div
        className="px-6 md:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        style={{
          paddingTop: "clamp(3rem, 6vw, 5rem)",
          paddingBottom: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: displayFont,
              fontWeight: 400,
              fontSize: "0.625rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--panel-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            [02] Selected Work
          </p>
          <h2
            style={{
              fontFamily: displayFont,
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 5vw, 5.5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "var(--panel-text)",
            }}
          >
            Real problems.
            <br />
            Real results.
          </h2>
        </div>

        <p
          style={{
            fontFamily: bodyFont,
            fontSize: "0.9375rem",
            lineHeight: 1.75,
            color: "var(--panel-secondary)",
            maxWidth: "32ch",
          }}
        >
          Seven projects across agents, automation, and applied AI — built
          with Claude, n8n, MCP, and Python orchestration.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <AccentBreak />
      <Projects />
      <Contact />
    </main>
  );
}
