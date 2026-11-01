# Release a new version

A release is cut locally with release-it, then published to npm by GitHub Actions once the GitHub Release is published.

## Before the first release

Publishing uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), so no npm token is stored anywhere. On npmjs.com, `@minimalstuff/ui` > **Settings > Trusted publishing** must list GitHub Actions with organization `minimalstuff`, repository `ui` and workflow `publish.yml`.

The release also rebuilds the stable Storybook, from a workflow run on the release tag. In the repository's **Settings > Environments > github-pages**, the deployment rules must allow the `main` branch and the tag pattern `*.*.*`; otherwise GitHub rejects that deployment.

## Cut the release

1. Start from an up-to-date `main` with a clean working tree.
2. Check that `## [Unreleased]` in [`CHANGELOG.md`](../CHANGELOG.md) lists every user-visible change since the last release. The changelog is written by hand; release-it refuses to release with an empty `Unreleased` section.
3. Run, with the increment that matches the changes (`patch`, `minor` or `major`):

   ```bash
   pnpm release <increment>
   ```

   release-it runs `pnpm verify` (checks, tests and build), turns `Unreleased` into the new version's section, commits `chore: release v<version>`, tags `<version>` and pushes. Hooks and options live in [`.release-it.json`](../.release-it.json).

   To preview the version and changelog without changing anything, run `pnpm release <increment> --dry-run`. A dry run skips the hooks, so it does not run `pnpm verify`.

4. release-it opens the GitHub Release form in the browser, prefilled with the new version's changelog section. Publish it.

## Publish to npm

Publishing the GitHub Release triggers the **CI & Publish** workflow ([`publish.yml`](../.github/workflows/publish.yml)): it reruns CI, builds and packs the tarball in a job without publishing rights, then a separate job publishes that tarball with `npm publish`. No manual step.

The publish job runs in the `npm` GitHub environment. Binding the npm trusted publisher entry to that environment on npmjs.com makes npm reject a token from any other job. A required reviewer in **Settings > Environments > npm** adds little with a single maintainer: whoever can publish a GitHub Release can also approve the deployment.

Publishing the release also runs the **Build and Publish Storybook to GitHub Pages** workflow ([`github_pages_publish.yml`](../.github/workflows/github_pages_publish.yml)): it rebuilds the stable Storybook at `/ui/` from the latest stable GitHub Release (a prerelease leaves it as it is), while `/ui/next/` follows `main`.

## Publish a prerelease

```bash
pnpm release preminor --preRelease=alpha
```

A version with a prerelease suffix (`5.0.0-alpha.0`) is published under the `next` dist-tag instead of `latest`, so `pnpm add @minimalstuff/ui` keeps installing the last stable version. Consumers install it with `pnpm add @minimalstuff/ui@next` or the exact version.
