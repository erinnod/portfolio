# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers, recruiters and technical leads filling AI Automation Specialist / AI engineer roles. They arrive from a CV, LinkedIn or a job application, skim fast (often under a minute), and are deciding whether Erin is worth an interview. Secondary: engineers on the hiring panel who click through to the GitHub repos to check the work is real.

## Product Purpose

Erin Nodland's personal portfolio. It exists to turn a skim into an interview for AI automation roles. Success = a hiring manager leaves convinced Erin ships real AI systems, and contacts her (LinkedIn or email).

## Positioning

Erin ships real AI systems, not demos: an n8n + LLM pipeline live in production for a Shoothill client, agents her team uses, and multi-agent / RAG systems built from scratch with public code. The claim is "in production and in use", which a tutorial-driven portfolio cannot truthfully copy.

## Operating Context

- Visitors come from a CV link, LinkedIn profile or job application, mostly on desktop, often on a phone first.
- Deployed on Vercel from `main` (erinnod/portfolio); live at portfolio-two-xi-95.vercel.app. Custom domain undecided.
- Erin is a Software Developer at Shoothill (UK), working on AI.

## Capabilities and Constraints

- Single-page site: hero, about, projects, contact. LinkedIn link and click-to-copy email (noderin1@gmail.com); CV download deliberately not offered.
- Next.js 16 (App Router), React 19, Tailwind v4; motion is hand-rolled from scroll progress (no animation library). Next 16 has breaking changes: consult `node_modules/next/dist/docs/` before editing.
- Project copy is sourced from Erin's career-evidence inventory (life-OS vault `Work/portfolio.md`); keep in sync.

## Evidence on Hand

Real projects and their verified status (as of 2026-10-01):

- **Figma → spec agent** — shipped. Figma link in, two HTML reports (client + developer) out in under two minutes. Screenshots: `public/project-figma-agent*.png`.
- **Shopify product automation** — shipped, live in production for a Shoothill client. ~20-node n8n workflow: Drive → crop/background → LLM-written titles & descriptions → Shopify (model provider deliberately unnamed on the site). Screenshot: `public/project-n8n-workflow.png`.
- **RAG support assistant** — shipped 2026-05-19. Cited Q&A, 20-question eval (retrieval hit-rate + answer quality). https://github.com/erinnod/rag-assistant
- **Multi-agent outreach pipeline** — shipped 2026-05-28. Researcher → Drafter → Critic, shared state, Python orchestrator with no LangChain, run on 10 real companies. https://github.com/erinnod/multi-agent-outreach
- **ASP.NET → Hono migration toolkit** — shipped (Erin's write-up, 2026-10-01). Strangler-fig migration of a legacy ASP.NET + SQL Server backend onto Hono on Cloudflare Workers, one endpoint at a time, with byte-for-byte response contracts. Built migrating a production line-of-business CRM: 200+ endpoints (the method itself isn't bounded by endpoint count), 130+ tables (537 stored procedures, 46 views), dual-valid JWTs, guarded and verified data CLIs (introspect → schema → dump → reset → verify), Vitest in real `workerd` against Neon branches, a .NET behaviour-compatibility layer, Azure Blob → R2, HangFire → Queues, a rehearsed cutover runbook. D1 first, moved to Postgres (Neon) on evidence. Packaged as a reusable agent skill (`migrating-aspnet-to-hono`). Client not named. Replaces the earlier crawl/plan "migration agent" description.
- **Life-OS** — running. Personal AI OS on Claude Code + Obsidian + MCP.
- **Morning brief agent** — built, paused. n8n + Telegram + Claude.

Absent, and not to be fabricated: testimonials, client names beyond "a Shoothill client", metrics beyond those above, demo videos, a live demo URL for any project.

## Product Principles

1. Proof over adjectives: every claim points at a shipped thing, a screenshot or a repo.
2. Status is honest and scannable: shipped vs in progress vs paused is unmistakable at a glance.
3. The skim path works: a 30-second visit still lands "ships real systems" and a way to reach her.
4. The work leads; the site recedes behind it.

## Accessibility & Inclusion

No product-specific requirement established beyond WCAG 2.1 AA; honour `prefers-reduced-motion` for all animation.
