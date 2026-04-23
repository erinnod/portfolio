"use client";
import { useState, useEffect } from "react";

const links = [
  { label: "About", href: "#about", id: "about" },
  { label: "Work", href: "#projects", id: "projects" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);

      let current = "";
      for (const { id } of links) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "oklch(97% 0.006 22 / 0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid oklch(88% 0.006 22)"
          : "1px solid transparent",
      }}
    >
      <a
        href="#"
        style={{
          fontFamily: "var(--font-unbounded), 'Arial Black', sans-serif",
          fontWeight: 700,
          fontSize: "0.625rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--ink)",
          textDecoration: "none",
        }}
      >
        Erin Nodland
      </a>

      <div className="flex items-center gap-8">
        {links.map(({ label, href, id }) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: "var(--font-epilogue), system-ui, sans-serif",
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: activeSection === id ? "var(--accent)" : "var(--ink-3)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color =
                activeSection === id ? "var(--accent)" : "var(--ink)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color =
                activeSection === id ? "var(--accent)" : "var(--ink-3)")
            }
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
