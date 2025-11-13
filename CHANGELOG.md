# Change Log

All notable changes to the "godtiercodereviewer" extension will be documented in this file.

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
  - Example: `'berke' + a` → `` `berke ${ a } ` ``
  - Example: `'hello' + name + '!'` → `` `hello ${ name } !` ``
  - Adds spaces around template expressions for better readability

### Changed
- Updated fixer pipeline to include new transformation functions

## [1.0.0] - 2025-11-12

- Initial release