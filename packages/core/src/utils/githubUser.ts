import { githubUserSchema } from "../schemas";

export function githubUser(username: string) {
  return fetch(`https://api.github.com/users/${username}`).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch user: ${res.statusText}`);
    return res.json().then(githubUserSchema.parse);
  });
}
