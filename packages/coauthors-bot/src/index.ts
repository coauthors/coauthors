import type { Probot } from 'probot'

export default (app: Probot) => {
  console.log('Yay, the app was loaded!')

  app.on('issues.opened', async (context) => {
    await context.octokit.issues.createComment({
      issue_number: 81,
      body: `**Coauthors bot🤖 is ready to add below people as co-author:**
| Name | Reasons | Actions |
| :--- | :----- | :------- |
| @manudeli | https://github.com/coauthors/coauthors/issues/81#issuecomment-2271790698 | [Click here to add this person as co-author](https://coauthors.me/generator?username=manudeli) |
| @2-NOW | https://github.com/coauthors/coauthors/issues/81#issuecomment-2271790698 | [Click here to add this person as co-author](https://coauthors.me/generator?username=2-NOW) |
`,
      owner: 'coauthors',
      repo: 'coauthors',
    })
  })

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
