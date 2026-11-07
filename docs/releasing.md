# Release a new version

A release is cut by GitHub Actions: a manual run of the **CI & Publish** workflow ([`publish.yml`](../.github/workflows/publish.yml)) checks the code, cuts the release with release-it, and publishes to npm. Nothing is released from a local machine.

## One-time setup

Done by hand by the maintainer.

- **Why environments.** npm trusted publishing does not check the branch, and a repository-level secret is readable from any branch. Both the deploy key and the publish rights therefore live in environments restricted to `main`.
- **Environment `release`.** In **Settings > Environments**, create `release` with deployment branches limited to `main`. Add the environment secret `RELEASE_DEPLOY_KEY`: the private half of an ed25519 deploy key whose public half is in **Settings > Deploy keys** with **Allow write access**. release-it pushes the release commit and the tag with this key.
- **Environment `npm` and trusted publishing.** Restrict the `npm` environment to the `main` branch. Publishing uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), so no npm token is stored anywhere. On npmjs.com, `@minimalstuff/ui` > **Settings > Trusted publishing** must list GitHub Actions with organization `minimalstuff`, repository `ui`, workflow `publish.yml` and environment `npm`. A required reviewer on `npm` adds little with a single maintainer.
- **npm publishing access.** On npmjs.com, set **Publishing access** to "Require two-factor authentication and disallow tokens".
- **Tag ruleset.** In **Settings > Rules > Rulesets**, add a tag ruleset targeting all tags that restricts creation, updates and deletion. Add **Deploy keys** as the only bypass actor, with no admin bypass, so that the workflow is the only actor able to create a tag.
- **GitHub Pages.** In **Settings > Environments > github-pages**, the deployment rules must allow the `main` branch. The Storybook deployment now runs from a workflow run on `main`, not from the release tag, so the former `*.*.*` tag pattern is no longer needed.

## Cut the release

1. Check that `## [Unreleased]` in [`CHANGELOG.md`](../CHANGELOG.md) lists every user-visible change since the last release, and that it is merged on `main`. The changelog is written by hand; release-it refuses to release with an empty `Unreleased` section.
2. Run the workflow with the increment that matches the changes (`patch`, `minor` or `major`):

   ```bash
   gh workflow run publish.yml -f increment=minor
   ```

   Or use **Actions > CI & Publish > Run workflow** in the browser.

3. Follow the run: `gh run watch`.

## Publish a prerelease

```bash
gh workflow run publish.yml -f increment=minor -f pre-release-id=alpha
```

A version with a prerelease suffix (`5.0.0-alpha.0`) is published under the `next` dist-tag instead of `latest`, so `pnpm add @minimalstuff/ui` keeps installing the last stable version. Consumers install it with `pnpm add @minimalstuff/ui@next` or the exact version.

## What the workflow does

Jobs run in this order, one release at a time (a second run waits, it never cancels the first):

1. `verify` runs [`ci.yml`](../.github/workflows/ci.yml): checks, tests, stories and build.
2. `release` calls the reusable release workflow of `minimalstuff/tooling`: it runs `tooling check-release` (fails if the lockfile holds a `link:`/`file:` dependency or a `@minimalstuff` patch), then release-it. release-it turns `Unreleased` into the new version's section, commits `chore: release v<version>`, tags `<version>`, pushes with the deploy key and creates the GitHub Release through the API. Hooks and options live in [`.release-it.json`](../.release-it.json).
3. `build` checks out the new tag, builds, checks that the packed version matches the released one, and packs the tarball, in a job without publishing rights.
4. `publish` publishes that tarball with `npm publish`, in the `npm` environment.
5. `storybook` calls [`github_pages_publish.yml`](../.github/workflows/github_pages_publish.yml): it rebuilds the stable Storybook at `/ui/` from the latest stable GitHub Release (a prerelease leaves it as it is), while `/ui/next/` follows `main`. A release created with the workflow token does not trigger `release: published` workflows, which is why it is called explicitly.

To preview the version and changelog locally without changing anything, run `pnpm release <increment> --dry-run`.
