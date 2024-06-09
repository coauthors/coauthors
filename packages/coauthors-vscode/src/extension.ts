import { coauthor } from '@coauthors/core'
import * as vscode from 'vscode'
import type * as vscode_git from './@types/vscode.git.d'
import { StatusBarItem } from './statusBarItem'

async function getGitApi(): Promise<vscode_git.API | undefined> {
  try {
    const extension = vscode.extensions.getExtension<vscode_git.GitExtension>('vscode.git')
    if (extension !== undefined) {
      const gitExtension = extension.isActive ? extension.exports : await extension.activate()

      return gitExtension.getAPI(1)
    }
  } catch {
    console.log('Waiting for Git API')
  }

  return undefined
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export async function activate(context: vscode.ExtensionContext) {
  while (!(await getGitApi())) {
    console.log('Waiting for Git API')
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('coauthors.add', async () => {
      const user = await vscode.window.showInputBox({
        title: 'Please enter GitHub Username of the co-author',
        placeHolder: 'GitHub Username',
      })
      const repository = (await getGitApi())?.repositories[0]
      assert(typeof repository !== 'undefined', 'No Git repository found')
      try {
        if (user) {
          const coauthorsString = await coauthor({ user })
          repository.inputBox.value = `${repository.inputBox.value}

${coauthorsString}`
        }
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showErrorMessage(`Coauthors: ${error.message}`)
        }
      }
    }),
    vscode.commands.registerCommand('coauthors.site', () => {
      vscode.env.openExternal(vscode.Uri.parse('https://coauthors.me/generator'))
    }),
    new StatusBarItem()
  )
}

export function deactivate() {}
