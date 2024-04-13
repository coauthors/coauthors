import type { z } from "zod";
import { authorSchema } from "./schemas";
import { githubUser } from "./utils/githubUser";

export const coauthor = (author: z.infer<typeof authorSchema>) =>
  githubUser(authorSchema.parse(author).user).then(
    (githubUser) =>
      `Co-authored-by: ${author.name ?? githubUser.name} <${githubUser.id}+${
        author.user
      }@users.noreply.github.com>` as const,
  );
