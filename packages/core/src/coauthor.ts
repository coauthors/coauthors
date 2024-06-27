import { type Author, authorSchema } from './schemas'
import { githubUser } from './utils/githubUser'

export const coauthor = (author: Author) =>
  githubUser(authorSchema.parse(author).user).then(
    (githubUser) =>
      `Co-authored-by: ${author.name ?? githubUser.name ?? author.user} <${
        githubUser.id
      }+${author.user}@users.noreply.github.com>` as const
  )
