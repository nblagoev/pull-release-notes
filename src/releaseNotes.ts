import * as Octokit from "@octokit/rest"

import { Commits } from "./commits"
import { Logger } from "./logger"
import { PullRequests, PullRequestInfo } from "./pullRequests"

export { PullRequestInfo } from "./pullRequests"
export interface ReleaseNotesOptions {
    owner: string
    repo: string
    fromTag: string
    toTag: string
    formatter: (pr: PullRequestInfo) => string
}

export class ReleaseNotes {
    static defaultFormatter(pullRequest: PullRequestInfo): string {
        return `* [#${pullRequest.number}](${pullRequest.htmlURL}) - ${pullRequest.title}`
    }

    constructor(private options: ReleaseNotesOptions) {}

    async pull(token?: string): Promise<string> {
        const octokit = new Octokit({
            auth: `token ${token || process.env.GITHUB_TOKEN}`,
        })

        return this.getFormattedPullRequests(octokit)
    }

    private async getFormattedPullRequests(octokit: Octokit): Promise<string> {
        const { owner, repo, fromTag, toTag, formatter } = this.options
        Logger.log("Comparing", `${owner}/${repo}`, `${fromTag}...${toTag}`)

        if (!formatter) {
            Logger.warn("A `formatter` must be specified!")
            return ""
        }

        const commitsApi = new Commits(octokit)
        const commits = await commitsApi.getDiff(owner, repo, fromTag, toTag)

        if (commits.length === 0) {
            return ""
        }

        const firstCommit = commits[0]
        const lastCommit = commits[commits.length - 1]
        const fromDate = firstCommit.date
        const toDate = lastCommit.date

        Logger.log(`Fetching PRs between dates ${fromDate.toISOString()} ${toDate.toISOString()} for ${owner}/${repo}`)

        const pullRequestsApi = new PullRequests(octokit)
        const pullRequests = await pullRequestsApi.getBetweenDates(owner, repo, fromDate, toDate)

        Logger.log(`Found ${pullRequests.length} merged PRs for ${owner}/${repo}`)

        const prCommits = pullRequestsApi.filterCommits(commits)
        const filteredPullRequests = []
        const pullRequestsByNumber: { [key: number]: PullRequestInfo } = {}

        for (const pr of pullRequests) {
            pullRequestsByNumber[pr.number] = pr
        }

        for (const commit of prCommits) {
            if (!commit.prNumber) {
                continue
            }

            if (pullRequestsByNumber[commit.prNumber]) {
                filteredPullRequests.push(pullRequestsByNumber[commit.prNumber])
            } else if (fromDate.toISOString() === toDate.toISOString()) {
                Logger.log(`${owner}/${repo}#${commit.prNumber} not in date range, fetching explicitly`)
                const pullRequest = await pullRequestsApi.getSingle(owner, repo, commit.prNumber)

                if (pullRequest) {
                    filteredPullRequests.push(pullRequest)
                } else {
                    Logger.warn(`${owner}/${repo}#${commit.prNumber} not found! Commit text: ${commit.summary}`)
                }
            } else {
                Logger.log(
                    `${owner}/${repo}#${commit.prNumber} not in date range, ` +
                        `likely a merge commit from a fork-to-fork PR`
                )
            }
        }

        if (pullRequests.length) {
            return pullRequests.reduce((result, pr) => {
                return `${result}${formatter(pr)}\n`
            }, "")
        } else {
            return ""
        }
    }
}
