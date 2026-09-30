import Image from "next/image";
import {
  GROUP_INTRO, PROJECTS, STATUS_LABEL, STATUS_TONE, type Project, type ProjectStatus, type StatusTone,
} from "../../data/projects";
import { SCENES, local } from "../../lib/timeline";

const TONE_TEXT: Record<StatusTone, string> = { ok: "text-ok-ink", wip: "text-wip-ink", muted: "text-muted" };

const TITLE = "text-[clamp(34px,6.4vw,96px)] font-black leading-[0.92] tracking-[-0.04em] text-balance";
const SUMMARY = "mt-4 max-w-[48ch] text-[clamp(15px,1.35vw,19px)] leading-relaxed text-ink-2 sm:mt-6";

/** The node's own state mark, the same vocabulary as the graph's node cards. */
function StatusMark({ status }: { status: ProjectStatus }) {
  if (status === "shipped" || status === "live") {
    return (
      <svg width="20" height="20" viewBox="0 0 26 26" aria-hidden="true" className="shrink-0">
        <circle cx="13" cy="13" r="13" fill="var(--ok)" />
        <path d="M7.5 13.5l3.5 3.5 7.5-8" fill="none" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "running") return <span aria-hidden="true" className="port-ring-ok h-3 w-3 shrink-0 rounded-full bg-ok" />;
  if (status === "in-progress") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
        <circle cx="10" cy="10" r="8.5" fill="none" stroke="var(--wip)" strokeWidth="2.5" />
        <path d="M10 1.5a8.5 8.5 0 0 1 0 17z" fill="var(--wip)" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <circle cx="10" cy="10" r="8.5" fill="none" stroke="var(--muted)" strokeWidth="2" />
      <path d="M8 6.5v7M12 6.5v7" stroke="var(--muted)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Node meta line under the title: state mark, state, and what the node runs on. */
function NodeMeta({ project }: { project: Project }) {
  return (
    // Phones: state on one line, the stack on the next (no separator). From sm up: one line, even gaps around "·".
    <p className="mt-3 flex flex-col gap-1 text-[15px] font-bold sm:mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:text-base">
      <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
        <StatusMark status={project.status} />
        <span className={TONE_TEXT[STATUS_TONE[project.status]]}>{STATUS_LABEL[project.status]}</span>
      </span>
      <span aria-hidden="true" className="hidden text-muted sm:inline">·</span>
      <span className="text-muted">{project.via}</span>
    </p>
  );
}

const rise = (a: number, px: number) => ({ opacity: a, transform: `translateY(${(1 - a) * px}px)` });

/**
 * A pipeline with a screenshot stays a compact row (a column on phones). Without one, from sm up the pipeline
 * becomes the column's main visual: a chain of full node cards joined by drawn wires.
 */
function Pipeline({ project, t, chain }: { project: Project; t: number; chain: boolean }) {
  return (
    <ol
      className={`flex flex-col items-start ${chain ? "sm:items-stretch" : "sm:flex-row sm:items-center"}`}
      aria-label={`${project.title} pipeline`}
    >
      {project.steps.map((step, j) => {
        const a = local(t, 0.34 + j * 0.07, 0.08);
        const w = local(t, 0.38 + j * 0.07, 0.06);
        const last = j === project.steps.length - 1;
        const fill = last ? "bg-ink text-paper" : "bg-paper";
        return (
          <li
            key={step}
            className={`flex min-w-0 flex-col items-start ${chain ? "sm:items-stretch" : `sm:flex-row sm:items-center ${last ? "sm:flex-none" : "sm:flex-1"}`}`}
            style={rise(a, 14)}
          >
            <span
              className={`flex items-center gap-3 rounded-[10px] border-2 border-ink px-2.5 py-1 text-[13px] leading-tight font-extrabold ${fill} ${
                chain
                  ? "sm:min-h-16 sm:rounded-xl sm:px-4 sm:py-3 sm:text-[19px] sm:shadow-[0_10px_24px_-16px_rgba(30,31,36,0.45)]"
                  : "sm:px-3 sm:py-2.5 sm:text-[15px]"
              }`}
            >
              {chain && (
                <span
                  aria-hidden="true"
                  className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm sm:inline-flex ${last ? "bg-paper/15" : "bg-ground"}`}
                >
                  {j + 1}
                </span>
              )}
              {step}
            </span>
            {!last && (
              <span
                aria-hidden="true"
                className={`ml-5 block h-2 w-0.75 origin-top bg-ink transform-[scaleY(var(--w))] ${
                  chain
                    ? "sm:ml-8 sm:h-6"
                    : "sm:ml-0 sm:h-0.75 sm:w-auto sm:min-w-3 sm:flex-1 sm:origin-left sm:transform-[scaleX(var(--w))]"
                }`}
                style={{ "--w": w } as React.CSSProperties}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Solo({ project, t, headingId }: { project: Project; t: number; headingId: string }) {
  const text = local(t, 0.28, 0.14);
  const img = local(t, 0.5, 0.18);
  return (
    <>
      <div style={rise(text, 24)}>
        <h2 id={headingId} className={TITLE}>
          {project.title}
        </h2>
        <NodeMeta project={project} />
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
      <div className="canvas-well flex flex-col gap-5 sm:gap-7">
        <Pipeline project={project} t={t} chain={!project.image} />
        {project.image && (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 900px) 45vw, 90vw"
            loading="lazy"
            className="max-h-[22svh] w-full rounded-xl border-2 border-ink object-cover object-top-left shadow-[0_30px_60px_-30px_rgba(30,31,36,0.5)] sm:max-h-[42svh]"
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
        <h2 id={headingId} className={TITLE}>
          {GROUP_INTRO.title}
        </h2>
        <p className={SUMMARY}>{GROUP_INTRO.summary}</p>
      </div>
      <ul className="canvas-well grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5 sm:gap-3.5">
        {ids.map((i, j) => {
          const p = PROJECTS[i];
          const a = local(t, 0.36 + j * 0.08, 0.1);
          return (
            <li key={p.no} className="rounded-xl border-2 border-ink bg-paper p-3 sm:p-4" style={rise(a, 24)}>
              <h3 className="text-lg font-black tracking-[-0.02em] sm:text-[22px]">{p.title}</h3>
              <p className="mt-1 flex items-center gap-2 text-[13px] font-extrabold">
                <StatusMark status={p.status} />
                <span className={TONE_TEXT[STATUS_TONE[p.status]]}>{STATUS_LABEL[p.status]}</span>
              </p>
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
    <div className={`grid h-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] content-center-safe gap-[clamp(16px,4vw,64px)] ${pad}`}>
      {ids.length === 1 ? (
        <Solo project={PROJECTS[ids[0]]} t={t} headingId={headingId} />
      ) : (
        <Group ids={ids} t={t} headingId={headingId} />
      )}
    </div>
  );
}
