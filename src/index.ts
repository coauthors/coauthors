async function main() {
	const args = process.argv.slice(2);
	if (args.length !== 2) {
		console.log("Usage: npx co-author <github-user-name> <display-name>");
		process.exit(1);
	}

	const [githubUserName, displayName] = args;
	const response = await fetch(
		`https://api.github.com/users/${githubUserName}`,
	);
	const githubUser = await response.json();
	console.log(
		`Co-authored-by: ${displayName} <${githubUser.id}+${githubUserName}@users.noreply.github.com>`,
	);
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
