# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
