import { INTRO, easeOut } from "../../lib/timeline";
import { PITCH } from "../../data/projects";

export default function Intro({ progress }: { progress: number }) {
  const gone = easeOut(progress / (INTRO * 0.6));
  if (gone >= 1) return null;
  return (
    <div
      className="pointer-events-none absolute bottom-[clamp(28px,7vh,72px)] left-[clamp(20px,5vw,72px)]"
      style={{ opacity: 1 - gone, transform: `translateY(${gone * -30}px)` }}
    >
      <p className="max-w-[30ch] text-[clamp(20px,2vw,28px)] font-bold leading-snug">{PITCH}</p>
      <p className="nudge mt-5 inline-flex items-center gap-2.5 text-[15px] font-extrabold text-signal-ink">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M9 2v13M3.5 9.5L9 15l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Scroll to run the workflow
      </p>
    </div>
  );
}
