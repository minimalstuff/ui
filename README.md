# @minimalstuff/ui

React UI component library.

## Installation

```bash
pnpm add @minimalstuff/ui react react-dom
```

Peer dependencies: React 18 or 19.

## Usage

```tsx
import { Button } from '@minimalstuff/ui';
import '@minimalstuff/ui/style.css';

export function App() {
	return <Button variant="primary">Click me</Button>;
}
```

## Development

```bash
pnpm install
pnpm run dev        # Storybook on :6006
pnpm run lint
pnpm run test
pnpm run build      # Library build → dist/
```

## Releasing

CI (lint, test, build) and npm publish run together when a GitHub Release is published.

### Prerequisites

1. **NPM token**
   Create an automation token at [npmjs.com/access-tokens](https://www.npmjs.com/access-tokens) (scope: package publish for `@minimalstuff/ui`).

2. **Repository secret**
   In the repo: **Settings → Secrets and variables → Actions**. Add a secret named `NPM_TOKEN` with the token value.

### Procedure

1. **Bump version** (optional if using tag-based versioning):

   ```bash
   pnpm version 1.2.0   # or 1.2.0-alpha.0 for prerelease
   git push && git push --tags
   ```

2. **Create a GitHub Release**
   **Releases → Draft a new release**:
   - Choose or create a tag (e.g. `v1.2.0`). Use the same version as in `package.json` if you bumped it; otherwise the workflow sets the package version from the tag (e.g. `v1.2.0` → `1.2.0`).
   - Add release notes and publish.

3. **Workflow**
   The **CI & Publish** workflow runs on **release published**. It sets the package version from the tag, runs lint, test, build, then `pnpm publish --no-git-checks`. The package is published under the tag `latest` (or the tag you set for prereleases).

### Prereleases

Semver prereleases (e.g. `1.0.0-0`, `1.0.0-alpha.1`) are supported. To avoid making them the default install:

- Publish with a dist-tag, e.g. `pnpm publish --tag next`, or
- Rely on consumers installing an explicit version: `pnpm add @minimalstuff/ui@1.0.0-alpha.1`.

If you want CI to publish prereleases automatically (e.g. on tag `v1.0.0-alpha.1`), add a separate workflow or extend the existing one to run on prerelease tags and use `--tag next`.
