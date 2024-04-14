import { githubUserSchema } from "../schemas";
import { universalFetch } from "./universalFetch";

export const githubUser = (username: string) =>
  universalFetch(`https://api.github.com/users/${username}`).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch user: ${res.statusText}`);
    return res.json().then(githubUserSchema.parse);
  });
