import { EMAIL, LINKEDIN, PROJECTS, STATUS_LABEL } from "../../data/projects";

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
            {/* Out of the Tab order: sighted keyboard users would focus something invisible. Screen readers still reach it. */}
            {p.link && <a href={p.link.href} tabIndex={-1}>{p.link.label}</a>}
          </li>
        ))}
      </ol>
      <h2>Contact</h2>
      <p>Open to AI roles, project work or a chat. Email {EMAIL}.</p>
      <a href={LINKEDIN} tabIndex={-1}>Message Erin on LinkedIn</a>
    </div>
  );
}
