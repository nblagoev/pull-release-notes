
# pull-release-notes

> A command line utility to generate a PR changelog between two refs.

[![NPM package](https://img.shields.io/npm/v/pull-release-notes.svg)](https://npmjs.org/package/pull-release-notes)
[![Build Status](https://travis-ci.org/nblagoev/pull-release-notes.svg?branch=master)](https://travis-ci.org/nblagoev/pull-release-notes)
[![Dependencies Status](https://david-dm.org/nblagoev/pull-release-notes/status.svg)](https://david-dm.org/nblagoev/pull-release-notes)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=nblagoev/pull-release-notes)](https://dependabot.com)
[![Coverage Status](https://codecov.io/gh/nblagoev/pull-release-notes/branch/master/graph/badge.svg)](https://codecov.io/gh/nblagoev/pull-release-notes)

## Usage

### Install
```bash
npm install -g pull-release-notes
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
