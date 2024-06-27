const verbose = process.argv.find((arg) => arg === '--verbose')
const quietLog = process.argv.find((arg) => arg === '--quiet')

const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const RESET = '\x1b[0m'

export function debug(message: string): void {
  if (!verbose) {
    return
  }

  console.log(`${YELLOW}coauthors >${RESET} DEBUG: ${message}`)
}

export function log(message: string): void {
  if (quietLog) {
    return
  }

  console.log(`${YELLOW}coauthors >${RESET} ${message}${RESET}`)
}

export function error(message: string): void {
  console.error(`${YELLOW}coauthors > ${RED}ERROR - ${message}${RESET}`)
}
