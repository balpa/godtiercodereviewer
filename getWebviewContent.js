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
            if (added) prefix = ' ';
            if (removed) prefix = ' ';
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
                    .action-buttons {
                        display: flex;
                        gap: 15px;
                        margin-bottom: 30px;
                        padding: 20px;
                        background-color: #1e1e1e;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    }
                    .action-buttons button {
                        flex: 1;
                        padding: 20px 30px;
                        font-size: 20px;
                        font-weight: bold;
                        cursor: pointer;
                        border: none;
                        border-radius: 8px;
                        transition: all 0.3s ease;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    #apply-all-btn {
                        background: linear-gradient(135deg, #4CAF50, #45a049);
                        color: white;
                    }
                    #apply-all-btn:hover {
                        background: linear-gradient(135deg, #45a049, #3d8b40);
                        transform: translateY(-2px);
                        box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
                    }
                    #reset-btn {
                        background: linear-gradient(135deg, #f44336, #da190b);
                        color: white;
                    }
                    #reset-btn:hover {
                        background: linear-gradient(135deg, #da190b, #c41700);
                        transform: translateY(-2px);
                        box-shadow: 0 6px 12px rgba(244, 67, 54, 0.4);
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
                <div class="action-buttons">
                    <button id="apply-all-btn">✓ Tümünü Uygula</button>
                    <button id="reset-btn">↻ Resetle</button>
                </div>
                <div class="legend">
                    <div class="legend-item"><div class="color-box removed"></div><span>Removed Lines</span></div>
                    <div class="legend-item"><div class="color-box added"></div><span>Added Lines</span></div>
                </div>
                <div class="container">${ diffHtml }</div>
                <button id="apply-btn">Apply Changes</button>
                <button id="reject-btn">Reject Changes</button>
                <script>
                    const vscode = acquireVsCodeApi();
                    document.getElementById('apply-all-btn').addEventListener('click', () => {
                        vscode.postMessage({
                            command: 'applyFix'
                        });
                    });
                    document.getElementById('reset-btn').addEventListener('click', () => {
                        vscode.postMessage({
                            command: 'rejectFix'
                        });
                    });
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