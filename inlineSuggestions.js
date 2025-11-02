const vscode = require('vscode');
const { diffLines } = require('diff');

let activeDecorations = [];

async function showInlineSuggestions(editor, originalCode, finalCode) {
    clearAllDecorations(editor);

    const changes = diffLines(originalCode, finalCode);
    const addedDecorationType = vscode.window.createTextEditorDecorationType({
        after: {
            margin: '1rem 0 0 2rem',
            textDecoration: 'none'
        },
        isWholeLine: true
    });

    const decorations = [];

    let currentLine = 0;

    for (const part of changes) {
        const lines = part.value.split('\n').filter(Boolean);

        if (part.added) {
            const position = new vscode.Position(Math.max(0, currentLine - 1), 0);
            const html = createSuggestionHTML(lines.join('\n'), currentLine);

            decorations.push({
                range: new vscode.Range(position, position),
                renderOptions: {
                    after: {
                        contentText: '',
                        contentIconPath: vscode.Uri.file(htmlTempFile(html))
                    }
                }
            });
        } else if (!part.removed) {
            currentLine += lines.length;
        }
    }

    editor.setDecorations(addedDecorationType, decorations);
    activeDecorations.push(addedDecorationType);
}

function htmlTempFile(html) {
    const fs = require('fs');
    const path = require('path');
    const tmpFile = path.join(__dirname, 'suggestion.svg');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="60">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" 
             style="font-family: sans-serif; background: #1e1e1e; color: #ccc; 
             border-radius: 6px; padding: 8px; font-size: 13px;">
          ${html}
        </div>
      </foreignObject>
    </svg>`;
    fs.writeFileSync(tmpFile, svg);
    return tmpFile;
}

function createSuggestionHTML(suggestedText, lineNumber) {
    const escaped = suggestedText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    return `
        <div>
            <div style="margin-bottom: 4px;">
                💡 <b>Önerilen değişiklik:</b>
            </div>
            <pre style="background: #252526; color: #dcdcaa; padding: 6px; border-radius: 4px; overflow-x: auto;">
                ${escaped}
            </pre>
            <button onclick="vscode.postMessage({ command: 'apply', line: ${lineNumber} })"
                    style="background: #0E639C; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer;">
                Apply
            </button>
            <button onclick="vscode.postMessage({ command: 'reject', line: ${lineNumber} })"
                    style="background: #555; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer;">
                Reject
            </button>
        </div>`;
}

function clearAllDecorations(editor) {
    for (const deco of activeDecorations) {
        editor.setDecorations(deco, []);
    }
    activeDecorations = [];
}

module.exports = { showInlineSuggestions, clearAllDecorations };
