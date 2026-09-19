# Changelog

## [4.0.0](https://github.com/minimalstuff/ui/compare/3.2.0...4.0.0) (2026-09-19)

### ⚠ BREAKING CHANGES

* **checkbox,switch:** the wrapper no longer stretches by default. Both
  components shrink to their content unless `fullWidth` is set, so
  layouts that relied on the implicit full width must pass it explicitly.
* **combobox:** the dropdown no longer opens when the input receives focus.
  It opens on typing, on `ArrowDown`/`ArrowUp` and on click, as the ARIA
  authoring practices describe. Tabbing through a form no longer opens every
  combobox on the way. No API change.
* **focus:** keyboard focus indicators changed on purpose. The active menu
  item and the active listbox option now carry a 2px inner outline on top of
  their background, the tab panel and the combobox clear buttons gained an
  outline, and the focus ring of option cards, Checkbox and Switch now shows
  on keyboard focus only instead of on mouse click too. Several focus outline
  and text colors were darkened to meet WCAG contrast. Visual change only; no
  API change.

### Features

* **checkbox-options:** add a card-style multi-select group ([be14abe](https://github.com/minimalstuff/ui/commit/be14abef9102a195165e7db963ab36abcf1398de))
* **checkbox,switch:** make the wrapper width opt-in ([ba4ae6a](https://github.com/minimalstuff/ui/commit/ba4ae6a7de6fc05b911a216d9bcf3bcff1c90995))
* **checkbox:** add a card variant ([9befe98](https://github.com/minimalstuff/ui/commit/9befe9831cf72370b7e71e66433e58478b178c1b))
* **combobox:** accept aria-label to name the input without a visible label ([4de1cd3](https://github.com/minimalstuff/ui/commit/4de1cd35abd8bb49146976074dda5b974d9fe9df))
* **components:** export ChoiceOption shared by RadioOption and CheckboxOption ([6d58e7f](https://github.com/minimalstuff/ui/commit/6d58e7f859c4623d297d6edab2cd055e788a2db8))
* **context-menu:** add aria-label and document keyboard access ([496b90b](https://github.com/minimalstuff/ui/commit/496b90beb418243efcf7cb55a719f8521b3f14f7))
* **modal:** add aria-label for modals without a title ([733c8c8](https://github.com/minimalstuff/ui/commit/733c8c848f713c9fad11fd0d9c2f9b4f8a73d4e4))
* **multi-combobox:** accept aria-label to name the trigger without a visible label ([ec2d0d0](https://github.com/minimalstuff/ui/commit/ec2d0d045bb4d40f7da7e17d528211fa25cb13c1))
* **multi-combobox:** add searchable multi-select combobox ([abc30fb](https://github.com/minimalstuff/ui/commit/abc30fb84c25e99f88fe0a8f9af4822ee61ad7df))
* **multi-combobox:** default radius to sm ([25ccb37](https://github.com/minimalstuff/ui/commit/25ccb374f24d6996c2d258466af1abc9e879621b))
* **tabs:** redesign with line and segmented variants ([0f6d98c](https://github.com/minimalstuff/ui/commit/0f6d98c7cbe7d7d329ede7ad0c5a07d7a9354c99))

### Bug Fixes

* **a11y:** meet contrast for solid buttons in dark mode and warning, and dark kbd text ([30e723c](https://github.com/minimalstuff/ui/commit/30e723c5086606345d70912f396688f848951544))
* **a11y:** raise light-mode contrast of low-contrast color tokens ([ee16ce3](https://github.com/minimalstuff/ui/commit/ee16ce3c6bdb0f520c8072a82acaf1de47c6583f))
* **button:** raise focus outline contrast for neutral, success and warning ([b644254](https://github.com/minimalstuff/ui/commit/b6442540655bd92682345d3f23a909da3844001b))
* **checkbox-options:** announce required groups to screen readers ([ef47cdb](https://github.com/minimalstuff/ui/commit/ef47cdb4582d926d91b439a60468590f409cd1dc))
* **combobox:** stop opening on focus and fix keyboard and screen reader support ([8823a1a](https://github.com/minimalstuff/ui/commit/8823a1a3156e4550ae1e070e185ef52ecc2f8e1f))
* **confirm-modal:** announce as an alertdialog and focus Cancel first ([5d256c0](https://github.com/minimalstuff/ui/commit/5d256c00a7130fb33016f8232e936c783c4ee2b0))
* **field:** hide the required mark from the accessible name ([9af741d](https://github.com/minimalstuff/ui/commit/9af741d1ca9abc682a4a82c35aaf6c9ee41c559a))
* **fields:** merge the caller's aria-describedby with the error and description ids ([ed7c15e](https://github.com/minimalstuff/ui/commit/ed7c15ef4d668ed350742255cd97e55d86fe006e))
* **focus:** outline the active menu item, listbox option and clear buttons ([c637299](https://github.com/minimalstuff/ui/commit/c637299fe1e1033fb44b9dd3c255badfaa15b0ea))
* **focus:** show the control focus ring on keyboard focus only ([5dae512](https://github.com/minimalstuff/ui/commit/5dae5129d069ee0500428afcfdff2c5c0298230b))
* **input, textarea:** merge the caller's aria-describedby and link the character count ([c4bde91](https://github.com/minimalstuff/ui/commit/c4bde91823bde7b01dbc969253b89e8e7f88353f))
* **menu-item:** meet text contrast for danger items ([a3b0b03](https://github.com/minimalstuff/ui/commit/a3b0b032cdf2fd2fcb34bef0550e5d32cd557a22))
* **menu:** name the menu and add arrow-key opening, typeahead and nested Escape handling ([844486b](https://github.com/minimalstuff/ui/commit/844486b5c77eb904e39f43835420f4f3c300d038))
* **modal:** scope Escape and the focus trap to the topmost modal ([6841eaa](https://github.com/minimalstuff/ui/commit/6841eaaf2e8a4f678eea582cfd7e4e13be17899e))
* **multi-combobox:** fire onDropdownClose when clearing from the closed trigger ([8d3acc3](https://github.com/minimalstuff/ui/commit/8d3acc36715a424f8180d0c4506e8b57cd0a2430))
* **multi-combobox:** fix keyboard focus and screen reader support ([63a436c](https://github.com/minimalstuff/ui/commit/63a436ca9466d682add7d8e7ddeec4e3fced4315))
* **radio-options,checkbox-options:** drop invalid aria-required from fieldset ([b851832](https://github.com/minimalstuff/ui/commit/b851832375e77cf509e1beff7649c0ba0e6042c7))
* **storybook:** stop the theme decorator reloading the page during render ([327a85d](https://github.com/minimalstuff/ui/commit/327a85d74ed52e0e7d5e5bb709a15a1c69fbb59d))
* **tabs:** keep the tablist reachable when the active tab is disabled and drop dangling aria-controls ([5135b2b](https://github.com/minimalstuff/ui/commit/5135b2bbbcf1303d194da07589b62646e35aec3f))
* **tabs:** show a focus outline on the tab panel ([e33d05e](https://github.com/minimalstuff/ui/commit/e33d05ea857dd6e71e85aa7a7d5988046f4a4116))
* **tooltip:** dismiss on Escape, keep the trigger's description and announce temporary content ([90ec3a4](https://github.com/minimalstuff/ui/commit/90ec3a401acc073c29665547442ee97963037892))
* **types:** export TabsVariant and Theme through their alias path to avoid duplicate declarations ([5249401](https://github.com/minimalstuff/ui/commit/5249401a4f2c92b010de7540c8aec768b59fc694))

## [3.2.0](https://github.com/minimalstuff/ui/compare/3.1.0...3.2.0) (2026-08-14)

### Features

* **avatar:** add initial and picture avatar ([c2ce8d6](https://github.com/minimalstuff/ui/commit/c2ce8d63f0f3d071759419a53ed142d40a356f3a))
* **card:** add section container with optional header ([3daa050](https://github.com/minimalstuff/ui/commit/3daa0505cbc4bad758dc37d583833551cabf22ab))
* **card:** allow heading level and expose titled card as region ([e9fcc9e](https://github.com/minimalstuff/ui/commit/e9fcc9e0927e5e5a535dd6516ec3ac97efe9224f))
* **menu-group:** add labelled group of menu items ([77991be](https://github.com/minimalstuff/ui/commit/77991be8f86358074a1ab52b942aa91ea7982d58))
* **menu-group:** expose the group element through wrapperClassName ([ccee37e](https://github.com/minimalstuff/ui/commit/ccee37eb8e31d01427ca1ee51556ecf42d20a467))
* **menu-item:** add selected state for option rows ([f31d602](https://github.com/minimalstuff/ui/commit/f31d602e772cd9a8b410fc7aa60b7b5f189687b8))
* **menu-item:** add trailing slot for shortcuts and values ([77b1e9c](https://github.com/minimalstuff/ui/commit/77b1e9c3610f72efc4e79d20498a3eb9d7daa2de))
* **menu-separator:** add divider between menu item groups ([247c67d](https://github.com/minimalstuff/ui/commit/247c67d9fde76a41be57d768c32a1117e743ba22))

### Bug Fixes

* **avatar:** derive the initial by grapheme instead of code unit ([01bb405](https://github.com/minimalstuff/ui/commit/01bb405a7ccdd0e6f172a5fb3b798a0869630f45))
* **avatar:** hide avatar from assistive tech when unnamed ([ab67576](https://github.com/minimalstuff/ui/commit/ab6757672148bc489cbe88dc022fc4bd5ce4de3d))
* **menu-item:** group trailing content and check mark behind one auto margin ([e83a237](https://github.com/minimalstuff/ui/commit/e83a23709403e3fdc9ecf163f0eb9c75f7bf6ac5))

## [3.1.0](https://github.com/minimalstuff/ui/compare/3.0.1...3.1.0) (2026-08-14)

### Features

* **menu-item:** render as native link when href is passed ([6eb82ee](https://github.com/minimalstuff/ui/commit/6eb82eecccb50426d8d7c62ae8ab70fef8eb8975))

## [3.0.1](https://github.com/minimalstuff/ui/compare/3.0.0...3.0.1) (2026-08-14)

### ⚠ BREAKING CHANGES

* **modal:** `Modal`'s `footer` prop and the `ModalBody` component are
  removed. Declare pinned footer content with `<ModalFooter>` anywhere in
  `children` instead.

### Bug Fixes

* **modal:** register ModalFooter through context instead of structural detection ([7857297](https://github.com/minimalstuff/ui/commit/78572977d2b7098b29e6786b7aadd119b249e845))

## [3.0.0](https://github.com/minimalstuff/ui/compare/2.1.1...3.0.0) (2026-08-14)

### ⚠ BREAKING CHANGES

* **radio-options:** forward className to each option row instead of the legend
* **button:** model unstyled as a discriminated union instead of a variant string
* **confirm-modal:** use semantic ButtonColor names instead of red/blue/green

### Features

* add unstyled escape hatch to Switch, Kbd, Tabs, CharacterCount, ThemeToggle ([27f31b3](https://github.com/minimalstuff/ui/commit/27f31b35fbaee9ab6600faa86d7ae9bf38ba03a9))
* **badge:** add Badge component ([0d42762](https://github.com/minimalstuff/ui/commit/0d42762f68bb879ec9d23515f68ebea690b1d30f))
* **button:** model unstyled as a discriminated union instead of a variant string ([17152f1](https://github.com/minimalstuff/ui/commit/17152f1e2f12967df5e3222d8a07a0696078a99e))
* **confirm-modal:** report onConfirm rejections through onError ([2e6082e](https://github.com/minimalstuff/ui/commit/2e6082eb52a475dcdbc8e07802cd3cd8c69b36d9))
* **confirm-modal:** use semantic ButtonColor names instead of red/blue/green ([aa6cb49](https://github.com/minimalstuff/ui/commit/aa6cb49bd814e0c8c5081fb4ae00077685938fd8))
* **copy-button:** add CopyButton component ([0226670](https://github.com/minimalstuff/ui/commit/0226670440668b8d77b881a54161988ae08a690d))
* **copy-button:** report clipboard failures through onError ([898cba9](https://github.com/minimalstuff/ui/commit/898cba9970bd1589eadbf4395adff19e985cac14))
* export every component's props type ([a5b214a](https://github.com/minimalstuff/ui/commit/a5b214a563230943a8354d28e9761e7bf7d87cfc))
* forward className and ref on Badge, MenuItem, ContextMenu, Menu, and Tooltip ([09f7f44](https://github.com/minimalstuff/ui/commit/09f7f44c752bafa05fad2de86d640cf6f7e9a19a))
* **highlight:** add Highlight component ([e94be2f](https://github.com/minimalstuff/ui/commit/e94be2f7d712b2b8a66f9ed481cd78e0de042239))
* **kbd:** accept a radius prop ([e6c12ad](https://github.com/minimalstuff/ui/commit/e6c12ad434be3174fd61d425fd0d4586777610a0))
* **kbd:** add Kbd component ([af74d4d](https://github.com/minimalstuff/ui/commit/af74d4d743c4401a548a088424076f53a0f64f6c))
* make hardcoded UI strings overridable and drop the French default ([7184cd0](https://github.com/minimalstuff/ui/commit/7184cd0fa1279d8ecfad758bdbfd97e41936f690))
* **menu:** add Menu, ContextMenu, and MenuItem components ([2020375](https://github.com/minimalstuff/ui/commit/20203756ce9009b04d706eb9c463d2f2afce2a39))
* **modal:** add ModalBody/ModalFooter for pinned-footer layouts ([6158f04](https://github.com/minimalstuff/ui/commit/6158f04699eae114ed6b780156e15bc333c7ef01))
* **tabs:** support controlled mode via the value prop ([63e2fe9](https://github.com/minimalstuff/ui/commit/63e2fe9246b605e5b4b0b0ee336262702e6bfd08))
* **tooltip:** add Tooltip component with floating-ui collision handling ([03be1a5](https://github.com/minimalstuff/ui/commit/03be1a5922e5fd787bc2d2efff9f894b608971f3))

### Bug Fixes

* **button:** drop every style class for the unstyled variant ([8a6e443](https://github.com/minimalstuff/ui/commit/8a6e443cb9af778579f638454bcb0720d1efb216))
* **checkbox:** apply the radius to the focus ring wrapper ([120814c](https://github.com/minimalstuff/ui/commit/120814c770b662a2ed54205280eed23c59a09b27))
* **checkbox:** render no required mark when there is no label ([b153497](https://github.com/minimalstuff/ui/commit/b153497a7b900e8b392de08306616dea1319783b))
* **context-menu:** anchor keyboard-invoked menus to the focused element ([cc81ccb](https://github.com/minimalstuff/ui/commit/cc81ccb4c7ba7f0ef07ebb76368f6b89ddae3ec1))
* **fields:** render the required mark for node labels ([6694097](https://github.com/minimalstuff/ui/commit/66940979303dd48023b7347f3eddead85c6179cf))
* **fields:** use the caller-supplied id verbatim ([c760b4a](https://github.com/minimalstuff/ui/commit/c760b4a0754bc2dd63a0a29586944e98d168eb5a))
* **icon-button:** match Button height at every size ([1726951](https://github.com/minimalstuff/ui/commit/17269517638d37b33e4762939698d67fe7971740))
* **radio-options:** forward className to each option row instead of the legend ([1acc49b](https://github.com/minimalstuff/ui/commit/1acc49b16c90661b5d5da231d62f4d0d3325dfde))
* **radio-options:** keep option-level disabled when the group is enabled ([230238b](https://github.com/minimalstuff/ui/commit/230238bd555bc0d4c96124b0de8d8a4fe6064d08))
* replace array-index keys with stable keys in Highlight and Tabs ([209ecb8](https://github.com/minimalstuff/ui/commit/209ecb8fcac25eebf224bf46702d657f7c172bea))
* **stories:** pin trigger displayName to survive prod minification ([086a0d5](https://github.com/minimalstuff/ui/commit/086a0d5b66fc56887368ca127f68038a80360914))
* **switch:** match the focus ring offsets of the other controls ([983f152](https://github.com/minimalstuff/ui/commit/983f152312a939858ff5f96c61bfa87fec7f55a8))
* **switch:** remove the inert disabled class from the track ([7c52205](https://github.com/minimalstuff/ui/commit/7c52205c45cbeffc5cf9a611111c788cce9f47da))
* **theme-store:** apply the stored theme at module load instead of on ThemeToggle mount ([67644ba](https://github.com/minimalstuff/ui/commit/67644ba9b94f6ef1b64464e7ff762e29b3644e04))
* **tooltip:** derive the arrow size from a single constant ([070e30a](https://github.com/minimalstuff/ui/commit/070e30a5c35364d2acc81d135921a5642b955180))
* **typecheck:** run tsc in build mode so the script actually checks the project ([a06d481](https://github.com/minimalstuff/ui/commit/a06d481fe727a1ea13f76e064bafba627a7d062c))

## [2.1.1](https://github.com/minimalstuff/ui/compare/2.1.0...2.1.1) (2026-08-01)

### Bug Fixes

* **modal:** focus first focusable field on open instead of dialog ([ed1a2ca](https://github.com/minimalstuff/ui/commit/ed1a2ca2088fa6b70fb1c2cf7f18941004e6d0a2))
* **storybook:** unmount global modal root on story opt-out ([a03ed6a](https://github.com/minimalstuff/ui/commit/a03ed6a2f225fa9a4fd5a8606c981827639dd8ce))

## [2.1.0](https://github.com/minimalstuff/ui/compare/2.0.0...2.1.0) (2026-07-21)

### Features

* **combobox:** add searchable select with filtering ([29a3301](https://github.com/minimalstuff/ui/commit/29a3301799e879c8eb2d639dec09901e514416b6))
* **modal:** add dismissible prop to block Escape/backdrop/close-button ([435c6eb](https://github.com/minimalstuff/ui/commit/435c6eb63d2cc90ae8e3ae3c05e232b0c95630e6))

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
