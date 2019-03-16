[![NPM package](https://img.shields.io/npm/v/pull-release-notes.svg)](https://img.shields.io/npm/v/pull-release-notes.svg)
[![Build Status](https://travis-ci.org/nblagoev/pull-release-notes.svg?branch=master)](https://travis-ci.org/nblagoev/pull-release-notes.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/nblagoev/pull-release-notes/badge.svg?branch=master)](https://coveralls.io/github/nblagoev/pull-release-notes?branch=master)
[![Dependencies Status](https://img.shields.io/librariesio/github/nblagoev/pull-release-notes.svg)](https://img.shields.io/librariesio/github/nblagoev/pull-release-notes.svg)


# pull-release-notes

A command line utility to generate a PR changelog between two refs.

## Usage

### Install
```bash
npm install -g pull-release-notes
```

This relies on the GitHub API; you should [create an API token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/), and place it in the `GITHUB_TOKEN` environment variable. It needs `public_repo` access if your repo is public, and `repo` access if your repo is private.

### CLI
Generate a changelog with merget pull requests between v1.0.0 and v1.1.0

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

You can also write your own formatter:

```ts
import { PullRequestInfo } from "pull-release-notes"

function myChangelogFormatter(pr: PullRequestInfo): string {
    return `* [#${pr.number}](${pr.htmlURL}) - ${pr.title}`
}
```
