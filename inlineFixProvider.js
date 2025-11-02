const vscode = require('vscode');
const { diffLines } = require('diff');

class InlineFixProvider {
    constructor() {
        this._disposables = [];
        this._suggestions = new Map();
    }

    provideInlayHints(document, range, token) {
        const suggestions = this._suggestions.get(document.uri.toString()) || [];
        const inlayHints = [];

        for (const s of suggestions) {
            if (s.line >= range.start.line && s.line <= range.end.line) {
                const hint = new vscode.InlayHint(
                    s.line,
                    s.text,
                    vscode.InlayHintKind.Other
                );
                hint.paddingLeft = true;
                hint.command = {
                    title: 'Apply/Reject',
                    command: 'godtiercodereviewer.applySuggestion',
                    arguments: [document.uri, s.line, s.newText],
                };
                inlayHints.push(hint);
            }
        }

        return inlayHints;
    }

    setSuggestions(uri, originalCode, finalCode) {
        const changes = diffLines(originalCode, finalCode);
        const suggestions = [];
        let line = 0;

        for (const part of changes) {
            const lines = part.value.split('\n');
            if (part.added) {
                for (let i = 0; i < lines.length; i++) {
                    suggestions.push({
                        line,
                        text: `💡 Önerilen değişiklik: ${lines[i]}`,
                        newText: lines[i],
                    });
                    line++;
                }
            } else if (part.removed) {
                line += lines.length;
            } else {
                line += lines.length;
            }
        }

        this._suggestions.set(uri.toString(), suggestions);
    }

    clearSuggestions(uri) {
        this._suggestions.delete(uri.toString());
    }

    dispose() {
        this._disposables.forEach(d => d.dispose());
    }
}

module.exports = { InlineFixProvider };
