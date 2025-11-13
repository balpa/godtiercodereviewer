# Change Log

All notable changes to the "godtiercodereviewer" extension will be documented in this file.

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