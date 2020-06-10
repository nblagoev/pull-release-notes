#! /usr/bin/env node

import * as yargs from "yargs"

import { Logger } from "./logger"
import { ReleaseNotes } from "./releaseNotes"

const argv = yargs
    .usage("Usage: $0 -r <user>/<repo> [options] <baseTag>...<headTag>")
    .string("r")
    .alias("r", "repo")
    .describe("r", "Repository, e.g. <user>/<repo>")
    .boolean("v")
    .alias("v", "verbose")
    .describe("v", "Verbose")
    .help("h")
    .alias("h", "help")
    .demand(1)
    .demandOption("repo").argv

Logger.verbose = argv.verbose === true || false

const spanRegex = /(.+)(?:[\.]{3})(.+)/
const repoRegex = /([^\/]+)\/([^\/]+)/

const tags = spanRegex.exec(argv._[0]) || []
const repoLink = repoRegex.exec(argv.repo) || []

const [, fromTag, toTag] = tags
const [, owner, repo] = repoLink

const releaseNotes = new ReleaseNotes({
    owner,
    repo,
    fromTag,
    toTag,
    formatter: ReleaseNotes.defaultFormatter
})

releaseNotes
    .pull()
    .then(output => {
        console.log(`\n${output}`)
    })
    .catch(err => {
        console.error("error", err)
    })
