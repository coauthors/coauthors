import markdownTable from 'markdown-table'
import type { Probot } from 'probot'

export const app = (app: Probot) => {
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
        const coauthorsCommentAlready =
          comments.find((comment) =>
            comment.user ? ['coauthors[bot]', 'coauthors-dev[bot]'].includes(comment.user.login) : false
          ) ?? null
        const userComments = [
          ...comments.map((comment) => ({ type: 'comment', comment }) as const),
          ...commentsForReview.map((comment) => ({ type: 'comment for review', comment }) as const),
          ...prReviews.map((comment) => ({ type: 'review', comment }) as const),
        ].filter(({ comment }) => comment.user?.login.endsWith('[bot]') === false)

        const commentBody = `### People can be co-author:
  
  ${markdownTable(
    [
      ['Candidate', 'Reasons', 'Count', 'Add this as commit message'],
      ...Object.entries(
        // Group comments by user
        userComments.reduce<
          Record<
            string,
            { comments: typeof userComments; user: Exclude<(typeof userComments)[number]['comment']['user'], null> }
          >
        >(
          (acc, cur) =>
            cur.comment.user == null
              ? acc
              : {
                  ...acc,
                  [cur.comment.user.login]: {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    comments: [...(acc[cur.comment.user.login]?.comments ?? []), cur],
                    user: cur.comment.user,
                  },
                },
          {}
        )
      ).map(([username, { comments, user }]) => [
        // Candidate: mention the user
        `@${username}`,
        // Reasons: list the reasons for co-authoring
        comments
          .sort((a, b) => a.comment.id - b.comment.id)
          .map(({ comment }) => comment.html_url)
          .join(' '),
        // Count: count the number of comments
        `${comments.length}`,
        // Action: add a button to add the user as a co-author
        `\`Co-authored-by: ${user.name ?? user.login} <${user.id}+${user.login}@users.noreply.github.com>\``,
      ]),
    ],
    { padding: false }
  )}`

        const prComment = { ...repo, issue_number: issueNumber, body: commentBody }

        return coauthorsCommentAlready?.id != null
          ? context.octokit.issues.updateComment({ ...prComment, comment_id: coauthorsCommentAlready.id })
          : context.octokit.issues.createComment(prComment)
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  )
}
