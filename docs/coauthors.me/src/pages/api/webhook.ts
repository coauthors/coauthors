import { app, createNodeMiddleware, createProbot } from 'coauthors-bot'

// requires:
// - APP_ID
// - PRIVATE_KEY
// - WEBHOOK_SECRET
const probot = createProbot()

export default createNodeMiddleware(app, {
  probot,
  webhooksPath: '/api/webhook',
})
