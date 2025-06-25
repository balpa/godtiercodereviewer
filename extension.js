const vscode = require('vscode');
const fixer = require('./fixer');
const FixCodeActionProvider = require('./functions/FixCodeActionProvider');

let latestFixes = new Map();

const activate = (context) => {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			{ scheme: 'file', language: 'javascript' },
			new FixCodeActionProvider(latestFixes),
			{ providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('godtiercodereviewer.applyFix', async (uri, range) => {
			const editor = vscode.window.activeTextEditor;

			if (!editor || editor.document.uri.toString() !== uri.toString()) {
				vscode.window.showErrorMessage('Correct editor not focused!');

				return;
			}

			const fixes = latestFixes.get(uri.toString());
			if (!fixes) {
				vscode.window.showErrorMessage('No fixes found for this document!');

				return;
			}

			const fix = fixes.find(f => f.range.isEqual(range));
			if (!fix) {
				vscode.window.showErrorMessage('No fix found for the selected range!');

				return;
			}

			await editor.edit(editBuilder => {
				editBuilder.replace(fix.range, fix.fixedCode);
			});

			vscode.window.showInformationMessage('Fix applied!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('godtiercodereviewer.rejectFix', (uri, range) => {
			vscode.window.showInformationMessage('Fix rejected!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('godtiercodereviewer.start', async () => {
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				vscode.window.showErrorMessage('No active editor!');

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

			const fixedCode = fixer.fixCode(code);

			await editor.edit(editBuilder => {
				editBuilder.replace(range, fixedCode);
			});

			vscode.window.showInformationMessage('Code review done!');
		})
	)
};

const deactivate = () => { };

module.exports = {
	activate,
	deactivate
};
