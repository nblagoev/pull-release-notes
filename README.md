
# pull-release-notes

> A command line utility to generate a PR changelog between two refs.

[![NPM package](https://img.shields.io/npm/v/@nblagoev/pull-release-notes.svg)](https://npmjs.org/package/@nblagoev/pull-release-notes)
[![Build Status](https://github.com/nblagoev/pull-release-notes/workflows/build/badge.svg)](https://github.com/nblagoev/pull-release-notes/actions)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=nblagoev/pull-release-notes)](https://dependabot.com)
[![Coverage Status](https://codecov.io/gh/nblagoev/pull-release-notes/branch/master/graph/badge.svg)](https://codecov.io/gh/nblagoev/pull-release-notes)

## Usage

### Install
Create local `.npmrc` in your project folder:
```
@nblagoev:registry=https://npm.pkg.github.com/
```

```bash
npm install @nblagoev/pull-release-notes --save-dev
```

This relies on the GitHub API; you should [create an API token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/), and place it in the `GITHUB_TOKEN` environment variable. It needs `public_repo` access if your repo is public, and `repo` access if your repo is private.

### CLI
Generate a changelog with merged pull requests between v1.0.0 and v1.1.0

```bash
pull-release-notes -v -r user/repo v1.0.0...v1.1.0 > CHANGELOG.md
```

### In another script

```ts
import { ReleaseNotes } from "pull-release-notes"

const releaseNotes = new ReleaseNotes({
    owner: "user",
    repo: "repo-name",
    fromTag: "v1.0.0",
    toTag: "v1.1.0",
    formatter: ReleaseNotes.defaultFormatter,
})

releaseNotes.pull()
    .then(output => {
        console.log(output)
    })
    .catch(err => {
        console.error("error", err)
    })
```

You can also write your own formatter. See examples [here](./src/formatters.ts).
