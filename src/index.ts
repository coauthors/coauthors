async function main() {
	const args = process.argv.slice(2);
	if (args.length < 1) {
		console.log("Usage: npx co-author-cli <github-user> <github-user(name)>");
		process.exit(1);
	}
	const authors = await parseAuthors(args);
	return generateCoAuthors(authors);	
}

main()
	.then((coAuthors)=> {
		console.log(coAuthors);
	})
	.catch((error) => {
		console.error(error.message);
		process.exit(1);
	});

async function parseAuthors(args: string[]) {
	return args.map((arg) => {
		const [user, name] = arg.split(/\(([^)]+)\)/);
		return { user, name };
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
