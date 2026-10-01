import CopyEmailLink from "../CopyEmailLink";
import { EMAIL, LINKEDIN } from "../../data/projects";
import { local } from "../../lib/timeline";

const WIRE_YS = [8, 22, 36, 50, 64, 78, 92];

/** The Contact node, opened: its frame, and (from sm up) the seven wires landing in its input port. */
function OutputFrame({ a }: { a: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ opacity: a }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-y-0 left-0 hidden h-full w-[18%] sm:block">
        {WIRE_YS.map((y) => (
          <path key={y} d={`M0 ${y} C 55 ${y}, 45 50, 100 50`} fill="none" stroke="var(--paper)" strokeOpacity="0.5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="absolute left-3 right-20 top-16 bottom-3 rounded-3xl border-2 border-paper/50 sm:top-20 sm:bottom-10 sm:left-[18%] sm:right-28">
        <span className="absolute -top-2.5 left-6 bg-signal-ink px-2 text-xs font-bold leading-5 text-paper">Output · Contact Erin</span>
      </div>
      <span className="absolute left-[18%] top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper sm:block" />
    </div>
  );
}

/** Sits on the --signal-ink field. `inStage`: the live finish (output frame, rail-safe padding); `idPrefix` keeps the heading id unique. */
export default function FinishContent({ t, inStage = false, idPrefix = "" }: { t: number; inStage?: boolean; idPrefix?: string }) {
  const a = local(t, 0.68, 0.15);
  const pad = inStage ? "pl-8 pr-24 sm:pl-[calc(18%+56px)] sm:pr-36" : "px-[clamp(20px,7vw,120px)]";
  return (
    <div className="on-dark relative h-full">
      {inStage && <OutputFrame a={local(t, 0.6, 0.15)} />}
      <div className={`relative flex h-full flex-col justify-center py-20 ${pad}`}>
        <div style={{ opacity: a, transform: `translateY(${(1 - a) * 24}px)` }}>
          <h2 id={`${idPrefix}finish-title`} className="max-w-[12ch] text-[clamp(40px,8vw,96px)] font-black leading-[0.9] tracking-[-0.04em] text-balance">
            Got a process that should run itself?
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={LINKEDIN}
              className="inline-flex min-h-14 items-center rounded-xl bg-ink px-6 text-[17px] font-extrabold text-paper hover:bg-paper hover:text-signal-ink"
            >
              Message on LinkedIn
            </a>
            <CopyEmailLink
              email={EMAIL}
              className="min-h-14 cursor-pointer rounded-xl border-2 border-paper px-6 text-[17px] font-extrabold text-paper hover:bg-paper hover:text-ink"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
