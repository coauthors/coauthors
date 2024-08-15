// requires:
// - APP_ID
// - PRIVATE_KEY

import { createNodeMiddleware, createProbot } from 'probot'
import app from '@/bot'

// - WEBHOOK_SECRET
const probot = createProbot({
  env: {
    APP_ID: process.env.APP_ID,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  },
})

export default createNodeMiddleware(app, {
  probot,
  webhooksPath: '/api/webhooks',
})
