# ASTERA Website - Claude Code Project Instructions

## Project
ASTERA is a local mobile & tech accessories brand.
Tagline: **Exploring New Brands. Delivering Quality.**

ASTERA discovers and promotes emerging, new, and local accessory brands while maintaining a strong quality-first customer experience.

## Current objective
Build a production-quality ASTERA website that feels like a modern technology brand, not a generic mobile-accessories shop.

Primary goals:
1. Build a memorable brand experience.
2. Present products and emerging brands clearly.
3. Establish trust around quality.
4. Make the site fast, responsive, accessible, and easy to maintain.
5. Keep the architecture simple enough for the owner to learn and manage.

## Brand direction
- Theme: exploration, discovery, stars, space, new possibilities.
- Personality: modern, trustworthy, curious, premium but approachable.
- Avoid: generic e-commerce visuals, excessive gradients, clutter, fake luxury, over-animation.
- Tagline: "Exploring New Brands. Delivering Quality."
- Supporting idea: "Small Brands. Big Possibilities."

## Visual system
Use the ASTERA cosmic direction:
- Space Black: #111111
- Midnight: #0B132B
- Cosmic Blue: #2563EB
- Starlight: #E5E7EB
- Primary text: white / near-white
- Use blue as an accent, not as a full-page wash.
- Prefer clean geometric sans-serif typography.
- Use generous whitespace and strong hierarchy.
- Star/orbit motifs should be subtle and purposeful.

## Product positioning
ASTERA is a curator, not merely a reseller.
The website should communicate:
- Discover new brands.
- Curate useful products.
- Check for quality.
- Make good technology accessible.
- Support emerging/local brands.

Never claim that a product is "best", "number one", "certified", or "premium" unless the claim is supported by real data.

## Technical rules
- First inspect the repository before changing architecture.
- Prefer the existing stack if one already exists.
- If starting from scratch, ask before introducing unnecessary infrastructure.
- Keep components modular.
- Keep business data separate from presentation.
- Use semantic HTML and accessible controls.
- Mobile-first responsive design.
- Optimize images and avoid unnecessary client-side JavaScript.
- Do not add dependencies unless they solve a real problem.
- Do not overwrite working code without understanding it.
- Never expose secrets, API keys, credentials, or private tokens.
- Do not hard-code sensitive configuration.

## AI workflow
Work in small, verifiable phases:
1. Understand.
2. Plan.
3. Implement.
4. Run checks.
5. Visually verify.
6. Explain what changed.
7. Record important decisions in docs/DECISIONS.md.

Do not rebuild unrelated parts of the project when fixing one issue.

## MCP workflow
Use MCP only when it provides information/action that local tools cannot provide efficiently.

Preferred use:
- Stitch: UI/design system/design references.
- Browser/testing MCP: visual and functional verification.
- GitHub MCP: repository/issues/PR workflows when connected.
- Documentation MCP such as Context7: current library/API documentation when needed.

Do not call every MCP server for every task. Keep active MCP context small.

Before using an unfamiliar MCP server, explain:
- what it provides,
- why it helps ASTERA,
- what data/access it requires.

## Subagents
Use subagents for independent, isolated work such as:
- UI audit
- accessibility audit
- responsive audit
- research
- code review

Do NOT use subagents for tiny edits, one-file changes, or tasks where the main agent needs continuous context.

The main agent owns final architecture and integration decisions.

## Learning mode
For important implementation work, explain the concept briefly before or after applying it:
- what was used,
- why it was chosen,
- what problem it solves,
- one thing the developer should remember.

Do not turn every response into a tutorial. Teach the concept when it is actually useful.

## Quality gate
Before declaring a phase complete:
- Build/typecheck passes.
- Lint/tests pass if configured.
- No console errors.
- Responsive behavior checked.
- Accessibility basics checked.
- Visual result compared against the ASTERA design direction.
- No unnecessary dependencies or duplicated code.

## Communication
Be concise and action-oriented.
When blocked, state the exact blocker and the smallest next step.
When making a significant architectural choice, explain the trade-off.
