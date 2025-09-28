const vscode = require('vscode');
const diff = require('diff');

function getWebviewContent(originalCode, fixedCode) {
    const differences = diff.diffLines(originalCode, fixedCode);

    const diffHtml = differences.map((part) => {
        const { added, removed, value } = part;

        const color = added ? 'rgba(0, 255, 0, 0.2)' :
            removed ? 'rgba(255, 0, 0, 0.2)' : 'transparent';

        const escapedValue = escapeHtml(value);

        const lines = escapedValue.split('\n').filter(line => line.length > 0).map(line => {
            let prefix = '&nbsp;&nbsp;';
            if (added) prefix = '+ ';
            if (removed) prefix = '- ';
            return `<span>${ prefix }${ line }</span>`;
        }).join('<br>');


        return `<pre style="background-color: ${color}; margin: 0; padding: 5px 10px; white-space: pre-wrap; font-family: 'Courier New', Courier, monospace;">${lines}</pre>`;
    }).join('');

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Code Review Result</title>
                <style>
                    body {
                        padding: 20px;
                        font-family: sans-serif;
                    }
                    .container {
                        border: 1px solid #333;
                        border-radius: 5px;
                        overflow: hidden;
                    }
                    h3 {
                        margin-top: 0;
                        padding: 10px;
                        background-color: #222;
                        color: white;
                    }
                    button {
                        margin-top: 20px;
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        border: none;
                        border-radius: 5px;
                        background-color: #0e639c;
                        color: white;
                    }
                    button:hover {
                        background-color: #1177bb;
                    }
                    .legend {
                        margin-bottom: 15px;
                    }
                    .legend-item {
                        display: inline-flex;
                        align-items: center;
                        margin-right: 20px;
                    }
                    .color-box {
                        width: 15px;
                        height: 15px;
                        margin-right: 8px;
                        border: 1px solid #555;
                    }
                    #reject-btn {
                        background-color: rgba(255, 0, 0, 0.2)
                    } 
                    .added { background-color: rgba(0, 255, 0, 0.2); }
                    .removed { background-color: rgba(255, 0, 0, 0.2); }
                </style>
            </head>
            <body>
                <h1>God Tier Code Reviewer</h1>
                <div class="legend">
                    <div class="legend-item"><div class="color-box removed"></div><span>Removed Lines</span></div>
                    <div class="legend-item"><div class="color-box added"></div><span>Added Lines</span></div>
                </div>
                <div class="container">${ diffHtml }</div>
                <button id="apply-btn">Apply Changes</button>
                <button id="reject-btn">Reject Changes</button>
                <script>
                    const vscode = acquireVsCodeApi();
                    document.getElementById('apply-btn').addEventListener('click', () => {
                        vscode.postMessage({
                            command: 'applyFix'
                        });
                    });
                    document.getElementById('reject-btn').addEventListener('click', () => {
                        vscode.postMessage({
                            command: 'rejectFix'
                        });
                    });
                </script>
            </body>
        </html>
    `;
}

module.exports = { getWebviewContent };