const vscode = require('vscode');

/**
 * Kullanıcıya "Hızlı Düzeltme" (ampul ikonu) seçeneklerini sunar.
 */
class GodTierCodeActionProvider {

    /**
     * @param {vscode.TextDocument} document
     * @param {vscode.Range} range
     * @param {vscode.CodeActionContext} context
     * @param {vscode.CancellationToken} token
     * @returns {vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]>}
     */
    provideCodeActions(document, range, context, token) {
        const actions = [];

        for (const diagnostic of context.diagnostics) {
            // Sadece bizim "godtier" teşhislerimize tepki ver
            if (diagnostic.source !== 'godtier' || !diagnostic.code || !diagnostic.code.fix) {
                continue;
            }
                
            const newText = diagnostic.code.fix;
            const oldText = diagnostic.code.original; // Orijinal metni teşhisten al
                
            // 1. "Uygula" Aksiyonu
            const applyAction = new vscode.CodeAction('✅ Öneriyi Uygula (God Tier)', vscode.CodeActionKind.QuickFix);
            applyAction.diagnostics = [diagnostic];
            applyAction.isPreferred = true; // Bunu varsayılan (en üstteki) seçenek yap
            applyAction.edit = new vscode.WorkspaceEdit();
            applyAction.edit.replace(document.uri, diagnostic.range, newText);
            
            // 2. "Farkı Göster" Aksiyonu (YENİ)
            const diffAction = new vscode.CodeAction('👀 Değişiklikleri Gör', vscode.CodeActionKind.Empty);
            diffAction.diagnostics = [diagnostic];
            diffAction.command = {
                command: 'godtiercodereviewer.showDiff',
                title: 'Değişiklikleri Gör',
                arguments: [oldText, newText, diagnostic.range.start.line] // Komuta eski ve yeni metni gönder
            };

            // 3. "Reddet" Aksiyonu
            const rejectAction = new vscode.CodeAction('❌ Öneriyi Reddet', vscode.CodeActionKind.QuickFix);
            rejectAction.diagnostics = [diagnostic];
            rejectAction.command = {
                command: 'godtiercodereviewer.rejectSuggestion',
                title: 'Öneriyi Reddet',
                arguments: [document.uri, diagnostic] // Komuta URI ve teşhisi gönder
            };

            actions.push(applyAction, diffAction, rejectAction);
        }
        return actions;
    }
}

module.exports = { GodTierCodeActionProvider };