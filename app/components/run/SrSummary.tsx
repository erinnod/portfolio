import { EMAIL_DISPLAY, GITHUB, LINKEDIN, PROJECTS, STATUS_LABEL } from "../../data/projects";

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
            {p.notes && (
              <>
                <h4>{p.notes.title}</h4>
                <ul>{p.notes.items.map((n) => <li key={n}>{n}</li>)}</ul>
              </>
            )}
            {/* Out of the Tab order: sighted keyboard users would focus something invisible. Screen readers still reach it. */}
            {p.link && <a href={p.link.href} tabIndex={-1}>{p.link.label}</a>}
          </li>
        ))}
      </ol>
      <h2>Contact</h2>
      <p>Open to AI roles, project work or a chat. Email {EMAIL_DISPLAY}.</p>
      <a href={LINKEDIN} tabIndex={-1}>Message me on LinkedIn</a>
      <a href={GITHUB} tabIndex={-1}>My GitHub</a>
    </div>
  );
}
