const verbose = process.argv.find((arg) => arg === "--verbose");
const quietLog = process.argv.find((arg) => arg === "--quiet");

export function debug(message: string): void {
  if (!verbose) {
    return;
  }

  console.log(`@coauthors/prepare-commit-msg > DEBUG: ${message}`);
}

export function log(message: string): void {
  if (quietLog) {
    return;
  }

  console.log(`@coauthors/prepare-commit-msg > ${message}`);
}

export function error(err: string): void {
  console.error(`@coauthors/prepare-commit-msg > ${err}`);
}
