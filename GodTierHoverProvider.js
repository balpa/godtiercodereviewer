const vscode = require('vscode');

class GodTierHoverProvider {
    /**
     * @param {vscode.DiagnosticCollection} diagnosticCollection
     */
    constructor(diagnosticCollection) {
        this.diagnosticCollection = diagnosticCollection;
    }

    /**
     * @param {vscode.TextDocument} document
     * @param {vscode.Position} position
     * @param {vscode.CancellationToken} token
     * @returns {vscode.ProviderResult<vscode.Hover>}
     */
    provideHover(document, position, token) {
        const diagnostics = this.diagnosticCollection.get(document.uri);
        if (!diagnostics || diagnostics.length === 0) {
            return null;
        }

        const diagnostic = diagnostics.find(d => {
            const isGodtier = d.source === 'godtier';
            const inRange = d.range.contains(position);
            
            return isGodtier && inRange;
        });

        if (!diagnostic) {
            return null;
        }

        if (!diagnostic.code || !diagnostic.code.fix) {
            return null;
        }

        const originalText = document.getText(diagnostic.range);
        const newText = diagnostic.code.fix;
        const uri = document.uri;
        const rangeAsArray = [
            diagnostic.range.start.line,
            diagnostic.range.start.character,
            diagnostic.range.end.line,
            diagnostic.range.end.character
        ];

        const applyArgs = encodeURIComponent(JSON.stringify({
            uri: uri.toString(),
            range: rangeAsArray,
            newText: newText
        }));

        const rejectArgs = encodeURIComponent(JSON.stringify({
            uri: uri.toString(),
            range: rangeAsArray
        }));

        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true; 
        markdown.supportThemeIcons = true; 

        markdown.appendMarkdown(`### God Tier Önerisi\n`);
        markdown.appendMarkdown(`---\n`);
        markdown.appendMarkdown(`**Eski Kod:**\n`);
        markdown.appendCodeblock(originalText, 'javascript');
        markdown.appendMarkdown(`**Yeni Kod:**\n`);
        markdown.appendCodeblock(newText, 'javascript');
        markdown.appendMarkdown(`---\n\n`);

        markdown.appendMarkdown(
            `[$(check) Öneriyi Uygula](command:godtiercodereviewer.applyFixFromHover?${applyArgs})` +
            `&nbsp;&nbsp;&nbsp;&nbsp;` + 
            `[$(close) Öneriyi Reddet](command:godtiercodereviewer.rejectSuggestionFromHover?${rejectArgs})`
        );

        return new vscode.Hover(markdown);
    }
}

module.exports = { GodTierHoverProvider };