# Change the library for a project that uses it

[README](../README.md)

When a project that depends on `@minimalstuff/ui` needs a new component, a fix or an API change, make the change here, release it, then install the new version in the project. One release per need, even a small one: versions cost nothing.

## Make the change

1. Create a worktree from `origin/main`, one per need. Other work may be in progress in the main checkout:

   ```bash
   git fetch origin
   git worktree add .worktrees/<name> -b <branch> origin/main
   ```

2. In the worktree, install and start Storybook:

   ```bash
   cd .worktrees/<name>
   pnpm install
   pnpm dev
   ```

3. Make the change with its tests and stories, and add a line under `## [Unreleased]` in `CHANGELOG.md` (with `**Breaking:**` when it is one).
4. If the work stops before it is finished, rebase the branch on `origin/main` when it resumes. `main` only holds finished work, because a release ships everything on it.

## Release it

1. Rebase on `origin/main`, run `pnpm verify`, then fast-forward `main`:

   ```bash
   git push origin <branch>:main
   ```

2. Release through CI (see [releasing.md](releasing.md)).
3. Remove the worktree and the branch: `git worktree remove .worktrees/<name>`, then delete the branch locally and on the remote.

## Install it in the project

1. Read the `CHANGELOG.md` sections between the installed version and the new one, and apply the `**Breaking:**` entries.
2. Install the new version: `pnpm add @minimalstuff/ui@^<version>`.
3. For a release from the same day, the project's `pnpm-workspace.yaml` needs `minimumReleaseAgeExclude: ['@minimalstuff/*']`.

## Why not a link or a patch

A `link:` dependency on a local checkout breaks on another machine, after a fresh clone and in a Docker build. A `pnpm patch` works everywhere, but patches pile up across projects and the change they carry gets forgotten. `tooling check-release` fails the project's release while a `link:`, `file:` or git dependency on the library, or a `@minimalstuff` patch, remains in `pnpm-lock.yaml`.
