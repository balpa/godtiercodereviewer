const vscode = require('vscode');
const fixer = require('../fixer');

class FixCodeActionProvider {
	constructor(latestFixes) {
		this.latestFixes = latestFixes;
	}

	provideCodeActions(document, range, context, token) {
		const code = document.getText(range);

		if (!code.trim()) {
			return [];
		}

		const fixedCode = fixer.fixCode(code);

		if (fixedCode === code) {
			return [];
		}

		const uriStr = document.uri.toString();

		if (!this.latestFixes.has(uriStr)) {
			this.latestFixes.set(uriStr, []);
		}

		this.latestFixes.get(uriStr).push({ range, fixedCode });

		const fixAction = new vscode.CodeAction('Apply Fixer Suggestion', vscode.CodeActionKind.QuickFix);
		fixAction.command = {
			title: 'Apply Fix',
			command: 'godtiercodereviewer.applyFix',
			arguments: [document.uri, range]
		};

		const rejectAction = new vscode.CodeAction('Reject Fix', vscode.CodeActionKind.QuickFix);
		rejectAction.command = {
			title: 'Reject Fix',
			command: 'godtiercodereviewer.rejectFix',
			arguments: [document.uri, range]
		};

		return [fixAction, rejectAction];
	}
}

module.exports = FixCodeActionProvider;
