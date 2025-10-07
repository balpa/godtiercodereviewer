const vscode = require('vscode');
require('dotenv').config();
const { fixCode } = require('./fixer');
const { getWebviewContent } = require('./getWebviewContent');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const rules = require('./rules.js');

async function showReviewPanel(originalCode, finalCode, range, editor, context) {
    if (!finalCode || !finalCode.trim() || originalCode === finalCode) {
        vscode.window.showInformationMessage("Koda uygulanacak bir değişiklik bulunamadı.");
        return;
    }

    const panel = vscode.window.createWebviewPanel(
        'godtierCodeReview',
        'Code Review Result',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

    panel.webview.html = getWebviewContent(originalCode, finalCode);

    panel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case 'applyFix':
                    await editor.edit(editBuilder => {
                        editBuilder.replace(range, finalCode);
                    });
                    vscode.window.showInformationMessage('Kod düzeltmeleri uygulandı!');

                    panel.dispose();

                    return;
                case 'rejectFix':
                    panel.dispose();

                    return;
            }
        },
        undefined,
        context.subscriptions
    );
}


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

        if (choice.detail === 'ai') {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "God Tier Reviewer (AI) kodunuzu analiz ediyor...",
                cancellable: false
            }, async () => {
                try {
                    const configuration = vscode.workspace.getConfiguration('godtiercodereviewer');
                    const apiKey = configuration.get('apiKey');

                    if (!apiKey) {
                        vscode.window.showErrorMessage('Google GenAI API Key bulunamadı. Lütfen ayarlardan girin.');

                        return;
                    }
                    
                    const staticallyFixedCode = await fixCode(code);

                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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

                    const finalCode = await fixCode(AIFixedCode);

                    await showReviewPanel(code, finalCode, range, editor, context);

                } catch (error) {
                    console.error("Google GenAI Error:", error);
                    vscode.window.showErrorMessage('AI yanıtı alınırken bir hata oluştu. Detaylar için OUTPUT konsoluna bakın.');
                }
            });
        } else if (choice.detail === 'static') {
             vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Statik kod düzeltmeleri uygulanıyor...",
                cancellable: false
            }, async (progress) => {
                try {
                    const finalCode = await fixCode(code);

                    progress.report({ increment: 100 });

                    await showReviewPanel(code, finalCode, range, editor, context);
                } catch (error) {
                    console.error("Static Fix Error:", error);

                    vscode.window.showErrorMessage('Statik düzeltme sırasında bir hata oluştu.');
                }
            });
        }
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