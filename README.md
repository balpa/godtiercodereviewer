# God Tier Code Reviewer

A powerful VS Code extension that automatically reviews and fixes JavaScript/TypeScript code using both static rules and AI-powered analysis.

## Features

### 🤖 Dual Fix Modes

- **AI-Assisted Fix**: Combines static rules with Google Gemini AI for intelligent code improvements
- **Static Fix**: Fast, rule-based code fixes without AI

### ⚡ Smart Code Suggestions

- Real-time CodeLens suggestions on every line that needs improvement
- View diffs before applying changes
- Apply or reject suggestions individually
- Inline suggestions with keyboard shortcuts

### 🎯 Bulk Actions

- **Review Actions Menu**: Centralized menu in status bar for bulk operations
  - Apply all suggestions at once
  - Reset all suggestions instantly
  - Shows suggestion count
- Instant CodeLens refresh (no delays)

### 🔧 Automatic Code Improvements

The extension applies over 30 different code quality rules including:

- Convert `var` to `const`
- ES6 arrow functions
- Template literals instead of string concatenation
- Optional chaining (`?.`) and nullish coalescing (`??`)
- Remove console.logs
- Add error handlers
- Convert RGB to HEX
- Optimize browser checks
- And many more...

## Installation

1. Install from VS Code Marketplace or Cursor Extensions
2. Set your Google Gemini API key in settings (for AI-assisted mode)

## Usage

### Starting a Review

1. Open a JavaScript/TypeScript file
2. Click **"Review Code"** in the status bar (or use Command Palette)
3. Choose fix type:
   - **AI-Assisted Fix**: Select AI model → Review changes in webview → Apply or reject
   - **Static Fix**: Get instant CodeLens suggestions on affected lines

### Working with Suggestions

**Individual Actions:**
- Click **✅ Uygula** on CodeLens to apply
- Click **👀 Farkı Gör** to view diff
- Click **❌ Reddet** to reject
- Or use keyboard shortcuts: `Alt+A` (apply), `Alt+R` (reject), `Alt+D` (diff)

**Bulk Actions:**
1. Click **"Review Actions"** in status bar
2. Select:
   - **✓ Tümünü Uygula**: Apply all suggestions
   - **↻ Tümünü Resetle**: Reset all suggestions

### AI Models

Choose from multiple Gemini models:
- **Gemini 2.5 Pro**: Most powerful, best quality
- **Gemini 2.5 Flash**: Fast and efficient
- **Gemini 2.0 Flash Experimental**: Latest experimental (default)
- **Gemini 2.0 Flash Thinking Experimental**: Advanced reasoning

## Settings

```json
{
  "godtiercodereviewer.apiKey": "your-gemini-api-key"
}
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Keyboard Shortcuts

When cursor is on a suggestion:
- `Alt+A`: Apply suggestion
- `Alt+R`: Reject suggestion
- `Alt+D`: Show diff

## Requirements

- VS Code 1.54.0 or higher
- Cursor IDE (fully supported)
- Google Gemini API key (for AI-assisted mode only)

## Extension Settings

This extension contributes the following settings:

* `godtiercodereviewer.apiKey`: Your Google Generative AI (Gemini) API Key

## Known Issues

None currently reported. Please file issues on [GitHub](https://github.com/balpa/godtiercodereviewer/issues).

## Release Notes

### 1.0.7 (Latest)

**Added:**
- Review Actions menu in status bar
- Bulk apply/reset commands
- Instant CodeLens refresh
- Enhanced AI fix webview UI

**Fixed:**
- CodeLens persistence bug (instant removal)

See [CHANGELOG.md](CHANGELOG.md) for full history.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

**Enjoy cleaner code!** ✨