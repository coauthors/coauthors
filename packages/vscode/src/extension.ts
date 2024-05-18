import * as vscode from 'vscode'
import { StatusBarItem } from './statusBarItem'

export function activate(context: vscode.ExtensionContext) {
  console.log('Starting Coauthors ...')

  context.subscriptions.push(
    vscode.commands.registerCommand('coauthors.add', () => {
      vscode.window.showInformationMessage('Add Coauthors!')
    }),
    vscode.commands.registerCommand('coauthors.site', () => {
      vscode.env.openExternal(vscode.Uri.parse('https://coauthors.me/docs/generator'))
    }),
    new StatusBarItem()
  )
}

export function deactivate() {}
