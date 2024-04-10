async function main() {
	const args = process.argv.slice(2);
	if (args.length < 1) {
		console.log(
			"Usage: npx co-author-cli <name:github-user> [<name:github-user>...]",
		);
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
		const [name, user] = arg.split(":");
		if (!user || !name) {
			throw new Error(`Expected format "name:github-user", but got "${arg}"`);
		}
		return { name, user };
	});
}

async function generateCoAuthors(authors: { name: string; user: string }[]) {
	const coAuthors = await Promise.all(
		authors.map(async ({ name, user }) => {
			const resUser = await fetchGithubUser(user);
			return `Co-authored-by: ${name} <${resUser.id}+${user}@users.noreply.github.com>`;
		}),
	);
	return coAuthors.join("\n");
}

async function fetchGithubUser(user: string) {
	const res = await fetch(`https://api.github.com/users/${user}`);
	if (!res.ok) throw new Error(`Failed to fetch user: ${res.statusText}`);
	return await res.json();
}
