const vscode = require('vscode');
require('dotenv').config();
const { fixCode } = require('./fixer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const rules = require('./rules.js');
const diff = require('diff');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { GodTierCodeLensProvider } = require('./GodTierCodeLensProvider');
const { getWebviewContent } = require('./getWebviewContent');

let diagnosticCollection;
let currentSuggestionContext = false;
let suggestionDecorationType;
let currentWebviewPanel = null;
let currentAIFixData = null;

async function closeGodTierDiffTab(range) {
    if (!range) return;

    const line = range.start.line + 1;
    const title = `GodTierCodeReviewer Suggestion (Line ${line})`;

    const tabToClose = vscode.window.tabGroups.all
        .flatMap(group => group.tabs)
        .find(tab => tab.label === title);

    if (tabToClose) {
        try {
            await vscode.window.tabGroups.close(tabToClose);
        } catch (e) {
            console.error("Error closing diff tab:", e);
        }
    }
}


function updateDecorations(editor) {
    if (!editor || !diagnosticCollection || !suggestionDecorationType) return;

    const diagnostics = diagnosticCollection.get(editor.document.uri);
    if (!diagnostics) {
        editor.setDecorations(suggestionDecorationType, []);
        return;
    }

    const godtierDiagnostics = diagnostics.filter(d => d.source === 'godtier');
    const decorationRanges = godtierDiagnostics.map(d => d.range);
    
    editor.setDecorations(suggestionDecorationType, decorationRanges);
}


async function removeDiagnostic(uri, rangeToRemove) {
    const diagnostics = diagnosticCollection.get(uri);
    if (!diagnostics) return;

    const newDiagnostics = diagnostics.filter(d =>
        !d.range.isEqual(rangeToRemove)
    );
    diagnosticCollection.set(uri, newDiagnostics);

    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.uri.toString() === uri.toString()) {
        updateDecorations(editor);
    }

    await closeGodTierDiffTab(rangeToRemove);
}

function getActiveDiagnostic(editor) {
    if (!editor) return null;

    const position = editor.selection.active;
    const diagnostics = diagnosticCollection.get(editor.document.uri);
    if (!diagnostics) return null;

    return diagnostics.find(d =>
        d.source === 'godtier' && d.range.contains(position)
    );
}

async function showDiff(oldText, newText, range) {
    try {
        const originalLine = range.start.line + 1;
        const tempDir = os.tmpdir();
        const oldFileName = `godtier.old.L${originalLine}.js`;
        const newFileName = `godtier.new.L${originalLine}.js`;

        const oldFileUri = vscode.Uri.file(path.join(tempDir, oldFileName));
        const newFileUri = vscode.Uri.file(path.join(tempDir, newFileName));

        fs.writeFileSync(oldFileUri.fsPath, oldText);
        fs.writeFileSync(newFileUri.fsPath, newText);

        const title = `GodTierCodeReviewer Suggestion (Line ${originalLine})`;
        await vscode.commands.executeCommand('vscode.diff', oldFileUri, newFileUri, title, {
            preview: false,
            viewColumn: vscode.ViewColumn.Beside
        });

    } catch (e) {
        console.error("Diff Error:", e);
        vscode.window.showErrorMessage('An error occurred while opening the diff view.');
    }
}

function updateSuggestionContext() {
    const editor = vscode.window.activeTextEditor;
    const diagnostic = getActiveDiagnostic(editor);
    
    const newContextValue = !!diagnostic; 

    if (currentSuggestionContext !== newContextValue) {
        vscode.commands.executeCommand('setContext', 'godtier.isActiveSuggestion', newContextValue);
        currentSuggestionContext = newContextValue;
    }
}

async function applyAIFix() {
    if (!currentAIFixData) {
        vscode.window.showErrorMessage('No fix to apply was found.');
        return;
    }

    const { editor, range, fixedCode } = currentAIFixData;
    
    try {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(editor.document.uri, range, fixedCode);
        await vscode.workspace.applyEdit(edit);
        
        vscode.window.showInformationMessage('GodTierCodeReviewer AI: Changes successfully applied!');
        
        if (currentWebviewPanel) {
            currentWebviewPanel.dispose();
        }
    } catch (error) {
        vscode.window.showErrorMessage('An error occurred while applying changes.');
        console.error('Apply fix error:', error);
    }
}

async function rejectAIFix() {
    if (currentWebviewPanel) {
        currentWebviewPanel.dispose();
    }
    vscode.window.showInformationMessage('GodTierCodeReviewer AI: Changes rejected.');
}


const activate = (context) => {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('godtier');
    context.subscriptions.push(diagnosticCollection);

    suggestionDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
        isWholeLine: false
    });
    context.subscriptions.push(suggestionDecorationType); 


    const codeLensProvider = new GodTierCodeLensProvider(diagnosticCollection);
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
            codeLensProvider
        )
    );

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(updateSuggestionContext)
    );
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(e => {
            updateSuggestionContext();
            if (e) {
                updateDecorations(e);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('godtier.applyFromCodeLens', async (args) => {
            const uri = vscode.Uri.parse(args.uri);
            const range = new vscode.Range(args.range[0], args.range[1], args.range[2], args.range[3]);
            const newText = args.newText;

            const edit = new vscode.WorkspaceEdit();
            edit.replace(uri, range, newText);
            await vscode.workspace.applyEdit(edit);

            await removeDiagnostic(uri, range);
            vscode.window.showInformationMessage('GodTierCodeReviewer: Suggestion applied!');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('godtier.rejectFromCodeLens', async (args) => {
            const uri = vscode.Uri.parse(args.uri);
            const range = new vscode.Range(args.range[0], args.range[1], args.range[2], args.range[3]);
            await removeDiagnostic(uri, range);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('godtier.showDiffFromCodeLens', async (args) => {
            const oldText = args.oldText;
            const newText = args.newText;
            const range = new vscode.Range(args.range[0], args.range[1], args.range[2], args.range[3]);
            await showDiff(oldText, newText, range);
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('godtiercodereviewer.applySuggestionAtCursor', async () => {
            const editor = vscode.window.activeTextEditor;
            const diagnostic = getActiveDiagnostic(editor);

            if (!diagnostic) {
                vscode.window.showWarningMessage('GodTierCodeReviewer: Your cursor is not on a suggestion.');
                return;
            }

            const newText = diagnostic.code.fix;
            const range = diagnostic.range;
            const uri = editor.document.uri;

            const edit = new vscode.WorkspaceEdit();
            edit.replace(uri, range, newText);
            await vscode.workspace.applyEdit(edit);

            await removeDiagnostic(uri, range);
            vscode.window.showInformationMessage('GodTierCodeReviewer: Suggestion applied!');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('godtiercodereviewer.rejectSuggestionAtCursor', async () => {
            const editor = vscode.window.activeTextEditor;
            const diagnostic = getActiveDiagnostic(editor);

            if (!diagnostic) {
                vscode.window.showWarningMessage('GodTierCodeReviewer: Your cursor is not on a suggestion.');
                return;
            }
            
            await removeDiagnostic(editor.document.uri, diagnostic.range);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('godtiercodereviewer.showDiffAtCursor', async () => {
            const editor = vscode.window.activeTextEditor;
            const diagnostic = getActiveDiagnostic(editor);

            if (!diagnostic) {
                vscode.window.showWarningMessage('GodTierCodeReviewer: Your cursor is not on a suggestion.');
                return;
            }

            const oldText = diagnostic.code.original;
            const newText = diagnostic.code.fix;
            await showDiff(oldText, newText, diagnostic.range);
        })
    );
    
    const commandId = 'godtiercodereviewer.start';

    const disposable = vscode.commands.registerCommand(commandId, async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        diagnosticCollection.clear();
        editor.setDecorations(suggestionDecorationType, []); 
        
        if (currentSuggestionContext) {
            vscode.commands.executeCommand('setContext', 'godtier.isActiveSuggestion', false);
            currentSuggestionContext = false;
        }

        const selection = editor.selection;
        let originalCode, range;

        if (selection.isEmpty) {
            originalCode = editor.document.getText();
            const start = new vscode.Position(0, 0);
            const lastLineIndex = editor.document.lineCount - 1;
            const lastLineLength = editor.document.lineAt(lastLineIndex).text.length;
            const end = new vscode.Position(lastLineIndex, lastLineLength);
            range = new vscode.Range(start, end);
        } else {
            originalCode = editor.document.getText(selection);
            range = selection;
        }

        if (!originalCode.trim()) {
            vscode.window.showErrorMessage('No code selected or document is empty!');
            return;
        }

        const choice = await vscode.window.showQuickPick(
            [
                { label: '$(sparkle) AI-Assisted Fix', description: 'Analyzes code with Gemini AI and static rules combined.', detail: 'ai' },
                { label: '$(check) Static Fix', description: 'Quickly fixes code using static rules only.', detail: 'static' }
            ],
            {
                placeHolder: 'Please select a fix type:',
                title: 'GodTierCodeReviewer'
            }
        );

        if (!choice) {
            return;
        }

        let selectedModel = 'gemini-2.5-pro';
        if (choice.detail === 'ai') {
            const modelChoice = await vscode.window.showQuickPick(
                [
                    { 
                        label: '$(star-full) Gemini 2.5 Pro', 
                        description: 'Most powerful model - Best quality',
                        detail: 'gemini-2.5-pro'
                    },
                    { 
                        label: '$(flame) Gemini 2.5 Flash', 
                        description: 'Fast and highly efficient',
                        detail: 'gemini-2.5-flash'
                    },
                    { 
                        label: '$(zap) Gemini 2.0 Flash Experimental', 
                        description: 'Latest experimental model - Fast and efficient',
                        detail: 'gemini-2.0-flash-exp',
                        picked: true
                    },
                    { 
                        label: '$(rocket) Gemini 2.0 Flash Thinking Experimental', 
                        description: 'Advanced reasoning capabilities',
                        detail: 'gemini-2.0-flash-thinking-exp-1219'
                    }
                ],
                {
                    placeHolder: 'Select AI model:',
                    title: 'GodTierCodeReviewer - Choose Model'
                }
            );

            if (!modelChoice) {
                return;
            }

            selectedModel = modelChoice.detail;
        }

        const getFinalCode = async () => {
            if (choice.detail === 'ai') {
                return await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: `GodTierCodeReviewer (${selectedModel}) is analyzing your code...`,
                    cancellable: false
                }, async () => {
                    try {
                        const configuration = vscode.workspace.getConfiguration('godtiercodereviewer');
                        const apiKey = configuration.get('apiKey');

                        if (!apiKey) {
                            vscode.window.showErrorMessage('Google GenAI API Key not found. Please enter it in settings.');
                            return null;
                        }

                        const staticallyFixedCode = await fixCode(originalCode);
                        const genAI = new GoogleGenerativeAI(apiKey);
                        const model = genAI.getGenerativeModel({ model: selectedModel });

                        const prompt = `You are an expert JavaScript code reviewer and refactoring specialist. Your task is to analyze and refactor the provided code according to strict coding standards.

## ANALYSIS REQUIREMENTS
1. Review the code against each rule in the [RULES] section below
2. Identify ALL violations systematically by category
3. Apply fixes ONLY for verified rule violations
4. Preserve code behavior and logic completely
5. Maintain existing variable names unless they violate naming conventions (category: Naming, Variables)

## CRITICAL CONSTRAINTS
⚠️ PRESERVE TEMPLATE LITERAL FORMATTING: Multi-line HTML/CSS within template literals (\`...\`) must retain their exact formatting (spaces, indentation, line breaks). DO NOT reformat these blocks.
⚠️ SYNTAX INTEGRITY: Ensure all brackets, parentheses, and braces are properly matched and closed.
⚠️ NO OVER-ENGINEERING: Apply only the rules listed. Do not add unnecessary abstractions.
⚠️ EXISTING LOGIC: Do not alter the functional behavior of the code.

## RULES REFERENCE
The rules are organized by category with unique IDs. Each rule must be enforced strictly.

Categories:
- Variables (V1-V8): Variable naming, usage, and declaration
- Functions (F1-F16): Function design, structure, and best practices  
- Objects & Data (O1-O2): Object access patterns
- Classes (C1-C3): Class design and inheritance
- SOLID (S1-S5): SOLID principles
- Concurrency (CR1): Async/await patterns
- Error Handling (E1): Error handling requirements
- Formatting (FR1-FR2): Code organization
- Comments (CM1-CM3): Comment standards
- Insider API (I1-I13): Framework-specific API usage
- Style Guide (ST1-ST13): Code style requirements
- General JS (JS1-JS25): JavaScript best practices
- Naming (N1-N13): Naming conventions
- Practices (P1-P10): Development practices
- CSS & HTML (CH1-CH9): Markup and styling standards

Full Rules List:
${JSON.stringify(rules, null, 2)}

## CODE TO REFACTOR
${staticallyFixedCode}

## OUTPUT REQUIREMENTS
- Return ONLY the refactored JavaScript code
- NO explanations, comments about changes, or markdown code blocks
- NO introductory text like "Here is the code:" or "The refactored code:"
- NO \`\`\`javascript markers or any formatting wrappers
- The output must be valid, executable JavaScript that can be directly parsed
- Ensure proper syntax: all brackets/braces/parentheses must be closed correctly

OUTPUT THE REFACTORED CODE NOW:`;

                        const result = await model.generateContent(prompt);
                        const response = result.response;
                        let AIFixedCode = response.text();

                        const codeBlockRegex = /```(?:javascript|js)?\s*([\s\S]*?)\s*```/;
                        const match = AIFixedCode.match(codeBlockRegex);

                        AIFixedCode = match ? match[1].trim() : AIFixedCode.trim();

                        return await fixCode(AIFixedCode);

                    } catch (error) {
                        console.error("Google GenAI Error:", error);
                        vscode.window.showErrorMessage('An error occurred while getting AI response. Check the OUTPUT console for details.');
                        return null;
                    }
                });
            } else if (choice.detail === 'static') {
                return await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Applying static code fixes...",
                    cancellable: false
                }, async () => {
                    try {
                        return await fixCode(originalCode);
                    } catch (error) {
                        console.error("Static Fix Error:", error);
                        vscode.window.showErrorMessage('An error occurred during static fix.');
                        return null;
                    }
                });
            }
        };

        const finalCode = await getFinalCode();

        if (!finalCode || !finalCode.trim() || originalCode === finalCode) {
            vscode.window.showInformationMessage("No changes to apply were found in the code.");
            return;
        }

        // Show webview for AI mode
        if (choice.detail === 'ai') {
            if (currentWebviewPanel) {
                currentWebviewPanel.dispose();
            }

            currentWebviewPanel = vscode.window.createWebviewPanel(
                'godtierAIReview',
                'GodTierCodeReviewer AI Review',
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true
                }
            );

            currentAIFixData = {
                editor: editor,
                range: range,
                originalCode: originalCode,
                fixedCode: finalCode
            };

            currentWebviewPanel.webview.html = getWebviewContent(originalCode, finalCode);

            currentWebviewPanel.webview.onDidReceiveMessage(
                message => {
                    if (message.command === 'applyFix') {
                        applyAIFix();
                    } else if (message.command === 'rejectFix') {
                        rejectAIFix();
                    }
                },
                undefined,
                context.subscriptions
            );

            currentWebviewPanel.onDidDispose(() => {
                currentWebviewPanel = null;
                currentAIFixData = null;
            });

            return;
        }

        const patch = diff.structuredPatch(
            'original.js',
            'fixed.js',
            originalCode,
            finalCode,
            "", "",
            { context: 0 }
        );

        const diagnostics = [];
        const selectionStartLine = range.start.line;

        for (const hunk of patch.hunks) {
            const newText = hunk.lines
                .filter(line => !line.startsWith('-'))
                .map(line => line.substring(1))
                .join('\n');

            const relativeStartLine = hunk.oldStart - 1;
            const relativeEndLine = hunk.oldStart + hunk.oldLines - 2;

            const docStartLine = selectionStartLine + relativeStartLine;
            const docEndLine = selectionStartLine + relativeEndLine;

            let diagnosticRange;

            if (hunk.oldLines > 0) {
                const endLineText = editor.document.lineAt(docEndLine).text;
                diagnosticRange = new vscode.Range(
                    new vscode.Position(docStartLine, 0),
                    new vscode.Position(docEndLine, endLineText.length)
                );
            } else {
                const insertLine = selectionStartLine + (hunk.newStart - 1);
                const targetLine = Math.max(0, insertLine - 1);
                const lineText = editor.document.lineAt(targetLine).text;
                diagnosticRange = new vscode.Range(
                    new vscode.Position(targetLine, 0),
                    new vscode.Position(targetLine, lineText.length)
                );
            }

            const oldText = editor.document.getText(diagnosticRange);

            const diagnostic = new vscode.Diagnostic(
                diagnosticRange,
                'GodTierCodeReviewer: Right-click for suggestion or use shortcuts (Alt+A/R/D).', 
                vscode.DiagnosticSeverity.Warning
            );

            diagnostic.source = 'godtier';

            diagnostic.code = {
                value: 'applyFix',
                fix: newText,
                original: oldText
            };

            diagnostics.push(diagnostic);
        }

        if (diagnostics.length > 0) {
            diagnosticCollection.set(editor.document.uri, diagnostics);
            updateDecorations(editor); 

            vscode.commands.executeCommand('editor.action.marker.nextInFiles');
            updateSuggestionContext(); 

            const message = `${diagnostics.length} code suggestion(s) found. Right-click on underlined areas or use keyboard shortcuts to view suggestions.`;
            const actionTitle = 'Go to First Suggestion';

            vscode.window.showInformationMessage(message, actionTitle).then(selection => {
                if (selection === actionTitle) {
                    vscode.commands.executeCommand('editor.action.marker.nextInFiles');
                }
            });

        } else {
            vscode.window.showInformationMessage("No changes to apply were found after diff analysis.");
        }
    });

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 900);
    statusBarItem.command = commandId;
    statusBarItem.text = '$(tools) Review Code';
    statusBarItem.tooltip = 'Run GodTierCodeReviewer';
    statusBarItem.show();

    context.subscriptions.push(disposable, statusBarItem);
};

const deactivate = () => {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
};

module.exports = {
    activate,
    deactivate
};