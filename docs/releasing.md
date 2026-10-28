# Release a new version

A release is cut locally with release-it, then published to npm by GitHub Actions once the GitHub Release is published.

## Before the first release

Publishing uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), so no npm token is stored anywhere. On npmjs.com, `@minimalstuff/ui` > **Settings > Trusted publishing** must list GitHub Actions with organization `minimalstuff`, repository `ui` and workflow `publish.yml`.

## Cut the release

1. Start from an up-to-date `main` with a clean working tree.
2. Check that `## [Unreleased]` in [`CHANGELOG.md`](../CHANGELOG.md) lists every user-visible change since the last release. The changelog is written by hand; release-it refuses to release with an empty `Unreleased` section.
3. Run, with the increment that matches the changes (`patch`, `minor` or `major`):

   ```bash
   pnpm release <increment>
   ```

   release-it runs the checks, tests and build, turns `Unreleased` into the new version's section, commits `chore: release v<version>`, tags `<version>` and pushes. Hooks and options live in [`.release-it.json`](../.release-it.json).

   To preview without touching anything, run `pnpm release <increment> --dry-run`.

4. release-it opens the GitHub Release form in the browser, prefilled with the new version's changelog section. Publish it.

## Publish to npm

Publishing the GitHub Release triggers the **CI & Publish** workflow ([`publish.yml`](../.github/workflows/publish.yml)): it reruns CI, builds and runs `npm publish`. No manual step.

## Publish a prerelease

```bash
pnpm release preminor --preRelease=alpha
```

A version with a prerelease suffix (`5.0.0-alpha.0`) is published under the `next` dist-tag instead of `latest`, so `pnpm add @minimalstuff/ui` keeps installing the last stable version. Consumers install it with `pnpm add @minimalstuff/ui@next` or the exact version.
