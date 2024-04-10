async function main() {
	const args = process.argv.slice(2);
	if (args.length !== 2) {
		console.log("Usage: npx co-author <name> <github-user>");
		process.exit(1);
	}

	const [name, githubUser] = args;
	const res = await fetch(`https://api.github.com/users/${githubUser}`);
	const resUser = await res.json();
	console.log(
		`Co-authored-by: ${name} <${resUser.id}+${githubUser}@users.noreply.github.com>`,
	);
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
