# Changelog

## [2.0.0](https://github.com/minimalstuff/ui/compare/1.4.0...2.0.0) (2026-07-16)

### ⚠ BREAKING CHANGES

* **icon-button:** IconButton no longer accepts variant="default"/"danger"
(danger was a shape+color pair). Use variant="ghost" (default) with
color="danger" etc. instead.
* **button:** Button no longer accepts variant="primary"/"secondary"/
"danger". Use variant="solid" (default) with color="primary"/"neutral"/
"danger" instead.
* **modal:** useModalStore, ModalConfig and related exports from

### Features

* add configurable border-radius and unstyled variants across components ([1e93b51](https://github.com/minimalstuff/ui/commit/1e93b51f9a848fed43862f649e15911e6bb451df))
* **button:** split variant (shape) from color (intent) ([be3998f](https://github.com/minimalstuff/ui/commit/be3998fe91b4166de2c7755e6d3278b5a828ccfa))
* **icon-button:** split variant (shape) from color (intent), match Button ([24e11a7](https://github.com/minimalstuff/ui/commit/24e11a7f624fc87dd11233e957a9d2b9ced878d5))
* **modal:** switch Modal/ConfirmModal to react-call ([bbdb892](https://github.com/minimalstuff/ui/commit/bbdb892ecd98d1dec416a2840c93e514e3fad629)), closes [#stores](https://github.com/minimalstuff/ui/issues/stores)

### Bug Fixes

* **button:** announce loading state via aria-busy ([629298b](https://github.com/minimalstuff/ui/commit/629298b8acfca763bc474a9a7e3ee53dec17ec98))
* **button:** keep hover/active styles and press feedback out of disabled state ([46c06b6](https://github.com/minimalstuff/ui/commit/46c06b6d6264dcc90175b282bf8568faa5347390))
* **client-only:** use JSX fragment instead of createElement ([a9f257b](https://github.com/minimalstuff/ui/commit/a9f257b1391914f9b1a9841e5e34550415e47d74))
* **input,textarea:** wire error state to aria-invalid/aria-describedby ([19a5d54](https://github.com/minimalstuff/ui/commit/19a5d5442ee0096a16278bf6ee906c0e3e35fa7c))
* **modal:** add dialog semantics and focus management ([326001a](https://github.com/minimalstuff/ui/commit/326001a53626192eefb894886048cca0d01b4bd1))
* **preview:** serve built storybook static output on correct port ([554d286](https://github.com/minimalstuff/ui/commit/554d2866285c1a6f8dcd81b20289ba6f174db950))
* **tabs:** implement WAI-ARIA tabs keyboard pattern and id linkage ([ef94311](https://github.com/minimalstuff/ui/commit/ef9431148c84bc45de5345ffd28808d58f08bfa0))
* **uno:** scan plain .ts files so Button color-variant classes aren't dropped ([fd0bb82](https://github.com/minimalstuff/ui/commit/fd0bb8246e2833e6bbe7ffad46012db48debc34d))

## [1.4.0](https://github.com/minimalstuff/ui/compare/1.3.0...1.4.0) (2026-05-01)

### Features

* **radio_options:** add RadioOptions component ([4e8338e](https://github.com/minimalstuff/ui/commit/4e8338ee29231317e359b555355618ab171dd677))
* **theme_toggle:** add size prop and update icon button implementation ([84025c5](https://github.com/minimalstuff/ui/commit/84025c5942dfd55f45a967e35b3149b4c7f1a32a))

## [1.3.0](https://github.com/minimalstuff/ui/compare/1.2.3...1.3.0) (2026-04-20)

### Features

* **theme:** enhance theme management and state handling ([78ea30f](https://github.com/minimalstuff/ui/commit/78ea30f1d21bd9d1fd2b084b9202b6e58ec4d11e))

## [1.2.3](https://github.com/minimalstuff/ui/compare/1.2.2...1.2.3) (2026-04-10)

### Bug Fixes

* pnpm missing packages field ([e8bd7e6](https://github.com/minimalstuff/ui/commit/e8bd7e64f3ec0f92936932c251ea548f3955b40c))

## [1.2.2](https://github.com/minimalstuff/ui/compare/1.2.1...1.2.2) (2026-04-10)

## [1.2.1](https://github.com/minimalstuff/ui/compare/1.2.0...1.2.1) (2026-02-28)

### Bug Fixes

- **theme_toggle:** move theme initialization to useEffect for fixing "localStorage is not defined" ([a01017b](https://github.com/minimalstuff/ui/commit/a01017b07c1c66be810a48ce8066e9fb96fbf8a0))

## [1.2.0](https://github.com/minimalstuff/ui/compare/1.1.6...1.2.0) (2026-02-27)

### Features

- **theme_toggle:** add optional fullscreen transition ([a870309](https://github.com/minimalstuff/ui/commit/a870309660caaa26b4a33baa2a4e4f1609013c6c))

## [1.1.6](https://github.com/minimalstuff/ui/compare/1.1.5...1.1.6) (2026-02-08)

## [1.1.5](https://github.com/minimalstuff/ui/compare/1.1.4...1.1.5) (2026-02-08)

### Bug Fixes

- **modal:** adjust padding and height for improved responsiveness ([274af77](https://github.com/minimalstuff/ui/commit/274af77d98b4ea55fcea09086de0ec617e76083d))

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.4] - 2026-02-03

### Added

- **Modal, ConfirmModal** – `footer` prop for custom footer content.

### Fixed

- **Modal** – Fixed modal height calculation.

---

## [1.1.3] - 2026-02-02

### Added

- **Checkbox** – `description` prop for helper text below the label.
- **Switch** – `description` prop for helper text below the label.

### Changed

- **Input, Textarea, Select, Switch, Checkbox** – `label` and (where applicable) `description` now accept `string | ReactNode` for richer labels and descriptions.

---

## [1.1.2] - 2026-02-02

### Fixed

- **Exports** – All public APIs (components, hooks, stores, types, utils) are now re-exported from the main entry.

---

## [1.1.1] - 2026-02-02

### Reverted

- **UnoCSS on demand** (from 1.1.0): the library again ships the full prebuilt UnoCSS CSS. Import `@minimalstuff/ui/style.css` for component styles and icons (required).
- **Removed** `@minimalstuff/ui/uno-config` export.
- **Removed** `unocss` peer dependency.

---

## [1.1.0] - 2026-02-02

### Added

- **`@minimalstuff/ui/uno-config`** – Export of the lib's UnoCSS config (presetWind4, presetIcons, presetWebFonts, `dark: 'class'`). Use it as the base of your `uno.config.ts` so presets and tokens match the lib.
- **Checkbox** – Checkbox input with label and optional error message.
- **Switch** – Toggle switch with label and optional error message.
- **Select** – Select dropdown (with `SelectOption` type).
- **ModalProvider** – Context provider for modal state and rendering.
- **ConfirmModal** – Confirmation dialog built on Modal.
- **modal_store** – Zustand store for opening/closing modals by id.
- **global_hotkeys_store** – Zustand store for registering global keyboard shortcuts.

### Changed

- **UnoCSS on demand**: the library no longer ships prebuilt UnoCSS CSS (~30–50 kB). Styles are generated by the consuming app's UnoCSS build. Add `unocss` as a peer dependency and include the lib in your Uno config's content (see README).
- **`@minimalstuff/ui/style.css`** is now optional: it only contains the Tabs panel animation (~0.2 kB). Import it only if you use the `Tabs` component and want the animation.
- **Button** – Added `loading` prop (shows loading state and disables the button).
- **IconButton** – Added `subtle` variant.
- **Input** – Displays required indicator (`*`) when `required` is true.
- **Textarea** – Displays required indicator (`*`) when `required` is true.
- Dependencies updated.

### Breaking

- **Peer dependency**: `unocss` (^66.0.0) is now required. Install it in your app and configure UnoCSS to scan `node_modules/@minimalstuff/ui/dist/**/*.js` (or use the lib's `uno-config`).
- If you previously relied on `import '@minimalstuff/ui/style.css'` for all component styles, you must now use UnoCSS in your app and include the lib in content; otherwise components will have no styles.

---

## [1.0.0] - 2026-01-31

### Added

First release of **@minimalstuff/ui**, a minimal React UI component library.

#### Components

- **Button** – Primary action button
- **CharacterCount** – Displays character count for text inputs
- **ClientOnly** – Renders children only on the client (SSR-safe)
- **IconButton** – Button with icon support
- **Input** – Text input with optional `BASE_INPUT_STYLES` for consistent styling
- **Modal** – Dialog/modal overlay
- **Tabs** – Tabbed navigation (with `TabItem` type)
- **Textarea** – Multi-line text input
- **ThemeToggle** – Light/dark theme switcher

#### Hooks

- **useClientOnly** – Conditionally run logic only on the client (with `withClientOnly` HOC)
- **useIsClient** – Returns whether the component is mounted on the client
- **useRunAfterAnimation** – Runs a callback after CSS animation completes

#### Utilities & types

- **Theme** – Theme type
- **applyTheme** – Apply light/dark theme to the document
