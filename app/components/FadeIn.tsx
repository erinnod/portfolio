"use client";
import { useEffect, useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
}

export default function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.classList.add("visible");
      observer.disconnect();
      el.removeEventListener("focusin", reveal);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    // Reveal on keyboard focus so screen-reader / tab users
    // aren't trapped inside an invisible opacity-0 element
    el.addEventListener("focusin", reveal, { once: true });

    return () => {
      observer.disconnect();
      el.removeEventListener("focusin", reveal);
    };
  }, []);

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";

  return (
    <div ref={ref} className={`reveal ${delayClass} ${className ?? ""}`}>
      {children}
    </div>
  );
}
