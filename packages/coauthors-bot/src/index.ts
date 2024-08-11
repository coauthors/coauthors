import { markdownTable } from 'markdown-table'
import type { Probot } from 'probot'

export default (app: Probot) => {
  console.log('Yay, the app was loaded!')

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

        const comment = await context.octokit.issues
          .listComments({ ...repo, issue_number: issueNumber })
          .then((comments) => comments.data.find((comment) => comment.user?.login === 'coauthors[bot]') ?? null)

        const table = markdownTable([
          ['Candidate', 'Reason', 'Action'],
          [
            '@manudeli',
            'comment this',
            '[Click here to add this person as co-author](https://coauthors.me/generator?username=manudeli)',
          ],
        ])

        const prComment = {
          ...repo,
          issue_number: issueNumber,
          body: `### People could be co-author:

${table}`,
        }

        if (comment?.id != null) {
          return context.octokit.issues.updateComment({ ...prComment, comment_id: comment.id })
        }
        return context.octokit.issues.createComment(prComment)
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  )

  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({
      body: 'Thanks for opening this issue!',
    })
    await context.octokit.issues.createComment(issueComment)
  })

  //   app.on('issues.opened', async (context) => {
  //     await context.octokit.issues.createComment({
  //       issue_number: 81,
  //       body: `**Coauthors bot🤖 is ready to add below people as co-author:**
  // | Name | Reasons | Actions |
  // | :--- | :----- | :------- |
  // | @manudeli | https://github.com/coauthors/coauthors/issues/81#issuecomment-2271790698 | [Click here to add this person as co-author](https://coauthors.me/generator?username=manudeli) |
  // | @2-NOW | https://github.com/coauthors/coauthors/issues/81#issuecomment-2271790698 | [Click here to add this person as co-author](https://coauthors.me/generator?username=2-NOW) |
  // `,
  //       owner: 'coauthors',
  //       repo: 'coauthors',
  //     })
  //   })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/

  app.on('installation', async (context) => {
    console.log({ event: 'installation', context })
    await context.octokit.issues.createComment({
      issue_number: 81,
      body: 'Thanks for installing me!',
      owner: 'coauthors',
      repo: 'coauthors',
    })
  })

  app.onAny((context) => {
    app.log.info({ event: context.name })
  })
}
