import { PROJECTS, STATUS_LABEL } from "../../data/projects";

// Screen-reader copy of every project, so nothing depends on scroll position.
export default function SrSummary() {
  return (
    <div className="sr-only">
      <h2>Projects</h2>
      <ol>
        {PROJECTS.map((p) => (
          <li key={p.no}>
            <h3>{p.title}</h3>
            <p>{STATUS_LABEL[p.status]}. {p.summary}</p>
            {p.link && <a href={p.link.href}>{p.link.label}</a>}
          </li>
        ))}
      </ol>
    </div>
  );
}
