# @minimalstuff/ui

React 19 component library published to npm, styled with UnoCSS (`presetWind4`, not Tailwind), documented in Storybook.

## Verify

- Full check, same as CI and the release hook: `pnpm verify`.
- `pnpm test` runs unit tests in happy-dom (`vitest.ci.config.ts`); one file or folder: `pnpm test src/components/<name>`.
- `pnpm test:stories` runs every story in Playwright Chromium; needs `pnpm exec playwright install chromium` once.
- Run `pnpm build` whenever props reference another component's types: only the build runs `scripts/verify_bundled_types.ts`.

## Conventions

- Load `typescript-conventions` and `react-conventions`.
- A new visual component takes a `radius?: Radius` prop (`#components/shared/radius`) and an `unstyled` prop that strips the library's styling, unless the shape is semantic (Switch track, radio dot): users need to restyle any component. Several existing components lack one or both; they are not a precedent.
- Every user-visible change adds one line under `## [Unreleased]` in the hand-written `CHANGELOG.md`, in the same change, in the consumer's terms (component, prop, what they observe); a breaking change says how to migrate. Refactors, tests, tooling, Storybook-only: nothing.
- Never change existing colours, borders or spacing to meet contrast ratios: raising contrast on one component breaks the library's overall visual consistency, so don't propose fixes or consumer opt-ins for it. ARIA, focus and behaviour fixes are fine.

## Gotchas

- No media-query variants (`md:`, `motion-reduce:`…) in component classes: put base + variant in an `ms-*` shortcut in `uno.config.ts`. `scripts/verify_media_variants.ts` (in `pnpm check`) enforces it and explains why.
- A type shared across components must live in a types-only module (precedent: `tooltip/tooltip_position.ts`, `icon_button/icon_button_tooltip.ts`), imported via `#components/...` and re-exported by its component. Otherwise API Extractor bundles it twice (`X_2`) and the build fails. Never type a prop as `OtherProps['key']`.
- The barrels (`src/index.ts`, `src/components/index.ts`) keep relative paths for value exports: switching those to `#...` crashes API Extractor. Type-only `export type ... from '#components/...'` works.
- `.storybook/main.ts` is loaded by plain Node, so its subpath imports keep the `.ts` extension (`#storybook/channel.ts`).
