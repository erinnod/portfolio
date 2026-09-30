import Image from "next/image";
import { GROUP_INTRO, PROJECTS, STATUS_LABEL, STATUS_TONE, type Project, type StatusTone } from "../../data/projects";
import { SCENES, local } from "../../lib/timeline";

const TONE_TEXT: Record<StatusTone, string> = { ok: "text-ok-ink", signal: "text-signal-ink", muted: "text-muted" };
const TONE_DOT: Record<StatusTone, string> = { ok: "bg-ok", signal: "bg-signal", muted: "bg-muted" };

const TITLE = "mt-3 text-[clamp(34px,6.4vw,96px)] font-black leading-[0.92] tracking-[-0.04em] text-balance sm:mt-4";
const SUMMARY = "mt-4 max-w-[48ch] text-[clamp(15px,1.35vw,19px)] leading-relaxed text-ink-2 sm:mt-6";

function Status({ tone, label }: { tone: StatusTone; label: string }) {
  return (
    <p className={`inline-flex items-center gap-2.5 text-[15px] font-extrabold sm:text-base ${TONE_TEXT[tone]}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${TONE_DOT[tone]}`} />
      {label}
    </p>
  );
}

const rise = (a: number, px: number) => ({ opacity: a, transform: `translateY(${(1 - a) * px}px)` });

function Solo({ project, t, headingId }: { project: Project; t: number; headingId: string }) {
  const text = local(t, 0.28, 0.14);
  const img = local(t, 0.5, 0.18);
  return (
    <>
      <div style={rise(text, 24)}>
        <Status tone={STATUS_TONE[project.status]} label={STATUS_LABEL[project.status]} />
        <h2 id={headingId} className={TITLE}>
          {project.title}
        </h2>
        <p className={SUMMARY}>{project.summary}</p>
        {project.link && (
          <a
            href={project.link.href}
            className="mt-5 inline-flex min-h-12 items-center rounded-[10px] border-2 border-ink px-5 font-extrabold hover:bg-ink hover:text-paper sm:mt-6"
          >
            {project.link.label}
          </a>
        )}
      </div>
      <div className="flex flex-col gap-5 sm:gap-7">
        {/* One unbroken pipeline: a column on phones, a single row from sm up (steps wrap their own text, never the row). */}
        <ol className="flex flex-col items-start sm:flex-row sm:items-center" aria-label={`${project.title} pipeline`}>
          {project.steps.map((step, j) => {
            const a = local(t, 0.34 + j * 0.07, 0.08);
            const w = local(t, 0.38 + j * 0.07, 0.06);
            const last = j === project.steps.length - 1;
            return (
              <li
                key={step}
                className={`flex min-w-0 flex-col items-start sm:flex-row sm:items-center ${last ? "sm:flex-none" : "sm:flex-1"}`}
                style={rise(a, 14)}
              >
                <span
                  className={`rounded-[10px] border-2 border-ink px-2.5 py-1.5 text-[13px] leading-tight font-extrabold sm:px-3 sm:py-2.5 sm:text-[15px] ${
                    last ? "bg-ink text-paper" : "bg-paper"
                  }`}
                >
                  {step}
                </span>
                {!last && (
                  <span
                    aria-hidden="true"
                    className="ml-5 block h-2.5 w-0.75 origin-top bg-ink transform-[scaleY(var(--w))] sm:ml-0 sm:h-0.75 sm:w-auto sm:min-w-3 sm:flex-1 sm:origin-left sm:transform-[scaleX(var(--w))]"
                    style={{ "--w": w } as React.CSSProperties}
                  />
                )}
              </li>
            );
          })}
        </ol>
        {project.image && (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 900px) 45vw, 90vw"
            loading="lazy"
            className="max-h-[24svh] w-full rounded-xl border-2 border-ink object-cover object-top-left shadow-[0_30px_60px_-30px_rgba(30,31,36,0.5)] sm:max-h-[42svh]"
            style={{ opacity: img, transform: `translateY(${(1 - img) * 60}px) rotate(${(1 - img) * 2.5}deg)` }}
          />
        )}
      </div>
    </>
  );
}

function Group({ ids, t, headingId }: { ids: readonly number[]; t: number; headingId: string }) {
  const text = local(t, 0.28, 0.14);
  return (
    <>
      <div style={rise(text, 24)}>
        <Status tone="muted" label={GROUP_INTRO.status} />
        <h2 id={headingId} className={TITLE}>
          {GROUP_INTRO.title}
        </h2>
        <p className={SUMMARY}>{GROUP_INTRO.summary}</p>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5 sm:gap-3.5">
        {ids.map((i, j) => {
          const p = PROJECTS[i];
          const a = local(t, 0.36 + j * 0.08, 0.1);
          return (
            <li key={p.no} className="rounded-xl border-2 border-ink p-3 sm:p-4" style={rise(a, 24)}>
              <p className={`text-[13px] font-extrabold ${TONE_TEXT[STATUS_TONE[p.status]]}`}>{STATUS_LABEL[p.status]}</p>
              <h3 className="mt-1 text-lg font-black tracking-[-0.02em] sm:mt-1.5 sm:text-[22px]">{p.title}</h3>
              <p className="mt-1.5 text-[13px] leading-normal text-ink-2 sm:mt-2 sm:text-sm">{p.short}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/**
 * `inStage`: rendered inside the live sticky stage, so keep clear of its chrome — the status line across the
 * top and, on phones, the jump rail down the right edge. `idPrefix` keeps heading ids unique when the static
 * copy of the run is also in the DOM.
 */
export default function SceneContent({
  sceneIndex,
  t,
  inStage = false,
  idPrefix = "",
}: {
  sceneIndex: number;
  t: number;
  inStage?: boolean;
  idPrefix?: string;
}) {
  const ids = SCENES[sceneIndex];
  const headingId = `${idPrefix}scene-${sceneIndex}-title`;
  const pad = inStage
    ? "pl-5 pr-16 pt-14 pb-5 sm:px-[clamp(20px,6vw,96px)] sm:pt-[max(72px,7vh)] sm:pb-[clamp(28px,7vh,80px)]"
    : "px-[clamp(20px,6vw,96px)] py-[clamp(28px,7vh,80px)]";
  return (
    <div className={`grid h-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[clamp(16px,4vw,64px)] content-center-safe ${pad}`}>
      {ids.length === 1 ? (
        <Solo project={PROJECTS[ids[0]]} t={t} headingId={headingId} />
      ) : (
        <Group ids={ids} t={t} headingId={headingId} />
      )}
    </div>
  );
}
