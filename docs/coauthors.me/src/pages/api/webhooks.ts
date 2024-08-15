// requires:
// - APP_ID
// - PRIVATE_KEY

import { createNodeMiddleware, createProbot } from 'probot'
import app from '@/bot'

// - WEBHOOK_SECRET
const probot = createProbot()

export default createNodeMiddleware(app, {
  probot,
  webhooksPath: '/api/webhooks',
})
