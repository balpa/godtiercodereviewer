const vscode = require('vscode');

class GodTierCodeLensProvider {
    constructor(diagnosticCollection) {
        this.diagnosticCollection = diagnosticCollection;
    }

    provideCodeLenses(document, token) {
        const lenses = [];
        const diagnostics = this.diagnosticCollection.get(document.uri);

        if (!diagnostics) {
            return [];
        }

        for (const diagnostic of diagnostics) {
            if (diagnostic.source !== 'godtier') {
                continue;
            }

            const range = diagnostic.range;

            const args = {
                uri: document.uri.toString(),
                range: [
                    range.start.line, range.start.character,
                    range.end.line, range.end.character
                ],
                newText: diagnostic.code.fix,
                oldText: diagnostic.code.original
            };

            const codeLensRange = new vscode.Range(range.start.line, 0, range.start.line, 0);

            const applyCommand = {
                title: '✅ Uygula',
                tooltip: 'Önerilen değişikliği uygula',
                command: 'godtier.applyFromCodeLens',
                arguments: [args]
            };
            lenses.push(new vscode.CodeLens(codeLensRange, applyCommand));

            const diffCommand = {
                title: '👀 Farkı Gör',
                tooltip: 'Değişiklikleri yan panelde gör',
                command: 'godtier.showDiffFromCodeLens',
                arguments: [args]
            };
            lenses.push(new vscode.CodeLens(codeLensRange, diffCommand));

            const rejectCommand = {
                title: '❌ Reddet',
                tooltip: 'Bu öneriyi kapat',
                command: 'godtier.rejectFromCodeLens',
                arguments: [args]
            };
            lenses.push(new vscode.CodeLens(codeLensRange, rejectCommand));
        }

        return lenses;
    }
}

module.exports = { GodTierCodeLensProvider };