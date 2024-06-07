import { type Author, authorSchema } from './schemas'
import { githubUser } from './utils/githubUser'
const a = 'hi'
export const coauthor = (author: Author) =>
  githubUser(authorSchema.parse(author).user).then(
    (githubUser) =>
      `Co-authored-by: ${author.name ?? githubUser.name ?? author.user} <${
        githubUser.id
      }+${author.user}@users.noreply.github.com>` as const
  )
