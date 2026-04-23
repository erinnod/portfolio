import FadeIn from "./FadeIn";

const displayFont = "var(--font-unbounded), 'Arial Black', sans-serif";
const bodyFont = "var(--font-epilogue), system-ui, sans-serif";

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
        paddingTop: "clamp(4rem, 8vw, 7rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
      }}
    >
      {/* Section label */}
      <FadeIn>
        <div
          className="flex items-baseline gap-4 px-6 md:px-10"
          style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <span
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: "0.6875rem",
              letterSpacing: "0.2em",
              color: "var(--ink-3)",
            }}
          >
            [03]
          </span>
          <span
            style={{
              fontFamily: bodyFont,
              fontSize: "0.6875rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--ink-ghost)",
            }}
          >
            Contact
          </span>
        </div>
      </FadeIn>

      <div className="px-6 md:px-10">
        {/* Headline */}
        <FadeIn delay={1}>
          <h2
            style={{
              fontFamily: displayFont,
              fontWeight: 900,
              fontSize: "clamp(3.5rem, 9vw, 10rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            Let&apos;s
            <br />
            talk.
          </h2>
        </FadeIn>

        {/* Body */}
        <FadeIn delay={2}>
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "var(--ink-2)",
              maxWidth: "44ch",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Want to talk about AI automation, agents, or how to make your
            business actually use AI? Get in touch.
          </p>
        </FadeIn>

        {/* Links */}
        <FadeIn delay={3}>
          <div className="flex flex-col sm:flex-row" style={{ gap: "2rem" }}>
            <ContactLink
              href="https://www.linkedin.com/in/erin-nodland/"
              label="LinkedIn"
              external
            />
            <ContactLink
              href="mailto:erin.nodland@shoothill.com"
              label="Email"
            />
          </div>

          {/* Visible email address — fallback for machines without a mail client */}
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: "0.8125rem",
              letterSpacing: "0.03em",
              color: "var(--ink-ghost)",
              marginTop: "1.25rem",
              userSelect: "all",
            }}
          >
            erin.nodland@shoothill.com
          </p>
        </FadeIn>

        {/* Footer */}
        <FadeIn>
          <div
            style={{
              marginTop: "clamp(4rem, 8vw, 6rem)",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "0.625rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--ink-ghost)",
              }}
            >
              Erin Nodland &copy; 2025
            </p>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "0.625rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--ink-ghost)",
              }}
            >
              Shoothill · UK
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ContactLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center"
      style={{ gap: "0.875rem", textDecoration: "none" }}
    >
      <span
        className="group-hover:translate-x-1 transition-transform duration-200"
        style={{
          fontFamily: displayFont,
          fontWeight: 900,
          fontSize: "0.875rem",
          color: "var(--accent)",
        }}
      >
        →
      </span>
      <span
        className="group-hover:opacity-60 transition-opacity duration-200"
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </a>
  );
}
