# Trika English

A Vietnamese-language website that teaches English grammar to Vietnamese beginners, one stage at
a time. Built for a university course, due 5 October 2026.

## Read first

- `SPEC.md` is the source of truth for what the product does. Read it before any change, and
  re-read it whenever it changes.
- `material-format.md` defines the content format: the block types and the item schema.
- `content/materials/*.json` is the content, sixteen files, one per material.
- `content/nodes.json` is the grammar node tree. Only `stage` and `in_v1` matter to the site.
- `build_nodes.py` (repo root) generates `content/nodes.json`. `check.py` (repo root) validates
  the content against it. Both now live in the repo; run them after any change to a material's
  `stage` field or to `build_nodes.py`'s `STAGES` list, and never hand-edit `nodes.json` directly.

## Hard rules

- React with Vite, **plain JavaScript, no TypeScript**. No router: one page, a `screen` value in
  state, screens chosen with a switch.
- No backend, no database, no login, no runtime API call except the one logging POST in SPEC 13.
- Load content with `import.meta.glob('/content/materials/*.json', { eager: true })` and sort by
  `material_id`. Never copy content into components.
- **Never edit anything in `content/` on your own initiative.** It is authored elsewhere
  (`content/materials/*.json`) or generated (`content/nodes.json`, via `build_nodes.py`). If the
  content looks wrong, stop and say so. The one exception is a `content/` file the teacher hands
  you directly, already written, to upload or overwrite verbatim, or `content/nodes.json` after
  the teacher changes `build_nodes.py`'s `STAGES` and asks you to regenerate it.
- Never render a key that starts with `_`.
- Every word the learner sees is Vietnamese: labels, buttons, errors, empty states.
- No em dashes and no en dashes anywhere in user-facing text.
- Mobile first. It must work on a 5 inch phone over mobile data. Wide tables scroll sideways
  inside their own box; the page never scrolls sideways.
- Wrap every `localStorage` read and write in try/catch, and render correctly when it is empty.
  Keys are prefixed `trika:` (renamed from `commbat:` on 24 September, before any real learner
  had used the site, so no migration exists or is needed). This prefix is fixed since 25
  September: changing it now would wipe every learner's saved progress.
- Print the build timestamp in small text at the bottom of every screen.
- Locked stages stay visible and clickable, and say which stage comes first. Never hide them.
- Never add scoring, levels, CEFR bands, or anything SPEC section 14 forbids.

## Working style

- Small steps. Build one thing, run it, show it, then stop.
- Commit after each working step with a short message. Pushing to `main` deploys to Vercel.
- If a request conflicts with `SPEC.md`, point out the conflict instead of guessing.
