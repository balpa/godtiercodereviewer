# Change Log

All notable changes to the "godtiercodereviewer" extension will be documented in this file.

## [1.0.7] - 2025-11-25

### Added
- **Review Actions Menu**: New centralized status bar menu for bulk operations
  - Added "Review Actions" button in status bar with dropdown menu
  - "Tümünü Uygula" option to apply all suggestions at once
  - "Tümünü Resetle" option to reset all suggestions at once
  - Menu shows suggestion count and disables options when no suggestions exist

- **Bulk Operations Commands**: New commands for managing multiple suggestions
  - `godtiercodereviewer.applyAllSuggestions`: Apply all CodeLens suggestions in current file
  - `godtiercodereviewer.resetAllSuggestions`: Reset all CodeLens suggestions in current file
  - `godtiercodereviewer.showActionsMenu`: Open Review Actions menu
  - Commands accessible via Command Palette and status bar

### Improved
- **CodeLens Real-time Updates**: CodeLens now refreshes instantly instead of delayed updates
  - Added `onDidChangeCodeLenses` event to CodeLensProvider
  - Automatic refresh after apply, reject, or reset operations
  - Eliminates 2-3 second delay when clearing suggestions

- **AI Fix Webview UI**: Enhanced webview interface for AI-assisted fixes
  - Added prominent "Tümünü Uygula" and "Resetle" buttons at the top
  - Modern gradient button design with hover animations
  - Improved visual hierarchy and user experience

### Fixed
- **CodeLens Persistence Bug**: Fixed issue where CodeLens remained visible for several seconds after reset
  - CodeLensProvider now properly implements event emitter pattern
  - Instant UI updates when diagnostics are cleared

## [1.0.6] - 2025-11-24

### Fixed
- **Parser Support**: Added optional chaining (`?.`) and nullish coalescing (`??`) operator support to Babel parser
  - Fixed `TypeError: Cannot read properties of undefined (reading 'length')` error
  - Parser now includes `optionalChaining` and `nullishCoalescingOperator` plugins

- **convertRGBtoHEX**: Added null safety checks for template literals
  - Prevents crashes when `node.quasis` or `node.expressions` are undefined
  - Function now gracefully handles malformed AST nodes

- **optimizeBrowserChecks**: Complete rewrite to fix AST corruption issues
  - Removed problematic scope comparison logic
  - Improved node cloning to prevent circular references
  - Simplified block statement detection
  - Now safely optimizes `Insider.browser.isMobile()` and `Insider.browser.isDesktop()` calls

## [1.0.2] - 2025-11-13

### Added
- **Cursor IDE Support**: Extension now officially supports Cursor IDE
  - Added `cursor: "*"` to engines in package.json
  - Extension can be installed and used in both VS Code and Cursor

- **reorderSelfMethods**: Automatically reorders self-invoking function methods based on call order in `init`
  - Example: Methods are sorted so `init` comes first, followed by methods in the order they're called
  - Improves code readability by organizing methods in execution order
  - Works with `((self) => { ... })({})` pattern

### Fixed
- **convertStringConcatenationToTemplateLiteral**: Fixed template literal spacing
  - Now correctly formats as `` `text${ variable }` `` with spaces inside curly braces
  - Removed extra trailing spaces and backticks

## [1.0.1] - 2025-11-13

### Added
- **convertTimeToDateHelper**: Automatically converts `setTimeout` numeric time values to use `Insider.dateHelper` constants
  - Example: `setTimeout(fn, 1000)` → `setTimeout(fn, Insider.dateHelper.ONE_SECOND_AS_MILLISECOND)`
  - Supports fractional multipliers (e.g., `400` → `0.4 * Insider.dateHelper.ONE_SECOND_AS_MILLISECOND`)

- **convertStorageExpireTimeToDateHelper**: Converts `Insider.storage` expire values to use `dateHelper.addDay()` method
  - Example: `Insider.storage.localStorage.set({ expires: 5 })` → `Insider.storage.localStorage.set({ expires: Insider.dateHelper.addDay(5) })`
  - Works with both `localStorage` and `sessionStorage`
  - Only converts values between 0-366 days

- **convertStringConcatenationToTemplateLiteral**: Converts string concatenations to template literals
  - Example: `'berke' + a` → `` `berke${ a }` ``
  - Example: `'hello' + name + '!'` → `` `hello${ name }!` ``
  - Adds spaces inside template expressions for better readability

### Changed
- Updated fixer pipeline to include new transformation functions

## [1.0.0] - 2025-11-12

- Initial release