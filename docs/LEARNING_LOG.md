# ASTERA Learning Log

Purpose: turn the project into a practical learning journey.

## Rule
For every major technical decision, record:
- What?
- Why?
- How?
- What did I learn?
- Where is it used?

## Topics to learn during ASTERA

### 1. Project architecture
Learn:
- React component architecture
- TypeScript types
- data-driven UI
- routing

### 2. Design systems
Learn:
- design tokens
- typography
- spacing systems
- responsive design
- component consistency

### 3. MCP
Learn:
- MCP server vs MCP client
- tools
- resources
- prompts
- authentication
- when MCP is actually useful

### 4. Agentic development
Learn:
- CLAUDE.md
- skills
- subagents
- agent teams
- hooks
- MCP
- context management

### 5. Frontend quality
Learn:
- accessibility
- performance
- SEO
- visual regression
- browser testing

### 6. Deployment
Learn:
- production build
- environment variables
- hosting
- domains
- monitoring

## MCP experiment log
| Date | MCP | Task | Result | Lesson |
|---|---|---|---|---|
| 2026-09-21 | Stitch | Read the approved homepage design (`list_projects` → `get_project` → `list_screens` → `get_screen`) before implementing | Got the exact design-system export (colors, type scale, spacing) as structured YAML/JSON, plus a screenshot for the visual layout. The `htmlCode.downloadUrl` on each screen requires a signed-in Google session — not fetchable by a plain HTTP tool, only by something authenticated to the same account | Read-only MCP tools are worth calling directly (no subagent needed) when the payload is small and the result feeds an immediate decision. For the actual pixel layout, downloading the `screenshot.downloadUrl` (a public `lh3.googleusercontent.com` link) and reading it as an image was the reliable path, not the HTML export |
| | Browser | | | |
| | GitHub | | | |
| | Docs | | | |

## Agent experiment log
| Date | Agent/Skill | Task | Result | Lesson |
|---|---|---|---|---|
| | UI reviewer | | | |
| | Accessibility reviewer | | | |
| | Code reviewer | | | |

## Decision log
Major decisions should also be copied to:
`docs/DECISIONS.md`
