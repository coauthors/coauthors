#!/usr/bin/env node
import { error, log } from "./utils/log";

(async (): Promise<void> => {
  log("start");

  try {
    log("log");
  } catch (err: unknown) {
    if (typeof err === "string") {
      error(err);
    } else {
      error(String(err));
    }
  }

  log("done");
})();
