import { finishOpen, statusLine } from "../../lib/timeline";

export default function StatusLine({ progress }: { progress: number }) {
  const onOrange = finishOpen(progress) > 0.5;
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 whitespace-nowrap px-[clamp(16px,3vw,40px)] py-3 sm:py-4 ${
        onOrange ? "text-paper" : "text-ink"
      }`}
    >
      <span className="text-[15px] font-black tracking-[-0.01em] sm:text-[17px]">erin-nodland.workflow</span>
      <span className="text-xs font-extrabold sm:text-sm" aria-live="polite">{statusLine(progress)}</span>
    </div>
  );
}
