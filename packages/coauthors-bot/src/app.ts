import markdownTable from 'markdown-table'
import type { Probot } from 'probot'

export const app = (app: Probot) => {
  app.on(
    ['pull_request.opened', 'pull_request.synchronize', 'pull_request_review', 'issue_comment', 'issues.opened'],
    async (context) => {
      try {
        if (context.isBot) {
          return
        }

        const repo = {
          repo: context.payload.repository.name,
          owner: context.payload.repository.owner.login,
        }

        const number =
          context.name === 'issue_comment' || context.name === 'issues'
            ? context.payload.issue.number
            : context.payload.pull_request.number

        const comments = [
          { type: 'issue', comment: (await context.octokit.issues.get({ ...repo, issue_number: number })).data },
          ...(await context.octokit.issues.listComments({ ...repo, issue_number: number })).data.map(
            (comment) => ({ type: 'comment', comment }) as const
          ),
        ]
        const coauthorsCommentAlready =
          comments.find(({ comment }) =>
            comment.user ? ['coauthors[bot]', 'coauthors-dev[bot]'].includes(comment.user.login) : false
          ) ?? null

        const isPr =
          context.name === 'pull_request' ||
          context.name === 'pull_request_review' ||
          context.payload.issue.pull_request != null
        if (isPr) {
          const prReviews = (await context.octokit.pulls.listReviews({ ...repo, pull_number: number })).data.map(
            (comment) => ({ type: 'review', comment }) as const
          )
          const commentsForReview = (
            await Promise.all(
              prReviews.map((review) =>
                context.octokit.pulls.listCommentsForReview({
                  ...repo,
                  pull_number: number,
                  review_id: review.comment.id,
                })
              )
            )
          )
            .flatMap((comments) => comments.data)
            .map((comment) => ({ type: 'comment for review', comment }) as const)

          const userComments = [...comments, ...commentsForReview, ...prReviews].filter(
            ({ comment }) => comment.user?.login.endsWith('[bot]') === false
          )

          const commentBody = `### People can be co-author:

${markdownTable(
  [
    ['Candidate', 'Reasons', 'Count', 'Add this as commit message'],
    ...Object.entries(
      // Group comments by user
      userComments.reduce<
        Record<
          string,
          {
            comments: typeof userComments
            user: Exclude<(typeof userComments)[number]['comment']['user'], null>
          }
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

          return coauthorsCommentAlready?.comment.id != null
            ? context.octokit.issues.updateComment({
                ...repo,
                issue_number: number,
                body: commentBody,
                comment_id: coauthorsCommentAlready.comment.id,
              })
            : context.octokit.issues.createComment({
                ...repo,
                issue_number: number,
                body: commentBody,
              })
        } else {
          const userComments = [...comments].filter(({ comment }) => comment.user?.login.endsWith('[bot]') === false)

          const tableRows = Object.entries(
            // Group comments by user
            userComments.reduce<
              Record<
                string,
                {
                  comments: typeof userComments
                  user: Exclude<(typeof userComments)[number]['comment']['user'], null>
                }
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
          ])

          const commentBody = `### People can be co-author:

${markdownTable(
  [
    ['Candidate', 'Reasons', 'Count', 'Add this as commit message'],
    ...(tableRows.length > 0 ? tableRows : [['No candidate', '', '', '']]),
  ],
  { padding: false }
)}`

          return coauthorsCommentAlready?.comment.id != null
            ? context.octokit.issues.updateComment({
                ...repo,
                issue_number: number,
                body: commentBody,
                comment_id: coauthorsCommentAlready.comment.id,
              })
            : context.octokit.issues.createComment({
                ...repo,
                issue_number: number,
                body: commentBody,
              })
        }
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  )
}
