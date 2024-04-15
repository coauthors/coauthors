import { coauthors } from "@coauthors/core";
import { parseAuthors } from "./utils/parseAuthors";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("Usage: npx co-author-cli <github-user> <github-user(name)>");
    process.exit(1);
  }

  const coAuthors = await coauthors(parseAuthors(args));
  console.log(coAuthors);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
