import { markdownTable } from 'markdown-table'
import type { Probot } from 'probot'

const truncate = (str: string, num: number): string => (str.length > num ? str.slice(0, num) + '...' : str)

export default (app: Probot) => {
  app.on(
    ['pull_request.opened', 'pull_request.synchronize', 'pull_request_review', 'issue_comment'],
    async (context) => {
      if (context.name === 'issue_comment') {
        const isPullRequest = !!context.payload.issue.pull_request
        if (!isPullRequest) return
      }

      try {
        const repo = {
          repo: context.payload.repository.name,
          owner: context.payload.repository.owner.login,
        }

        const issueNumber =
          context.name === 'issue_comment' ? context.payload.issue.number : context.payload.pull_request.number

        const prReviews = (await context.octokit.pulls.listReviews({ ...repo, pull_number: issueNumber })).data
        const commentsForReview = (
          await Promise.all(
            prReviews.map((review) =>
              context.octokit.pulls.listCommentsForReview({ ...repo, pull_number: issueNumber, review_id: review.id })
            )
          )
        ).flatMap((comments) => comments.data)

        const comments = (await context.octokit.issues.listComments({ ...repo, issue_number: issueNumber })).data
        const coauthorsCommentAlready = comments.find((comment) => comment.user?.login === 'coauthors[bot]') ?? null
        const userComments = [
          ...comments.map((comment) => ({ type: 'comment', comment }) as const),
          ...commentsForReview.map((comment) => ({ type: 'comment for review', comment }) as const),
          ...prReviews.map((comment) => ({ type: 'review', comment }) as const),
        ].filter(({ comment }) => comment.user?.login.endsWith('[bot]') === false)

        const tableBody = Object.entries(
          userComments.reduce<Record<string, typeof userComments>>(
            (acc, cur) =>
              cur.comment.user == null
                ? acc
                : { ...acc, [cur.comment.user.login]: [...(acc[cur.comment.user.login] ?? []), cur] },
            {}
          )
        ).map(
          ([username, comments]) =>
            [
              `@${username}`,
              comments
                .map(
                  ({ type, comment }) =>
                    `[${comment.body ? `${truncate(comment.body, 30)}(${type})` : 'this comment'}](${comment.html_url})`
                )
                .join(', '),
              `${comments.length}`,
              `[Click here to add this person as co-author](https://coauthors.me/generator?username=${username})`,
            ] as const
        )

        const table = markdownTable([['Candidate', 'Reasons', 'Count', 'Action'], ...tableBody], { padding: false })

        const prComment = {
          ...repo,
          issue_number: issueNumber,
          body: `### People could be co-author:

${table}`,
        }

        if (coauthorsCommentAlready?.id != null) {
          return context.octokit.issues.updateComment({ ...prComment, comment_id: coauthorsCommentAlready.id })
        }
        return context.octokit.issues.createComment(prComment)
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  )

  app.onAny((context) => {
    app.log.info({ event: context.name })
  })
}
