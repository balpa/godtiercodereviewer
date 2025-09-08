const vscode = require('vscode');
require('dotenv').config();
const { fixCode } = require('./fixer');
const { getWebviewContent } = require('./getWebviewContent');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

		let AIFixedCode;
		try {
			const configuration = vscode.workspace.getConfiguration('godtiercodereviewer');
        	const apiKey = configuration.get('apiKey');

			if (!apiKey) {
				vscode.window.showErrorMessage('GEMINI_API_KEY ortam değişkeni bulunamadı. Lütfen ayarlayın.');

				return;
			}

			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
			const prompt = `You are an expert code reviewer. Analyze and correct the following code. 
    Only output the raw, corrected code itself. 
    Do not include explanations, introductory sentences, or markdown code blocks like \`\`\`javascript.

    Original Code:
    ${code}`;

			const testPrompt = 'bugün hava nasıl'

			const result = await model.generateContent(prompt);
			const response = await result.response;

			AIFixedCode = response.text();

			console.log(AIFixedCode)

		} catch (error) {
			console.error("Google GenAI Error:", error);

			vscode.window.showErrorMessage('AI yanıtı alınırken bir hata oluştu. Detaylar için OUTPUT > God Tier Code Reviewer konsoluna bakın.');

			return;
		}

		const panel = vscode.window.createWebviewPanel(
			'godtierCodeReview',
			'Code Review Result',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true
			}
		);

		panel.webview.html = getWebviewContent(code, staticallyFixedCode);

		panel.webview.onDidReceiveMessage(
			async message => {
				switch (message.command) {
					case 'applyFix':
						await editor.edit(editBuilder => {
							editBuilder.replace(range, staticallyFixedCode);
						});

						vscode.window.showInformationMessage('Code review done! Changes applied.');

						panel.dispose();

						return;
				}
			},
			undefined,
			context.subscriptions
		);
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