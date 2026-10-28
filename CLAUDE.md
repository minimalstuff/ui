# @minimalstuff/ui

React 19 component library published to npm, styled with UnoCSS (`presetWind4`, not Tailwind), documented in Storybook.

## Verify

- Full check, same as CI: `pnpm check && pnpm test && pnpm test:stories && pnpm build`.
- `pnpm test` runs unit tests in happy-dom (`vitest.ci.config.ts`); one file or folder: `pnpm test src/components/<name>`.
- `pnpm test:stories` runs every story in Playwright Chromium; needs `pnpm exec playwright install chromium` once.
- Run `pnpm build` whenever props reference another component's types: only the build runs `scripts/verify_bundled_types.ts`.

## Conventions

- Load `typescript-conventions` and `react-conventions`.
- Every component takes a `radius?: Radius` prop (`#components/shared/radius`) and an `unstyled` prop that strips the library's styling, unless the shape is semantic (Switch track, radio dot). Users need to restyle any component.
- Every user-visible change adds one line under `## [Unreleased]` in `CHANGELOG.md`, in the same change, in the consumer's terms (component, prop, what they observe); a breaking change says how to migrate. Refactors, tests, tooling, Storybook-only: nothing. The file is hand-written and `pnpm release` fails on an empty `Unreleased`.
- Never change existing colours, borders or spacing to meet contrast ratios: the visual identity comes first. Raise the issue and suggest a consumer opt-in; ARIA, focus and behaviour fixes are fine.

## Gotchas

- No media-query variants (`md:`, `motion-reduce:`…) in component classes: a consumer's later-loaded `.w-full` beats them at equal specificity. Put base + variant in an `ms-*` shortcut in `uno.config.ts`; `scripts/verify_media_variants.ts` (in `pnpm check`) enforces it.
- A type shared across components must live in a types-only module (precedent: `tooltip/tooltip_position.ts`, `icon_button/icon_button_tooltip.ts`), imported via `#components/...` and re-exported by its component. Otherwise API Extractor bundles it twice (`X_2`) and the build fails. Never type a prop as `OtherProps['key']`.
- Switching the barrel `src/components/index.ts` to `#components/...` paths does not fix that: API Extractor crashes.
