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
    const title = `God Tier Önerisi (Satır ${line})`;

    const tabToClose = vscode.window.tabGroups.all
        .flatMap(group => group.tabs)
        .find(tab => tab.label === title);

    if (tabToClose) {
        try {
            await vscode.window.tabGroups.close(tabToClose);
        } catch (e) {
            console.error("Diff sekmesi kapatılırken hata:", e);
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
        const oldFileName = `godtier.eski.L${originalLine}.js`;
        const newFileName = `godtier.yeni.L${originalLine}.js`;

        const oldFileUri = vscode.Uri.file(path.join(tempDir, oldFileName));
        const newFileUri = vscode.Uri.file(path.join(tempDir, newFileName));

        fs.writeFileSync(oldFileUri.fsPath, oldText);
        fs.writeFileSync(newFileUri.fsPath, newText);

        const title = `God Tier Önerisi (Satır ${originalLine})`;
        await vscode.commands.executeCommand('vscode.diff', oldFileUri, newFileUri, title, {
            preview: false,
            viewColumn: vscode.ViewColumn.Beside
        });

    } catch (e) {
        console.error("Diff Error:", e);
        vscode.window.showErrorMessage('Fark görünümü açılırken bir hata oluştu.');
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
        vscode.window.showErrorMessage('Uygulanacak düzeltme bulunamadı.');
        return;
    }

    const { editor, range, fixedCode } = currentAIFixData;
    
    try {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(editor.document.uri, range, fixedCode);
        await vscode.workspace.applyEdit(edit);
        
        vscode.window.showInformationMessage('God Tier AI: Değişiklikler başarıyla uygulandı!');
        
        if (currentWebviewPanel) {
            currentWebviewPanel.dispose();
        }
    } catch (error) {
        vscode.window.showErrorMessage('Değişiklikler uygulanırken bir hata oluştu.');
        console.error('Apply fix error:', error);
    }
}

async function rejectAIFix() {
    if (currentWebviewPanel) {
        currentWebviewPanel.dispose();
    }
    vscode.window.showInformationMessage('God Tier AI: Değişiklikler reddedildi.');
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
            vscode.window.showInformationMessage('God Tier: Öneri uygulandı!');
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
                vscode.window.showWarningMessage('God Tier: İmleciniz bir önerinin üzerinde değil.');
                return;
            }

            const newText = diagnostic.code.fix;
            const range = diagnostic.range;
            const uri = editor.document.uri;

            const edit = new vscode.WorkspaceEdit();
            edit.replace(uri, range, newText);
            await vscode.workspace.applyEdit(edit);

            await removeDiagnostic(uri, range);
            vscode.window.showInformationMessage('God Tier: Öneri uygulandı!');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('godtiercodereviewer.rejectSuggestionAtCursor', async () => {
            const editor = vscode.window.activeTextEditor;
            const diagnostic = getActiveDiagnostic(editor);

            if (!diagnostic) {
                vscode.window.showWarningMessage('God Tier: İmleciniz bir önerinin üzerinde değil.');
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
                vscode.window.showWarningMessage('God Tier: İmleciniz bir önerinin üzerinde değil.');
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
                { label: '$(sparkle) AI Destekli Düzeltme', description: 'Kodu Gemini AI ve statik kurallarla birlikte analiz eder.', detail: 'ai' },
                { label: '$(check) Statik Düzeltme', description: 'Kodu sadece statik kurallarla hızlıca düzeltir.', detail: 'static' }
            ],
            {
                placeHolder: 'Lütfen bir düzeltme türü seçin:',
                title: 'God Tier Code Reviewer'
            }
        );

        if (!choice) {
            return;
        }

        const getFinalCode = async () => {
            if (choice.detail === 'ai') {
                return await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "God Tier Reviewer (AI) kodunuzu analiz ediyor...",
                    cancellable: false
                }, async () => {
                    try {
                        const configuration = vscode.workspace.getConfiguration('godtiercodereviewer');
                        const apiKey = configuration.get('apiKey');

                        if (!apiKey) {
                            vscode.window.showErrorMessage('Google GenAI API Key bulunamadı. Lütfen ayarlardan girin.');
                            return null;
                        }

                        const staticallyFixedCode = await fixCode(originalCode);
                        const genAI = new GoogleGenerativeAI(apiKey);
                        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

                        const prompt = `
                        Rol: Sen, sağlanan kod standartlarını uygulayan uzman bir yazılım geliştiricisisin.
                        Görev: Sana verilen JavaScript kodunu, [KURALLAR] bölümündeki JSON listesine göre analiz et. Koddaki tüm kural ihlallerini düzelterek kodu yeniden yaz. Kodda var olan değişkenlerde gereksiz değişiklik yapma. [KURALLAR] bölümündeki JSON listesindekileri kesinlikle uygula.
                        **ÖNEMLİ KURAL: Template literal içinde bulunan çok satırlı HTML ve CSS kod bloklarının formatı (boşluklar, girintiler ve satır sonları) okunabilirlik için kasıtlı olarak o şekilde yazılmıştır. Bu blokların iç yapısını KESİNLİKLE DEĞİŞTİRME, birebir koru.**
                        [KURALLAR]
                        ${JSON.stringify(rules)}
                        [ORİJİNAL KOD]
                        ${staticallyFixedCode}
                        [ÇIKTI FORMATI]
                        Yanıtın SADECE ve SADECE düzeltilmiş ham JavaScript kodunun kendisi OLMALIDIR. Başka hiçbir metin, açıklama, "İşte düzeltilmiş kod:" gibi giriş cümleleri veya \`\`\`javascript gibi markdown formatı ekleme. Kodun syntax olarak sorunsuz olmasına ekstra dikkat et. Tüm köşeli parantezler düzgün şekilde kapanmalıdır. Babel ile syntax düzeltip SADECE kodu çıktı olarak ver.`;

                        const result = await model.generateContent(prompt);
                        const response = result.response;
                        let AIFixedCode = response.text();

                        const codeBlockRegex = /```(?:javascript|js)?\s*([\s\S]*?)\s*```/;
                        const match = AIFixedCode.match(codeBlockRegex);

                        AIFixedCode = match ? match[1].trim() : AIFixedCode.trim();

                        return await fixCode(AIFixedCode);

                    } catch (error) {
                        console.error("Google GenAI Error:", error);
                        vscode.window.showErrorMessage('AI yanıtı alınırken bir hata oluştu. Detaylar için OUTPUT konsoluna bakın.');
                        return null;
                    }
                });
            } else if (choice.detail === 'static') {
                return await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Statik kod düzeltmeleri uygulanıyor...",
                    cancellable: false
                }, async () => {
                    try {
                        return await fixCode(originalCode);
                    } catch (error) {
                        console.error("Static Fix Error:", error);
                        vscode.window.showErrorMessage('Statik düzeltme sırasında bir hata oluştu.');
                        return null;
                    }
                });
            }
        };

        const finalCode = await getFinalCode();

        if (!finalCode || !finalCode.trim() || originalCode === finalCode) {
            vscode.window.showInformationMessage("Koda uygulanacak bir değişiklik bulunamadı.");
            return;
        }

        // AI mode için webview göster
        if (choice.detail === 'ai') {
            if (currentWebviewPanel) {
                currentWebviewPanel.dispose();
            }

            currentWebviewPanel = vscode.window.createWebviewPanel(
                'godtierAIReview',
                'God Tier AI Review',
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

        // ========================================
        // Static mode: Satır bazlı öneriler ve CodeLens
        // ========================================

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
                'God Tier: Öneri için sağ tıkla veya kısayol kullan (Alt+A/R/D).', 
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

            const message = `${diagnostics.length} adet kod önerisi bulundu. Önerileri görmek için altı çizili alanlara sağ tıklayın veya klavye kısayollarını kullanın.`;
            const actionTitle = 'İlk Öneriye Git';

            vscode.window.showInformationMessage(message, actionTitle).then(selection => {
                if (selection === actionTitle) {
                    vscode.commands.executeCommand('editor.action.marker.nextInFiles');
                }
            });

        } else {
            vscode.window.showInformationMessage("Fark analizi sonucunda uygulanacak değişiklik bulunamadı.");
        }
    });

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 900);
    statusBarItem.command = commandId;
    statusBarItem.text = '$(tools) Review Code';
    statusBarItem.tooltip = 'Run God Tier Code Reviewer';
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