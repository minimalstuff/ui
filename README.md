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

### Toasts

Mount `<Toaster />` once at the app root, then call `toast()` from anywhere (event handlers, services, outside React).

```tsx
import { Toaster, toast } from '@minimalstuff/ui';

export function Root() {
	return (
		<>
			<App />
			<Toaster position="bottom-right" />
		</>
	);
}

toast.success('Saved');
toast.error('Could not save', { description: 'Check your connection.' });
```

Only the first mounted `Toaster` renders. Toasts sit above `Modal` and `Drawer`. Warning and error toasts, and toasts with an action, stay until dismissed, because a Modal's focus trap keeps toasts out of keyboard reach. Move the stack with the `--ms-toast-offset-bottom` and `--ms-toast-offset-top` CSS custom properties (default: 1rem plus the safe-area inset).

`ToastProvider` and `useToast()` still work but are deprecated: mount `<Toaster />` and call `toast()` instead.

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

#### Status bar and `theme-color`

To make the browser or installed PWA status bar follow the theme, add a `theme-color` meta with a `data-light` and a `data-dark` color. `THEME_INIT_SCRIPT` and `useThemeStore` copy the matching one into `content` every time the theme is applied (init, `setTheme`, OS change while on `system`, another tab). A meta without both attributes is left alone, and without such a meta nothing changes.

```html
<head>
	<meta
		name="theme-color"
		content="#ffffff"
		data-light="#ffffff"
		data-dark="#0b0b0b"
	/>
	<script>
		/* THEME_INIT_SCRIPT */
	</script>
</head>
```

- Put the meta before the script in `<head>`.
- Remove any other `theme-color` meta, notably ones with a `media` attribute: the first matching one wins.
- Keep the meta in the static HTML. A meta recreated by a `<head>` manager (Inertia `<Head>`, react-helmet) is not resynced.

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

To change the library from a project that uses it, see [docs/developing_from_a_consumer.md](docs/developing_from_a_consumer.md).

Releases follow [docs/releasing.md](docs/releasing.md). Changes are listed in the [CHANGELOG](CHANGELOG.md).

## Report a bug

Open an issue on [GitHub Issues](https://github.com/minimalstuff/ui/issues).

## License

[MIT](LICENSE)
