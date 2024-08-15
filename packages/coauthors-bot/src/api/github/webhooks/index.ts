import { createNodeMiddleware, createProbot } from 'probot'
import { app } from '../../../app'

export default createNodeMiddleware(app, {
  probot: createProbot(),
  webhooksPath: '/api/github/webhooks',
})
