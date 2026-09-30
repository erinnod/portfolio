import CopyEmailLink from "../CopyEmailLink";
import { EMAIL, LINKEDIN } from "../../data/projects";
import { local } from "../../lib/timeline";

export default function FinishContent({ t }: { t: number }) {
  const a = local(t, 0.68, 0.15);
  return (
    <div className="flex h-full flex-col justify-center px-[clamp(20px,7vw,120px)] py-20">
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 24}px)` }}>
        <p className="text-base font-extrabold text-paper/85">Workflow finished · 7 nodes run</p>
        <h2 id="finish-title" className="mt-4 max-w-[12ch] text-[clamp(52px,8vw,96px)] font-black leading-[0.9] tracking-[-0.04em] text-balance">
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
  );
}
