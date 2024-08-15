import { createNodeMiddleware, createProbot } from 'probot'
import { app } from '../../../src/app'

export default createNodeMiddleware(app, {
  probot: createProbot({
    env: {
      APP_ID: process.env.APP_ID,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      PRIVATE_KEY: process.env.PRIVATE_KEY!.replace(/\\n/g, '\n'),
      WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    },
  }),
  webhooksPath: '/api/github/webhooks',
})
