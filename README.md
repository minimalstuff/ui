# @minimalstuff/ui

A small, unambitious React component library, styled with UnoCSS and focused on accessibility.

Browse every component in the [Storybook](https://minimalstuff.github.io/ui/) (latest release), or the [`next` Storybook](https://minimalstuff.github.io/ui/next/) built from `main`.

## Install

```bash
pnpm add @minimalstuff/ui react react-dom
```

Requires React 19.

## Use the components

```tsx
import { Button } from '@minimalstuff/ui';
import '@minimalstuff/ui/style.css';

export function App() {
	return <Button color="primary">Click me</Button>;
}
```

The `@minimalstuff/ui/style.css` import is required for styles and icons to render. It can load before your app's own utilities (UnoCSS or Tailwind): component sizing does not depend on load order.

### Mount the providers

`Modal` and `ConfirmModal` are opened with `Modal.call(...)` and `ConfirmModal.call(...)`, and render where `<ModalProvider />` is mounted. `UIProvider` overrides the default English labels (close, confirm, no results…) for every component below it; mount `ModalProvider` inside it so modals receive the labels too.

```tsx
import { ModalProvider, UIProvider } from '@minimalstuff/ui';

export function Root() {
	return (
		<UIProvider labels={{ close: 'Fermer' }}>
			<App />
			<ModalProvider />
		</UIProvider>
	);
}
```

For French, pass the bundled preset: `<UIProvider labels={FRENCH_UI_LABELS}>` (import `FRENCH_UI_LABELS` from `@minimalstuff/ui`).

### Dark mode

Dark styles apply when `<html>` has the `dark` class. `useThemeStore` (and the `ThemeToggle` built on it) sets that class from the `light`, `dark` or `system` preference and keeps it in `localStorage`.

To avoid a light flash before your bundle runs, inline `THEME_INIT_SCRIPT` in `<head>`, before the stylesheet. It reads the same `localStorage` key as the store and sets the `dark` class the same way.

```tsx
import { THEME_INIT_SCRIPT } from '@minimalstuff/ui';

<head>
	<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
	<link rel="stylesheet" href="/style.css" />
</head>;
```

With a strict Content-Security-Policy, either add the script's SHA-256 hash to `script-src` (`'sha256-<hash>'`), or write `THEME_INIT_SCRIPT` to a file at build time and load it with `<script src>`. Compute the hash with:

```bash
node --input-type=module -e "import { THEME_INIT_SCRIPT } from '@minimalstuff/ui'; import { createHash } from 'node:crypto'; console.log(createHash('sha256').update(THEME_INIT_SCRIPT).digest('base64'))"
```

The hash changes if a release changes the script: recompute it when you upgrade.

### Modals and drawers lock page scroll

While a `Modal` or `Drawer` is open, page scroll is locked on `<html>`. The scrollbar width this frees is compensated with right padding on `<html>`, so the page does not shift. That padding does not move `position: fixed` elements: anchor right-aligned ones with `right: var(--scrollbar-compensation, 0px)`. Paint the page background on `<html>` or `<body>` rather than only on a wrapper element, or the padding shows the root's background as a strip on the right.

## Develop

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts Storybook on port 6006.

Before pushing, run what CI runs (see [`ci.yml`](.github/workflows/ci.yml)):

```bash
pnpm verify
```

`pnpm test:stories` runs the stories in a real browser and needs Playwright's Chromium once: `pnpm exec playwright install chromium`.

Releases follow [docs/releasing.md](docs/releasing.md). Changes are listed in the [CHANGELOG](CHANGELOG.md).

## Report a bug

Open an issue on [GitHub Issues](https://github.com/minimalstuff/ui/issues).

## License

[MIT](LICENSE)
