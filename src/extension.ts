'use strict';

import * as vscode from 'vscode';
import * as copypaste from 'copy-paste';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.generateTranslationString',
    async () => {
      const settings = vscode.workspace.getConfiguration(
        'ngx-translate-quickcreate',
      );

      // Get the active editor window
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('Select text to translate');
        return;
      }
      // Fetch the selected text
      const selectedText = editor.document.getText(editor.selection);
      if (!selectedText) {
        vscode.window.showInformationMessage('Select text to translate');
        return;
      }
      let input = (await vscode.window.showInputBox()) || selectedText;
      const key = input.toUpperCase().replace(' ', '_');
      // Generate a json key/value pair
      const value = `"${key}": "${selectedText}"`;
      // Copy the translation json to the clipboard
      copypaste.copy(value);

      if (settings.get('replaceOnTranslate')) {
        // Replace the selection text with the translated key
        const padding = settings.padding ? ' ' : '';
        const quote = settings.quote;
        const translation = `{{${padding}${quote}${key}${quote} | ${
          settings.translatePipeName
        }${padding}}}`;
        editor.edit(builder => {
          builder.replace(editor.selection, translation);
        });
      }
    },
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
