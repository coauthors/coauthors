import fs from 'node:fs'
import path from 'node:path'
import { exit } from 'node:process'
import { convert } from './convert'
import { error, log } from './log'

export const prepareCommitMsg = async () => {
  try {
    log('start')
    const cwd = process.cwd()
    log(`Resolving .git path from ${cwd}`)
    let gitRootPath = path.resolve(cwd, '')
    if (!gitRootPath.includes('.git')) {
      gitRootPath = path.join(gitRootPath, '.git')
    }
    const commitEditMsgPath = path.join(gitRootPath, 'COMMIT_EDITMSG')
    const message = fs.readFileSync(commitEditMsgPath, { encoding: 'utf-8' })
    const converted = await convert(message)
    fs.writeFileSync(commitEditMsgPath, converted.result, {
      encoding: 'utf-8',
    })
    log('done')
  } catch (_error) {
    if (_error instanceof Error) {
      error(_error.message)
      exit(1)
    }
  }
}
