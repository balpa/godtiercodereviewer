const vscode = require('vscode');
const { fixCode } = require('./fixer');

const activate = (context) => {
	const commandId = 'godtiercodereviewer.start';

	const disposable = vscode.commands.registerCommand(commandId, async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('No active editor found!');
			return;
		}

		const selection = editor.selection;
		let code, range;

		if (selection.isEmpty) {
			code = editor.document.getText();

			const start = new vscode.Position(0, 0);
			const lastLineIndex = editor.document.lineCount - 1;
			const lastLineLength = editor.document.lineAt(lastLineIndex).text.length;
			const end = new vscode.Position(lastLineIndex, lastLineLength);
			range = new vscode.Range(start, end);
		} else {
			code = editor.document.getText(selection);
			range = selection;
		}

		if (!code.trim()) {
			vscode.window.showErrorMessage('No code selected or document is empty!');
			return;
		}

		const staticallyFixedCode = fixCode(code);

		await editor.edit(editBuilder => {
			editBuilder.replace(range, staticallyFixedCode);
		});

		vscode.window.showInformationMessage('Code review done!');
	});

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 900);
	statusBarItem.command = commandId;
	statusBarItem.text = '$(tools) Review Code';
	statusBarItem.tooltip = 'Run God Tier Code Reviewer';
	statusBarItem.show();

	context.subscriptions.push(disposable, statusBarItem);
};

const deactivate = () => { };

module.exports = {
	activate,
	deactivate
};
