import * as vscode from 'vscode'

export class StatusBarItem extends vscode.Disposable {
  private readonly statusBarItem: vscode.StatusBarItem

  constructor() {
    super(() => {})
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1)
    statusBarItem.text = 'Coauthors'
    statusBarItem.tooltip = 'Coauthors Generator'
    statusBarItem.command = 'coauthors.site'
    this.statusBarItem = statusBarItem
    this.statusBarItem.show()
  }
}
