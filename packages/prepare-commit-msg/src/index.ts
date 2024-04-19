#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { convert } from "./utils";
import { log } from "./utils/log";

(async (): Promise<void> => {
  log("start");
  const cwd = process.cwd();
  log(`Resolving .git path from ${cwd}`);
  let gitRootPath = path.resolve(cwd, "");
  if (!gitRootPath.includes(".git")) {
    gitRootPath = path.join(gitRootPath, ".git");
  }
  const commitEditMsgPath = path.join(gitRootPath, "COMMIT_EDITMSG");
  const message = fs.readFileSync(commitEditMsgPath, { encoding: "utf-8" });
  const converted = await convert(message);
  fs.writeFileSync(commitEditMsgPath, converted.result, { encoding: "utf-8" });

  log("done");
})();
