import { finishOpen, statusLine } from "../../lib/timeline";

export default function StatusLine({ progress }: { progress: number }) {
  const onOrange = finishOpen(progress) > 0.5;
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[clamp(20px,3vw,40px)] py-4 ${
        onOrange ? "text-paper" : "text-ink"
      }`}
    >
      <span className="text-[17px] font-black tracking-[-0.01em]">erin-nodland.workflow</span>
      <span className="text-sm font-extrabold" aria-live="polite">{statusLine(progress)}</span>
    </div>
  );
}
