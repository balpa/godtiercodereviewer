const vscode = require('vscode');
require('dotenv').config();
const { fixCode } = require('./fixer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rules = require('./rules.js');
const diff = require('diff');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { GodTierCodeLensProvider } = require('./GodTierCodeLensProvider');
const { getWebviewContent } = require('./getWebviewContent');

const state = {
    diagnosticCollection: null,
    currentSuggestionContext: false,
    suggestionDecorationType: null,
    currentWebviewPanel: null,
    currentAIFixData: null
};

const GODTIER_SOURCE = 'godtier';
const COMMAND_IDS = {
    START: 'godtiercodereviewer.start',
    APPLY_FROM_LENS: 'godtier.applyFromCodeLens',
    REJECT_FROM_LENS: 'godtier.rejectFromCodeLens',
    SHOW_DIFF_FROM_LENS: 'godtier.showDiffFromCodeLens',
    APPLY_AT_CURSOR: 'godtiercodereviewer.applySuggestionAtCursor',
    REJECT_AT_CURSOR: 'godtiercodereviewer.rejectSuggestionAtCursor',
    SHOW_DIFF_AT_CURSOR: 'godtiercodereviewer.showDiffAtCursor'
};

const AI_MODELS = [
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
];

const FIX_TYPES = [
    {
        label: '$(sparkle) AI-Assisted Fix',
        description: 'Analyzes code with Gemini AI and static rules combined.',
        detail: 'ai'
    },
    {
        label: '$(check) Static Fix',
        description: 'Quickly fixes code using static rules only.',
        detail: 'static'
    }
];

const closeGodTierDiffTab = async (range) => {
    if (!range) {
        return;
    }

    const line = range.start.line + 1;
    const title = `GodTierCodeReviewer Suggestion (Line ${line})`;

    const tabToClose = vscode.window.tabGroups.all
        .flatMap((group) => group.tabs)
        .find((tab) => tab.label === title);

    if (tabToClose) {
        try {
            await vscode.window.tabGroups.close(tabToClose);
        } catch (error) {
            console.error('Error closing diff tab:', error);
        }
    }
};

const updateDecorations = (editor) => {
    if (!editor || !state.diagnosticCollection || !state.suggestionDecorationType) {
        return;
    }

    const diagnostics = state.diagnosticCollection.get(editor.document.uri);

    if (!diagnostics) {
        editor.setDecorations(state.suggestionDecorationType, []);
        return;
    }

    const godtierDiagnostics = diagnostics.filter((d) => d.source === GODTIER_SOURCE);
    const decorationRanges = godtierDiagnostics.map((d) => d.range);

    editor.setDecorations(state.suggestionDecorationType, decorationRanges);
};

const removeDiagnostic = async (uri, rangeToRemove) => {
    const diagnostics = state.diagnosticCollection.get(uri);

    if (!diagnostics) {
        return;
    }

    const newDiagnostics = diagnostics.filter((d) => !d.range.isEqual(rangeToRemove));
    state.diagnosticCollection.set(uri, newDiagnostics);

    const editor = vscode.window.activeTextEditor;

    if (editor && editor.document.uri.toString() === uri.toString()) {
        updateDecorations(editor);
    }

    await closeGodTierDiffTab(rangeToRemove);
};

const getActiveDiagnostic = (editor) => {
    if (!editor) {
        return null;
    }

    const position = editor.selection.active;
    const diagnostics = state.diagnosticCollection.get(editor.document.uri);

    if (!diagnostics) {
        return null;
    }

    return diagnostics.find((d) => d.source === GODTIER_SOURCE && d.range.contains(position));
};

const showDiff = async (oldText, newText, range) => {
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
    } catch (error) {
        console.error('Diff Error:', error);
        vscode.window.showErrorMessage('An error occurred while opening the diff view.');
    }
};

const updateSuggestionContext = () => {
    const editor = vscode.window.activeTextEditor;
    const diagnostic = getActiveDiagnostic(editor);
    const newContextValue = !!diagnostic;

    if (state.currentSuggestionContext !== newContextValue) {
        vscode.commands.executeCommand('setContext', 'godtier.isActiveSuggestion', newContextValue);
        state.currentSuggestionContext = newContextValue;
    }
};

const applyAIFix = async () => {
    if (!state.currentAIFixData) {
        vscode.window.showErrorMessage('No fix to apply was found.');
        return;
    }

    const { editor, range, fixedCode } = state.currentAIFixData;

    try {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(editor.document.uri, range, fixedCode);
        await vscode.workspace.applyEdit(edit);

        vscode.window.showInformationMessage('GodTierCodeReviewer AI: Changes successfully applied!');

        if (state.currentWebviewPanel) {
            state.currentWebviewPanel.dispose();
        }

        await runESLintAutoFix(editor.document);
    } catch (error) {
        vscode.window.showErrorMessage('An error occurred while applying changes.');
        console.error('Apply fix error:', error);
    }
};

const rejectAIFix = () => {
    if (state.currentWebviewPanel) {
        state.currentWebviewPanel.dispose();
    }
    vscode.window.showInformationMessage('GodTierCodeReviewer AI: Changes rejected.');
};

const runESLintAutoFix = async (document) => {
    try {
        await document.save();
        await vscode.commands.executeCommand('eslint.executeAutofix');

        return true;
    } catch (error) {
        console.error('ESLint autofix error:', error);

        return false;
    }
};

const getCodeRange = (editor) => {
    const { selection } = editor;

    if (selection.isEmpty) {
        const start = new vscode.Position(0, 0);
        const lastLineIndex = editor.document.lineCount - 1;
        const lastLineLength = editor.document.lineAt(lastLineIndex).text.length;
        const end = new vscode.Position(lastLineIndex, lastLineLength);
        return {
            code: editor.document.getText(),
            range: new vscode.Range(start, end)
        };
    }

    return {
        code: editor.document.getText(selection),
        range: selection
    };
};

const selectModel = async () => {
    const modelChoice = await vscode.window.showQuickPick(AI_MODELS, {
        placeHolder: 'Select AI model:',
        title: 'GodTierCodeReviewer - Choose Model'
    });

    return modelChoice?.detail ?? null;
};

const generateAIPrompt = (staticallyFixedCode) => `You are a specialized JavaScript code quality assistant. Your role is to apply ONLY the specific coding rules provided below to improve code quality while maintaining its exact structure and functionality.

## CORE PRINCIPLES

1. **PRESERVE STRUCTURE**: Do NOT restructure, reorganize, or refactor the code architecture
2. **PRESERVE LOGIC**: Do NOT change any business logic, algorithms, or functional behavior
3. **PRESERVE NAMES**: Keep all variable, function, and class names UNLESS they violate naming rules
4. **APPLY RULES ONLY**: Fix ONLY what violates the specific rules listed below
5. **NO ADDITIONS**: Do NOT add new functions, features, or abstractions

## STRICT CONSTRAINTS

🚫 **DO NOT**:
- Split functions into smaller ones (even if they seem long)
- Change function organization or structure
- Add new helper functions or utilities
- Modify the flow or sequence of operations
- Change variable/function names that don't violate naming rules
- Restructure conditionals or loops (unless syntax violates a rule)
- Add comments or documentation
- Reformat template literals containing HTML/CSS (preserve exact formatting: spaces, indentation, line breaks)

✅ **DO**:
- Fix ALL syntax errors to ensure code is parseable
- Apply naming conventions ONLY when current names clearly violate rules (N1-N13)
- Convert var to const/let (JS1)
- Use arrow functions where appropriate (JS6)
- Fix string literal quotes to single quotes (JS9)
- Apply destructuring where it improves clarity (JS16)
- Fix obvious style violations (ST1-ST13)
- Ensure proper error handling exists (E1)

## CRITICAL SYNTAX VALIDATION

Before applying any rules, ensure the code is syntactically valid. Fix these common syntax issues:

⚠️ **Operator Precedence & Mixing**:
- Nullish coalescing (??) MUST be wrapped in parentheses when mixed with || or &&
  ✅ CORRECT: (value || default) ?? fallback
  ✅ CORRECT: (condition && value) ?? default
  ❌ WRONG: value || default ?? fallback
  ❌ WRONG: condition && value ?? default

- Optional chaining (?.) with ?? requires parentheses
  ✅ CORRECT: (obj?.property) ?? default
  ❌ WRONG: obj?.property ?? default

⚠️ **Brackets & Braces**:
- Every opening bracket {, [, ( MUST have a matching closing bracket
- Check nesting levels are correct
- Ensure object literals, arrays, and function calls are properly closed

⚠️ **Semicolons**:
- Every statement MUST end with a semicolon (;)
- Check for missing semicolons after:
  * Variable declarations
  * Function calls
  * Return statements
  * Expression statements

⚠️ **Quotes & Strings**:
- All strings must use single quotes (') not double quotes (")
- Template literals (\`) should only be used for interpolation or multi-line strings
- Ensure quotes are properly closed
- Escape quotes within strings if needed

⚠️ **Commas**:
- Check for trailing commas in objects/arrays (allowed in ES6+)
- Check for missing commas between object properties or array elements
- No comma after last parameter in function definitions (syntax error in older parsers)

⚠️ **Arrow Functions**:
- Ensure arrow function syntax is correct: () => {} or (param) => {}
- Return statements in arrow functions must be valid
- Implicit returns must not have braces

⚠️ **Template Literals**:
- Ensure \${} expressions are properly closed
- Multi-line template literals must preserve formatting
- Check for unescaped backticks

⚠️ **Keywords & Reserved Words**:
- Don't use reserved words as variable names
- Ensure const/let/var are used correctly
- Check async/await syntax is valid

⚠️ **Function Syntax**:
- Function parameters must be properly formatted
- Default parameters syntax must be valid
- Rest/spread operators (...) must be used correctly

## SYNTAX VALIDATION PROCESS

1. **First Pass**: Scan for syntax errors that would prevent parsing
2. **Fix Errors**: Correct all syntax issues (brackets, quotes, semicolons, operators)
3. **Second Pass**: Apply coding rules only after syntax is valid
4. **Final Check**: Ensure output is parseable by Babel/ESLint

## RULES TO APPLY

These are the ONLY rules you should apply AFTER ensuring syntax is valid. Each rule has an ID for reference:

${JSON.stringify(rules, null, 2)}

## INPUT CODE

\`\`\`javascript
${staticallyFixedCode}
\`\`\`

## CRITICAL REMINDERS

1. **Syntax First**: FIX ALL SYNTAX ERRORS before applying any rules
2. **Template Literals**: Any multi-line HTML/CSS in template literals must keep exact formatting
3. **Existing Structure**: Keep the same number of functions, same organization
4. **Minimal Changes**: Make the smallest possible changes to satisfy rules
5. **No Refactoring**: This is NOT a refactoring task - only fix syntax and apply listed rules
6. **Parseable Output**: The output MUST be parseable by Babel without ANY syntax errors

## OUTPUT FORMAT

Return ONLY the corrected JavaScript code. No explanations, no markdown formatting, no \`\`\`javascript blocks.
Just the raw, executable code that can be directly parsed.

**MANDATORY**: The code MUST be 100% syntactically valid and parseable by Babel/ESLint.
Any syntax error in the output is considered a failure.

CORRECTED CODE:`;


const processAIResponse = (responseText) => {
    const codeBlockRegex = /```(?:javascript|js)?\s*([\s\S]*?)\s*```/;
    const match = responseText.match(codeBlockRegex);
    return match ? match[1].trim() : responseText.trim();
};

const getAIFixedCode = async (originalCode, selectedModel) => {
    const configuration = vscode.workspace.getConfiguration('godtiercodereviewer');
    const apiKey = configuration.get('apiKey');

    if (!apiKey) {
        vscode.window.showErrorMessage('Google GenAI API Key not found. Please enter it in settings.');
        return null;
    }

    const staticallyFixedCode = await fixCode(originalCode);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: selectedModel });
    const prompt = generateAIPrompt(staticallyFixedCode);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const AIFixedCode = processAIResponse(response.text());

    return fixCode(AIFixedCode);
};

const getStaticFixedCode = async (originalCode) => fixCode(originalCode);

const getFinalCode = async (choice, originalCode, selectedModel) => {
    if (choice.detail === 'ai') {
        return vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `GodTierCodeReviewer (${selectedModel}) is analyzing your code...`,
                cancellable: false
            },
            async () => {
                try {
                    return await getAIFixedCode(originalCode, selectedModel);
                } catch (error) {
                    console.error('Google GenAI Error:', error);
                    vscode.window.showErrorMessage('An error occurred while getting AI response. Check the OUTPUT console for details.');
                    return null;
                }
            }
        );
    }

    if (choice.detail === 'static') {
        return vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Applying static code fixes...',
                cancellable: false
            },
            async () => {
                try {
                    return await getStaticFixedCode(originalCode);
                } catch (error) {
                    console.error('Static Fix Error:', error);
                    vscode.window.showErrorMessage('An error occurred during static fix.');
                    return null;
                }
            }
        );
    }

    return null;
};

const createWebviewPanel = (context, originalCode, finalCode, editor, range) => {
    if (state.currentWebviewPanel) {
        state.currentWebviewPanel.dispose();
    }

    state.currentWebviewPanel = vscode.window.createWebviewPanel(
        'godtierAIReview',
        'GodTierCodeReviewer AI Review',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

    state.currentAIFixData = {
        editor,
        range,
        originalCode,
        fixedCode: finalCode
    };

    state.currentWebviewPanel.webview.html = getWebviewContent(originalCode, finalCode);

    state.currentWebviewPanel.webview.onDidReceiveMessage(
        (message) => {
            if (message.command === 'applyFix') {
                applyAIFix();
            } else if (message.command === 'rejectFix') {
                rejectAIFix();
            }
        },
        undefined,
        context.subscriptions
    );

    state.currentWebviewPanel.onDidDispose(() => {
        state.currentWebviewPanel = null;
        state.currentAIFixData = null;
    });
};

const createDiagnosticRange = (editor, selectionStartLine, hunk) => {
    const relativeStartLine = hunk.oldStart - 1;
    const relativeEndLine = hunk.oldStart + hunk.oldLines - 2;
    const docStartLine = selectionStartLine + relativeStartLine;
    const docEndLine = selectionStartLine + relativeEndLine;

    if (hunk.oldLines > 0) {
        const endLineText = editor.document.lineAt(docEndLine).text;
        return new vscode.Range(
            new vscode.Position(docStartLine, 0),
            new vscode.Position(docEndLine, endLineText.length)
        );
    }

    const insertLine = selectionStartLine + (hunk.newStart - 1);
    const targetLine = Math.max(0, insertLine - 1);
    const lineText = editor.document.lineAt(targetLine).text;
    return new vscode.Range(
        new vscode.Position(targetLine, 0),
        new vscode.Position(targetLine, lineText.length)
    );
};

const createDiagnostic = (editor, range, newText, oldText) => {
    const diagnostic = new vscode.Diagnostic(
        range,
        'GodTierCodeReviewer: Right-click for suggestion or use shortcuts (Alt+A/R/D).',
        vscode.DiagnosticSeverity.Warning
    );

    diagnostic.source = GODTIER_SOURCE;
    diagnostic.code = {
        value: 'applyFix',
        fix: newText,
        original: oldText
    };

    return diagnostic;
};

const processDiagnostics = (editor, originalCode, finalCode, range) => {
    const patch = diff.structuredPatch('original.js', 'fixed.js', originalCode, finalCode, '', '', {
        context: 0
    });

    const diagnostics = [];
    const selectionStartLine = range.start.line;

    for (const hunk of patch.hunks) {
        const newText = hunk.lines
            .filter((line) => !line.startsWith('-'))
            .map((line) => line.substring(1))
            .join('\n');

        const diagnosticRange = createDiagnosticRange(editor, selectionStartLine, hunk);
        const oldText = editor.document.getText(diagnosticRange);
        const diagnostic = createDiagnostic(editor, diagnosticRange, newText, oldText);

        diagnostics.push(diagnostic);
    }

    if (diagnostics.length > 0) {
        state.diagnosticCollection.set(editor.document.uri, diagnostics);
        updateDecorations(editor);
        vscode.commands.executeCommand('editor.action.marker.nextInFiles');
        updateSuggestionContext();

        const message = `${diagnostics.length} code suggestion(s) found. Right-click on underlined areas or use keyboard shortcuts to view suggestions.`;
        const actionTitle = 'Go to First Suggestion';

        vscode.window.showInformationMessage(message, actionTitle).then((selection) => {
            if (selection === actionTitle) {
                vscode.commands.executeCommand('editor.action.marker.nextInFiles');
            }
        });
    } else {
        vscode.window.showInformationMessage('No changes to apply were found after diff analysis.');
    }
};

const registerApplyFromCodeLens = (context) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND_IDS.APPLY_FROM_LENS, async (args) => {
            const uri = vscode.Uri.parse(args.uri);
            const range = new vscode.Range(args.range[0], args.range[1], args.range[2], args.range[3]);
            const { newText } = args;

            const edit = new vscode.WorkspaceEdit();
            edit.replace(uri, range, newText);
            await vscode.workspace.applyEdit(edit);

            await removeDiagnostic(uri, range);
            vscode.window.showInformationMessage('GodTierCodeReviewer: Suggestion applied!');

            // Run ESLint autofix after applying suggestion
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.uri.toString() === uri.toString()) {
                await runESLintAutoFix(editor.document);
            }
        })
    );
};

const registerRejectFromCodeLens = (context) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND_IDS.REJECT_FROM_LENS, async (args) => {
            const uri = vscode.Uri.parse(args.uri);
            const range = new vscode.Range(args.range[0], args.range[1], args.range[2], args.range[3]);
            await removeDiagnostic(uri, range);
        })
    );
};

const registerShowDiffFromCodeLens = (context) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND_IDS.SHOW_DIFF_FROM_LENS, async (args) => {
            const { oldText, newText } = args;
            const range = new vscode.Range(args.range[0], args.range[1], args.range[2], args.range[3]);
            await showDiff(oldText, newText, range);
        })
    );
};

const registerApplySuggestionAtCursor = (context) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND_IDS.APPLY_AT_CURSOR, async () => {
            const editor = vscode.window.activeTextEditor;
            const diagnostic = getActiveDiagnostic(editor);

            if (!diagnostic) {
                vscode.window.showWarningMessage('GodTierCodeReviewer: Your cursor is not on a suggestion.');
                return;
            }

            const newText = diagnostic.code.fix;
            const { range } = diagnostic;
            const { uri } = editor.document;

            const edit = new vscode.WorkspaceEdit();
            edit.replace(uri, range, newText);
            await vscode.workspace.applyEdit(edit);

            await removeDiagnostic(uri, range);
            vscode.window.showInformationMessage('GodTierCodeReviewer: Suggestion applied!');

            // Run ESLint autofix after applying suggestion
            await runESLintAutoFix(editor.document);
        })
    );
};

const registerRejectSuggestionAtCursor = (context) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND_IDS.REJECT_AT_CURSOR, async () => {
            const editor = vscode.window.activeTextEditor;
            const diagnostic = getActiveDiagnostic(editor);

            if (!diagnostic) {
                vscode.window.showWarningMessage('GodTierCodeReviewer: Your cursor is not on a suggestion.');
                return;
            }

            await removeDiagnostic(editor.document.uri, diagnostic.range);
        })
    );
};

const registerShowDiffAtCursor = (context) => {
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND_IDS.SHOW_DIFF_AT_CURSOR, async () => {
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
};

const registerStartCommand = (context) => {
    const disposable = vscode.commands.registerCommand(COMMAND_IDS.START, async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        state.diagnosticCollection.clear();
        editor.setDecorations(state.suggestionDecorationType, []);

        if (state.currentSuggestionContext) {
            vscode.commands.executeCommand('setContext', 'godtier.isActiveSuggestion', false);
            state.currentSuggestionContext = false;
        }

        const { code: originalCode, range } = getCodeRange(editor);

        if (!originalCode.trim()) {
            vscode.window.showErrorMessage('No code selected or document is empty!');
            return;
        }

        const choice = await vscode.window.showQuickPick(FIX_TYPES, {
            placeHolder: 'Please select a fix type:',
            title: 'GodTierCodeReviewer'
        });

        if (!choice) {
            return;
        }

        let selectedModel = 'gemini-2.5-pro';

        if (choice.detail === 'ai') {
            const model = await selectModel();
            if (!model) {
                return;
            }
            selectedModel = model;
        }

        const finalCode = await getFinalCode(choice, originalCode, selectedModel);

        if (!finalCode || !finalCode.trim() || originalCode === finalCode) {
            vscode.window.showInformationMessage('No changes to apply were found in the code.');
            return;
        }

        if (choice.detail === 'ai') {
            createWebviewPanel(context, originalCode, finalCode, editor, range);
            return;
        }

        processDiagnostics(editor, originalCode, finalCode, range);
    });

    context.subscriptions.push(disposable);
};

const activate = (context) => {
    state.diagnosticCollection = vscode.languages.createDiagnosticCollection(GODTIER_SOURCE);
    context.subscriptions.push(state.diagnosticCollection);

    state.suggestionDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
        isWholeLine: false
    });
    context.subscriptions.push(state.suggestionDecorationType);

    const codeLensProvider = new GodTierCodeLensProvider(state.diagnosticCollection);
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
            codeLensProvider
        )
    );

    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateSuggestionContext));
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((e) => {
            updateSuggestionContext();
            if (e) {
                updateDecorations(e);
            }
        })
    );

    registerApplyFromCodeLens(context);
    registerRejectFromCodeLens(context);
    registerShowDiffFromCodeLens(context);
    registerApplySuggestionAtCursor(context);
    registerRejectSuggestionAtCursor(context);
    registerShowDiffAtCursor(context);
    registerStartCommand(context);

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 900);
    statusBarItem.command = COMMAND_IDS.START;
    statusBarItem.text = '$(tools) Review Code';
    statusBarItem.tooltip = 'Run GodTierCodeReviewer';
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);
};

const deactivate = () => {
    if (state.diagnosticCollection) {
        state.diagnosticCollection.dispose();
    }
};

module.exports = {
    activate,
    deactivate
};
