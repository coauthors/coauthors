import { program } from "@commander-js/extra-typings";
import packageJson from "../package.json";
import { convert, log, prepareCommitMsg } from "./utils";

program
  .name("coauthors")
  .description(
    "CLI to add Co-author easily (If no options, it will work on prepare-commit-msg git hook)",
  )
  .version(packageJson.version, "-v, --version")
  .option("-m, --message <message>", "commit message with coauthors")
  .action(async ({ message }) => {
    if (message) {
      const { isConverted, result } = await convert(message);
      if (isConverted) {
        log(`Successful! 🎉

`);
        console.log(result);
        return;
      }
      log(`There is no coauthors grammars, but it's okay 👌

`);
      console.log(result);
      return;
    }
    prepareCommitMsg();
  });

program.parse();
