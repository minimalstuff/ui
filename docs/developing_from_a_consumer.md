# Develop the library from a consumer project

When a project that depends on `@minimalstuff/ui` needs a change in the library, work on the library in its own git worktree and link the consumer to it. Never link to the main checkout of this repository.

## Set up

1. From this repository, create a worktree on its own branch (one worktree per consumer need):

   ```bash
   git worktree add .worktrees/<name> -b <branch>
   ```

2. In the worktree, install and start the watch build:

   ```bash
   cd .worktrees/<name>
   pnpm install
   pnpm dev:lib
   ```

3. In the consumer, point the dependency at the worktree and install:

   ```json
   "@minimalstuff/ui": "link:../ui-minimalstuff/.worktrees/<name>"
   ```

   ```bash
   pnpm install
   ```

4. In the consumer's Vite config, dedupe React. Without it the worktree's own copy of React is loaded next to the consumer's and hooks crash:

   ```ts
   resolve: { dedupe: ['react', 'react-dom'] }
   ```

## What the watch build refreshes

`pnpm dev:lib` type-checks once (`tsc -b`), then runs `vite build --watch` with `VITE_BUILD_LIB=1`. On every source change it rewrites the three files the consumer reads: `dist/minimalstuff-ui.js`, `dist/minimalstuff-ui.css` and `dist/index.d.ts`. The types are regenerated with API Extractor, so a rebuild takes about 10 seconds.

It does not refresh:

- `package.json` changes (dependencies, `exports`): restart the watch and run `pnpm install` in the worktree.
- The bundled-types check of `pnpm build` (`scripts/verify_bundled_types.ts`): run `pnpm build` before merging.
- The consumer's own dev server cache: restart it if it keeps serving the old build.

## Docker builds

A `link:` path does not exist in a Docker build context, so the consumer cannot build an image while linked. Use a temporary `pnpm patch @minimalstuff/ui` in the consumer instead, and drop it once the library is released.

## Finish

1. Merge the worktree's branch into `main`.
2. Release the library through CI (see [releasing.md](releasing.md)).
3. In the consumer, depend on the published version, and remove the link or the patch.
4. Remove the worktree: `git worktree remove .worktrees/<name>`.

`tooling check-release` fails the consumer's release while a `link:` dependency or a `@minimalstuff` patch remains in `pnpm-lock.yaml`, so neither can reach a release. `github:` and other git dependencies on the library are blocked too: do not use them as a workaround.
