# Changelog

All notable changes to @minimalstuff/ui are written here for the people who use it. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- `Menu` and `ContextMenu` items match the `Combobox` list: tighter padding, a blue background on the keyboard-active item (red for `danger` items), darker item text, and `MenuGroup` headings shown as written instead of in uppercase.

### Fixed

- Closing a `Menu`, `ContextMenu`, `Modal` or `Drawer` returns focus to the element that opened it without scrolling the page.
- Focusing an option of `RadioOptions` or `CheckboxOptions` no longer scrolls an outer scrolling container.

## [4.3.2] - 2026-10-24

### Fixed

- A `Menu` or `Tooltip` around an inline trigger no longer makes the line taller than the trigger itself.
- `Tooltip` no longer opens when its trigger is clicked or tapped: it shows on hover and on keyboard focus, and ignores touch.

## [4.3.1] - 2026-10-24

### Fixed

- `Modal` and `Drawer` keep their responsive widths when the app's own CSS utilities load after the library's stylesheet.

## [4.3.0] - 2026-10-23

### Added

- `useDismissGuard(guard, isEnabled)`, called from anywhere inside a `Modal` or `Drawer`, runs `guard` before Escape, a backdrop click or the close button closes the dialog; returning `false` keeps it open, for example to confirm before losing unsaved changes. Closing from code (`Modal.end`, `Drawer` through `isOpen`) skips the guard, and a `ConfirmModal` stacked on top keeps its own Cancel.

### Fixed

- Clicking the backdrop of a `Modal` or `Drawer` no longer moves focus to the page body, so a confirmation opened by the guard hands focus back inside the dialog.

## [4.2.2] - 2026-10-23

### Fixed

- Rendering a closed `Tooltip`, or an `IconButton` or `ThemeToggle` with a `tooltip`, on the server no longer throws because of a `document` access.

## [4.2.1] - 2026-10-23

### Fixed

- A `Button` with `loading` stays focusable: keyboard users no longer lose their place while it loads, and clicks are ignored until it finishes. It looks the same as before.
- `ConfirmModal` keeps focus on Confirm while `onConfirm` runs.

## [4.2.0] - 2026-10-23

### Added

- `Drawer`, a modal side panel controlled with `isOpen` and `onClose`, with `title`, `footer`, `side` (`right` or `left`), `size` (`sm`, `md`, `lg`), `dismissible`, `initialFocusRef` and `closeLabel`. The `DrawerSide` and `DrawerSize` types are exported.
- `Modal` accepts `height="fixed"` for a fixed height with its content scrolling inside (`ModalHeight` type).
- `Tabs` accept `orientation="vertical"` (`TabsOrientation` type).
- `Tabs` accept `keepMounted` to keep inactive panels in the DOM instead of unmounting them.
- A tab item accepts a `badge`, shown next to its title.
- While a `Modal` or `Drawer` locks the page scroll, the width freed by the hidden scrollbar is exposed as the `--scrollbar-compensation` CSS variable, so you can offset your own fixed, right-anchored elements.

### Changed

- Scroll containers (the `Drawer` body, auto-height `Modal` content, vertical `Tabs`, and the `Combobox` and `MultiCombobox` listboxes) use a thin scrollbar that follows the theme instead of the browser's default one.

### Fixed

- An open `Modal` or `Drawer` stops the page from scrolling behind it even when the app sets `overflow-y: scroll` on `html`.
- The page no longer shifts sideways when a `Modal` or `Drawer` opens or closes: the scroll lock pads the page by the width the scrollbar actually freed, and adds nothing on pages without a scrollbar or with a reserved gutter.
- The page scroll stays locked while a stacked dialog is open.
- `RadioOptions` with an `error` marks the group as invalid instead of each radio.

## [4.1.0] - 2026-10-19

### Added

- `Toolbar`, an accessible toolbar where arrow keys move focus between its controls.
- `UIProvider` sets default labels for everything below it with `labels` (`UILabels` type). Nested providers merge over their parent, and an explicit prop still wins. `ModalProvider` must sit inside `UIProvider` for modals to receive the labels.
- `UIProvider` accepts `announceFieldErrors={false}` for apps that announce errors themselves (an error summary, focus on the first invalid field): field errors are then no longer read as alerts, and stay linked to their field.
- `Checkbox` shows an `indeterminate` state.
- `IconButton` accepts a `tooltip`: `true` shows its `aria-label`, a position places that tooltip, and `{ position, content }` sets custom content (`IconButtonTooltip` type). A tooltip that repeats the `aria-label` does not describe the button, so screen readers do not read the name twice.
- `ThemeToggle` accepts a `tooltip`, like `IconButton`.
- `Input`, `Textarea` and `Select` accept a `description`, shown under the field and linked with `aria-describedby`.
- `Modal` accepts `initialFocusRef` to choose the element focused on open.
- `Modal` accepts `role="alertdialog"` for an alert that must be acknowledged; combine it with `dismissible={false}` (`ModalRole` type).
- `Tooltip` accepts `portalContainer` to choose where it renders, and `describeChild` to always (`true`) or never (`false`) describe its trigger.

### Changed

- `Tooltip` renders inside its trigger's closest landmark or dialog instead of `document.body`, so it stays inside a modal and passes axe's region rule.
- By default, `Tooltip` only describes its trigger when its text differs from the trigger's accessible name.

### Fixed

- `ThemeToggle` no longer crashes the WebKitGTK web process on Linux: its view transition is off there by default. Pass `isTransitionEnabled` to force it on or off.
- A `Modal` whose `ModalFooter` children change on every render, such as a render prop, no longer re-renders forever.

## [4.0.0] - 2026-09-19

### Breaking

- `Checkbox` and `Switch` no longer stretch to the full width of their container: they shrink to their content. Pass `fullWidth` where your layout relied on the full width.

  ```tsx
  // Before
  <Switch label="Notifications" />
  // After
  <Switch label="Notifications" fullWidth />
  ```

- `Combobox` no longer opens its list when the input receives focus, so tabbing through a form no longer opens every combobox on the way. It opens on typing, on ArrowDown or ArrowUp, and on click. There is no API change; update tests or flows that relied on focus to open it.
- `Tabs` default to an underlined look (`variant="line"`). Pass `variant="segmented"` to keep the previous pill-on-a-track look.

  ```tsx
  <Tabs items={items} variant="segmented" />
  ```

- Keyboard focus indicators changed: the active menu item and the active listbox option carry a 2px inner outline on top of their background, the tab panel and the `Combobox` clear buttons have an outline, and the focus ring of option cards, `Checkbox` and `Switch` shows on keyboard focus only, not on mouse click. Visual change only; update visual snapshots if you have them.

### Added

- `CheckboxOptions`, a card-style multi-select group, the counterpart of `RadioOptions` (`CheckboxOption` type).
- `Checkbox` accepts `variant="card"` to render a standalone checkbox as a selectable card, with its description inside the card.
- `MultiCombobox`, a searchable multi-select combobox. Cap the selection with `maxSelectedValues` and disable options with `isOptionDisabled` (`MultiComboboxOption` type).
- `Combobox` and `MultiCombobox` accept `aria-label` to name the field without a visible label.
- `ContextMenu` accepts `aria-label`.
- `Modal` accepts `aria-label` for modals without a title.
- `Tabs` animate the active marker between tabs, controlled with `animated` and turned off under `prefers-reduced-motion`.
- The `ChoiceOption` type, shared by `RadioOption` and `CheckboxOption`, and the `TabsVariant` type are exported.

### Changed

- Several colors are darker to meet WCAG contrast: low-contrast light-mode tokens, solid buttons in dark mode, the `warning` color, `Kbd` text in dark mode, danger `MenuItem` text, and the focus outline of neutral, success and warning buttons.

### Fixed

- `Combobox` supports the full keyboard pattern: ArrowDown and ArrowUp open the list on the first or last option, Alt+ArrowDown opens it without picking an option, Alt+ArrowUp closes it, Enter is not swallowed when nothing is active, and the clear button returns focus to the input. "No results" is announced from a status region, and `required` is exposed to assistive tech.
- `Menu` has an accessible name, opens with the arrow keys, supports typeahead, and Escape in a nested menu closes only that menu.
- With stacked modals, Escape and the focus trap apply to the topmost `Modal` only.
- `ConfirmModal` is announced as an alert dialog and focuses Cancel first.
- `Tooltip` closes on Escape, keeps the trigger's own `aria-describedby`, and announces temporary content.
- The `Tabs` list stays reachable with the keyboard when the active tab is disabled, and no longer points `aria-controls` at panels that are not rendered.
- The tab panel shows a focus outline.
- The required mark is no longer read as part of a field's label.
- Fields merge the `aria-describedby` you pass with their own error and description ids instead of replacing it, and `Input` and `Textarea` link their character count.
- `RadioOptions` no longer sets an invalid `aria-required` on its fieldset.
- The `Theme` and `TabsVariant` types are declared once in the bundled types, which avoids duplicate declaration errors.

## [3.2.0] - 2026-08-14

### Added

- `Avatar` shows a person's initial, or their picture with `src`, with `name`, `size`, `color`, `radius` and `unstyled`. The initial handles emoji and accented letters, and an avatar without a name is hidden from assistive tech.
- `Card`, a section container with an optional header (`title`, `description`, `actions`), `padding` and `headingLevel`. A card with a title is exposed as a region.
- `MenuGroup` groups menu items under a `label`; `wrapperClassName` styles the group element.
- `MenuItem` accepts `selected` to show a check mark on option rows, and `trailing` for content at the end of the row, such as a shortcut or a value.
- `MenuSeparator` draws a divider between groups of menu items.

## [3.1.0] - 2026-08-14

### Added

- `MenuItem` renders as a native link when you pass `href`.

## [3.0.1] - 2026-08-14

### Breaking

- `Modal`'s `footer` prop and the `ModalBody` component are removed, and `ModalFooter` no longer accepts `className`. Put a `<ModalFooter>` anywhere inside the modal's `children`, at any depth: it is pinned below the scrolling content, even when it is rendered by your own content component.

  ```tsx
  // Before
  Modal.call({
    title: 'Edit',
    footer: <Button onClick={save}>Save</Button>,
    children: <EditForm />,
  });

  // After: EditForm renders <ModalFooter><Button onClick={save}>Save</Button></ModalFooter>
  Modal.call({ title: 'Edit', children: <EditForm /> });
  ```

### Fixed

- A `ModalFooter` rendered inside a separate content component is pinned outside the scrolling body instead of scrolling with it.

## [3.0.0] - 2026-08-14

### Breaking

- `Button` and `IconButton` take an `unstyled` boolean instead of `variant="unstyled"`, and `ButtonVariant` no longer includes `'unstyled'`. An unstyled button cannot also receive `variant`, `color` or `radius`.

  ```tsx
  // Before
  <Button variant="unstyled">Open</Button>
  // After
  <Button unstyled>Open</Button>
  ```

- `ConfirmModal`'s `confirmColor` uses the `ButtonColor` names: `red` becomes `danger`, `blue` becomes `primary` (the default), `green` becomes `success`. `ConfirmModalColor` becomes `'primary' | 'danger' | 'success'`.

  ```tsx
  // Before
  ConfirmModal.call({ title: 'Delete?', confirmColor: 'red' });
  // After
  ConfirmModal.call({ title: 'Delete?', confirmColor: 'danger' });
  ```

- `RadioOptions` applies `className` to each option row instead of the legend.
- The `useClientOnly` hook is removed: use `useIsClient`, which returns the same value. The `useRunAfterAnimation` hook is removed with no replacement. `withClientOnly` is still exported.

  ```tsx
  // Before
  const isMounted = useClientOnly();
  // After
  const isMounted = useIsClient();
  ```

### Added

- `Badge` (`BadgeColor`, `BadgeSize`, `BadgeVariant` types).
- `CopyButton` copies a `value` and gives its render-prop children `copy` and `copied`; clipboard failures go to `onError`.
- `Highlight` highlights matching parts of a text; `splitIntoHighlightSegments` and the `HighlightSegment` type are exported for custom rendering.
- `Kbd` shows a keyboard key, with `size` and `radius`.
- `Menu`, `ContextMenu` and `MenuItem`. A context menu opened from the keyboard is anchored to the focused element.
- `Tooltip`, positioned with collision handling (`TooltipPosition` type).
- `ModalFooter` for content pinned below the scrolling body of a `Modal`. `ModalBody` was added with it and removed in 3.0.1.
- `Tabs` can be controlled with `value` and `onChange`.
- `ConfirmModal` reports a rejected `onConfirm` through `onError`.
- `Switch`, `Kbd`, `Tabs`, `CharacterCount` and `ThemeToggle` accept `unstyled`.
- The `warning` color for `Button` and `IconButton`.
- Hardcoded strings can be overridden: `closeLabel` on `Modal` and `ConfirmModal`, `clearLabel` on `Combobox`, and `getAriaLabel` on `ThemeToggle`.
- Every component's props type is exported (`ButtonProps`, `ModalProps`, `TabsProps`…).

### Changed

- `ThemeToggle`'s accessible name defaults to English ("Current theme: dark") instead of French ("Thème actuel: dark"). Pass `getAriaLabel` to localize it.

### Fixed

- The stored theme is applied as soon as the library loads, instead of when a `ThemeToggle` mounts, so pages without a toggle also get it.
- An unstyled `Button` no longer keeps any of the library's style classes.
- `Checkbox` applies its `radius` to the focus ring, and shows no required mark when it has no label.
- Fields show the required mark when their `label` is a React node.
- Fields use the `id` you pass as is.
- `IconButton` has the same height as `Button` at every size.
- A disabled option in `RadioOptions` stays disabled when the group is enabled.
- `Switch` has the same focus ring offset as the other controls.

## [2.1.1] - 2026-08-01

### Fixed

- `Modal` focuses its first focusable field on open instead of the dialog itself.

## [2.1.0] - 2026-07-21

### Added

- `Combobox`, a select with a search field that filters its options (`ComboboxOption` type).
- `Modal` accepts `dismissible={false}` to block closing with Escape, the backdrop or the close button.

## [2.0.0] - 2026-07-16

### Breaking

- `Button`'s `variant` describes the shape only (`solid`, `outline`, `ghost`, `subtle`), and the intent moves to a new `color` prop (`primary`, `neutral`, `danger`, `success`). `variant="primary"` becomes the default, `variant="secondary"` becomes `color="neutral"` and `variant="danger"` becomes `color="danger"`.

  ```tsx
  // Before
  <Button variant="secondary">Cancel</Button>
  <Button variant="danger">Delete</Button>
  // After
  <Button color="neutral">Cancel</Button>
  <Button color="danger">Delete</Button>
  ```

- `IconButton` uses the same `variant` and `color` props as `Button`. Its default is `variant="outline"` with `color="neutral"`, so an `IconButton` without `variant` gains a border: pass `variant="ghost"` to keep it borderless. `variant="default"` and `variant="danger"` are gone.

  ```tsx
  // Before
  <IconButton icon="i-tabler-trash" aria-label="Delete" variant="danger" />
  // After
  <IconButton icon="i-tabler-trash" aria-label="Delete" variant="ghost" color="danger" />
  ```

- Modals are opened with `Modal.call()` and `ConfirmModal.call()` instead of `useModalStore`. `useModalStore` and the `ModalConfig`, `BaseModalConfig`, `StandardModalConfig` and `ConfirmModalConfig` types are removed; `ModalSize` and `ConfirmModalColor` are exported from the components. Keep `<ModalProvider />` mounted once: it renders the modals. `ConfirmModal.call()` resolves to `true` when confirmed and `false` when cancelled, and rendering `<Modal isOpen onClose>` yourself is no longer supported.

  ```tsx
  // Before
  const { open, openConfirm } = useModalStore();
  open({ title: 'Details', children: <Details /> });
  openConfirm({ title: 'Delete?', confirmColor: 'red', onConfirm: remove });

  // After
  Modal.call({ title: 'Details', children: <Details /> });
  const isConfirmed = await ConfirmModal.call({ title: 'Delete?', confirmColor: 'red', onConfirm: remove });
  ```

- The theme helpers `applyTheme`, `getCurrentTheme`, `setCurrentTheme` and `followThemeState` are removed. Use `useThemeStore`, which holds `theme` and `setTheme`.

  ```tsx
  // Before
  setCurrentTheme('dark');
  const unsubscribe = followThemeState((theme) => render(theme));
  // After
  const { theme, setTheme } = useThemeStore();
  useThemeStore.getState().setTheme('dark');
  ```

### Added

- Every component accepts a `radius` (`none`, `sm`, `md`, `lg`, `xl`, `full`), and components with a clear styling layer accept an unstyled option to bring your own styles.
- `Button` and `IconButton` combine any shape with any color, such as an outlined danger button (`ButtonColor` and `ButtonVariant` types).
- `useDisableHotkeysWhileMounted` turns off global hotkeys while a component is mounted.
- The `ModalProps`, `ConfirmModalProps` and `ConfirmModalResponse` types are exported.

### Changed

- `Modal` has a new look: larger radius and shadow, a stronger backdrop blur, tighter header and footer spacing, and medium-weight titles.
- `ConfirmModal` shows an icon matching its `confirmColor`, and its Cancel button is outlined.
- `IconButton` has the same hover, press and disabled feedback as `Button`.

### Fixed

- `ConfirmModal` with `confirmColor="green"` renders a green Confirm button instead of a blue one.
- `Modal` is announced as a dialog labelled by its title, traps focus while open and gives focus back on close.
- `Tabs` follow the WAI-ARIA tabs pattern: arrow keys, Home and End move between tabs, only the active tab is in the Tab order, and tabs and panels are linked.
- `Input` and `Textarea` link their error to the field with `aria-invalid` and `aria-describedby`, like the other fields.
- A loading `Button` is announced as busy.
- A disabled `Button` no longer changes color or presses in on hover and click.

## [1.4.0] - 2026-05-01

### Added

- `RadioOptions`, a group of radio options.
- `ThemeToggle` accepts a `size` (`sm`, `md`, `lg`).

## [1.3.0] - 2026-04-20

### Added

- The theme helpers `getCurrentTheme`, `setCurrentTheme` and `followThemeState` read, change and follow the theme outside `ThemeToggle`.

### Changed

- `ThemeToggle` follows theme changes made elsewhere: from another toggle, another tab, or the system preference while on `system`.

## [1.2.3] - 2026-04-10

No user-visible changes.

## [1.2.2] - 2026-04-10

### Changed

- The props of `Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Checkbox` and `Switch` include `ref`, so TypeScript accepts a ref on them.

## [1.2.1] - 2026-02-28

### Fixed

- `ThemeToggle` no longer fails with "localStorage is not defined" during server rendering.

## [1.2.0] - 2026-02-27

### Added

- `ThemeToggle` can play a fullscreen transition when the theme changes, with `isTransitionEnabled`, `transitionDuration` and `transitionEasing`.

## [1.1.6] - 2026-02-08

No user-visible changes.

## [1.1.5] - 2026-02-08

### Fixed

- `Modal` padding and height adapt better to small screens.

## [1.1.4] - 2026-02-08

### Added

- `Modal` and `ConfirmModal` accept a `footer` for custom footer content.

### Fixed

- `Modal` computes its height correctly.

## [1.1.3] - 2026-02-02

### Added

- `Checkbox` and `Switch` accept a `description`, shown under the label.

### Changed

- The `label` of `Input`, `Textarea`, `Select`, `Switch` and `Checkbox`, and their `description` where they have one, accept a React node as well as a string.

## [1.1.2] - 2026-02-02

### Fixed

- Every public component, hook, store, type and utility is exported from the main entry.

## [1.1.1] - 2026-02-02

### Changed

- The library ships its full prebuilt UnoCSS stylesheet again, reverting the on-demand styles of 1.1.0. Import `@minimalstuff/ui/style.css` for component styles and icons; it is required.

### Removed

- The `@minimalstuff/ui/uno-config` export.
- The `unocss` peer dependency.

## [1.1.0] - 2026-02-02

### Breaking

- `unocss` (^66.0.0) is a required peer dependency. Install it and configure UnoCSS to scan `node_modules/@minimalstuff/ui/dist/**/*.js`, or build on the library's `uno-config`.
- `import '@minimalstuff/ui/style.css'` no longer brings the component styles: without UnoCSS in your app scanning the library, components have no styles.

### Added

- `@minimalstuff/ui/uno-config` exports the library's UnoCSS config (presetWind4, presetIcons, presetWebFonts, `dark: 'class'`), to use as the base of your `uno.config.ts` so presets and tokens match.
- `Checkbox`, with a label and an optional error message.
- `Switch`, a toggle with a label and an optional error message.
- `Select`, a select dropdown (`SelectOption` type).
- `ModalProvider`, which renders the modals.
- `ConfirmModal`, a confirmation dialog built on `Modal`.
- `useModalStore` opens and closes modals by id.
- `useGlobalHotkeysStore` registers global keyboard shortcuts.
- `Button` accepts `loading`, which shows a loading state and disables the button.
- `IconButton` accepts `variant="subtle"`.
- `Input` and `Textarea` show a required mark (`*`) when `required` is set.

### Changed

- The library no longer ships prebuilt UnoCSS styles (about 30 to 50 kB): your app's UnoCSS build generates them. Include the library in your UnoCSS content (see the README).
- `@minimalstuff/ui/style.css` is optional and only holds the `Tabs` panel animation (about 0.2 kB). Import it if you use `Tabs` and want the animation.

## [1.0.0] - 2026-01-31

### Added

- First release of @minimalstuff/ui, a minimal React component library.
- Components: `Button`, `CharacterCount` (character count for text fields), `ClientOnly` (renders its children on the client only, safe for server rendering), `IconButton`, `Input` (with `BASE_INPUT_STYLES` for consistent styling), `Modal`, `Tabs` (`TabItem` type), `Textarea` and `ThemeToggle` (light and dark theme switcher).
- Hooks: `useClientOnly` and the `withClientOnly` HOC run logic or render only on the client, `useIsClient` tells whether the component is mounted on the client, and `useRunAfterAnimation` runs a callback once a CSS animation ends.
- Utilities and types: `applyTheme` applies the light or dark theme to the document, and the `Theme` type.

[Unreleased]: https://github.com/minimalstuff/ui/compare/4.3.2...HEAD
[4.3.2]: https://github.com/minimalstuff/ui/compare/4.3.1...4.3.2
[4.3.1]: https://github.com/minimalstuff/ui/compare/4.3.0...4.3.1
[4.3.0]: https://github.com/minimalstuff/ui/compare/4.2.2...4.3.0
[4.2.2]: https://github.com/minimalstuff/ui/compare/4.2.1...4.2.2
[4.2.1]: https://github.com/minimalstuff/ui/compare/4.2.0...4.2.1
[4.2.0]: https://github.com/minimalstuff/ui/compare/4.1.0...4.2.0
[4.1.0]: https://github.com/minimalstuff/ui/compare/4.0.0...4.1.0
[4.0.0]: https://github.com/minimalstuff/ui/compare/3.2.0...4.0.0
[3.2.0]: https://github.com/minimalstuff/ui/compare/3.1.0...3.2.0
[3.1.0]: https://github.com/minimalstuff/ui/compare/3.0.1...3.1.0
[3.0.1]: https://github.com/minimalstuff/ui/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/minimalstuff/ui/compare/2.1.1...3.0.0
[2.1.1]: https://github.com/minimalstuff/ui/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/minimalstuff/ui/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/minimalstuff/ui/compare/1.4.0...2.0.0
[1.4.0]: https://github.com/minimalstuff/ui/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/minimalstuff/ui/compare/1.2.3...1.3.0
[1.2.3]: https://github.com/minimalstuff/ui/compare/1.2.2...1.2.3
[1.2.2]: https://github.com/minimalstuff/ui/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/minimalstuff/ui/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/minimalstuff/ui/compare/1.1.6...1.2.0
[1.1.6]: https://github.com/minimalstuff/ui/compare/1.1.5...1.1.6
[1.1.5]: https://github.com/minimalstuff/ui/compare/1.1.4...1.1.5
[1.1.4]: https://github.com/minimalstuff/ui/compare/1.1.3...1.1.4
[1.1.3]: https://github.com/minimalstuff/ui/compare/1.1.2...1.1.3
[1.1.2]: https://github.com/minimalstuff/ui/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/minimalstuff/ui/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/minimalstuff/ui/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/minimalstuff/ui/releases/tag/1.0.0
