async function main() {
	const args = process.argv.slice(2);
	if (args.length < 1) {
		console.log("Usage: npx co-author-cli <github-user> <github-user(name)>");
		process.exit(1);
	}
	const authors = await parseAuthors(args);
	const coAuthors = await generateCoAuthors(authors);
	console.log(coAuthors);
}

main().catch((error) => {
	console.error(error.message);
	process.exit(1);
});

async function parseAuthors(args: string[]) {
	return args.map((arg) => {
		const match = arg.match(/(?<user>\w+)(?:\((?<name>.+)\))?/);
		if (!match || !match.groups || !match.groups.user) {
			throw new Error(
				`Invalid author: ${arg}. Expected format: github-user or github-user(name)`,
			);
		}
		return {
			user: match.groups.user,
			name: match.groups.name ?? undefined,
		};
	});
}

async function generateCoAuthors(authors: { user: string; name: string }[]) {
	const coAuthors = await Promise.all(
		authors.map(async ({ user, name }) => {
			const resUser = await fetchGithubUser(user);
			return `Co-authored-by: ${name ?? resUser.name} <${
				resUser.id
			}+${user}@users.noreply.github.com>`;
		}),
	);
	return coAuthors.join("\n");
}

async function fetchGithubUser(user: string) {
	const res = await fetch(`https://api.github.com/users/${user}`);
	if (!res.ok) throw new Error(`Failed to fetch user: ${res.statusText}`);
	return await res.json();
}
