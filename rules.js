const rulesArray = [
    {
        "id": "V1",
        "category": "Variables",
        "desc": "Use meaningful and pronounceable variable names."
    },
    {
        "id": "V2",
        "category": "Variables",
        "desc": "Use consistent vocabulary for the same variable type (e.g., getUser, not getUserInfo/getClientData)."
    },
    {
        "id": "V3",
        "category": "Variables",
        "desc": "Use searchable names; avoid magic numbers, declare them as named constants."
    },
    {
        "id": "V4",
        "category": "Variables",
        "desc": "Use explanatory variables to break down complex expressions (e.g., destructuring)."
    },
    {
        "id": "V5",
        "category": "Variables",
        "desc": "Avoid single-letter or obscure names that require mental mapping; be explicit."
    },
    {
        "id": "V6",
        "category": "Variables",
        "desc": "Don't add redundant context to names (e.g., in 'Car' object, use 'make' not 'carMake')."
    },
    {
        "id": "V7",
        "category": "Variables",
        "desc": "Use default function arguments instead of short-circuiting."
    },
    {
        "id": "V8",
        "category": "Variables",
        "desc": "Cache repeated calculations or system calls in a variable."
    },
    {
        "id": "F1",
        "category": "Functions",
        "desc": "Functions should have 2 or fewer arguments; for more, use a single options object."
    },
    {
        "id": "F2",
        "category": "Functions",
        "desc": "Functions must do only one thing (Single Responsibility Principle)."
    },
    {
        "id": "F3",
        "category": "Functions",
        "desc": "Function names must be descriptive and say what they do."
    },
    {
        "id": "F4",
        "category": "Functions",
        "desc": "Functions should have a single level of abstraction; split logic into helpers."
    },
    {
        "id": "F5",
        "category": "Functions",
        "desc": "Avoid duplicate code (DRY - Don't Repeat Yourself); create abstractions."
    },
    {
        "id": "F6",
        "category": "Functions",
        "desc": "Use spread syntax '{...defaults, ...config}' to set default object properties."
    },
    {
        "id": "F7",
        "category": "Functions",
        "desc": "Don't use boolean flags as parameters; create separate functions instead."
    },
    {
        "id": "F8",
        "category": "Functions",
        "desc": "Avoid side effects; functions should not modify global variables or input arguments."
    },
    {
        "id": "F9",
        "category": "Functions",
        "desc": "Do not modify prototypes of built-in objects; use classes or composition."
    },
    {
        "id": "F10",
        "category": "Functions",
        "desc": "Favor functional methods (.map, .reduce, .filter) over imperative loops."
    },
    {
        "id": "F11",
        "category": "Functions",
        "desc": "Encapsulate complex conditionals into self-describing functions."
    },
    {
        "id": "F12",
        "category": "Functions",
        "desc": "Avoid negative conditionals (e.g., 'isPresent' instead of '!isNotPresent')."
    },
    {
        "id": "F13",
        "category": "Functions",
        "desc": "Avoid 'switch' statements or complex 'if/else' by using polymorphism."
    },
    {
        "id": "F14",
        "category": "Functions",
        "desc": "Avoid manual type-checking; rely on polymorphism or use TypeScript."
    },
    {
        "id": "F15",
        "category": "Functions",
        "desc": "Don't prematurely optimize; trust modern JS engines."
    },
    {
        "id": "F16",
        "category": "Functions",
        "desc": "Remove all dead or unreachable code."
    },
    {
        "id": "O1",
        "category": "Objects & Data",
        "desc": "Use getters and setters to access object data instead of direct property access."
    },
    {
        "id": "O2",
        "category": "Objects & Data",
        "desc": "Encapsulate object members, making them private where possible."
    },
    {
        "id": "C1",
        "category": "Classes",
        "desc": "Prefer ES6+ class syntax over ES5 prototype-based constructors."
    },
    {
        "id": "C2",
        "category": "Classes",
        "desc": "Use method chaining by returning 'this' from methods that modify the instance."
    },
    {
        "id": "C3",
        "category": "Classes",
        "desc": "Prefer composition over inheritance for 'has-a' relationships."
    },
    {
        "id": "S1",
        "category": "SOLID",
        "desc": "SRP: A class or module should have only one reason to change."
    },
    {
        "id": "S2",
        "category": "SOLID",
        "desc": "OCP: Entities should be open for extension, but closed for modification."
    },
    {
        "id": "S3",
        "category": "SOLID",
        "desc": "LSP: Subtypes must be substitutable for their base types."
    },
    {
        "id": "S4",
        "category": "SOLID",
        "desc": "ISP: Avoid 'fat interfaces'; clients should not depend on methods they don't use."
    },
    {
        "id": "S5",
        "category": "SOLID",
        "desc": "DIP: High-level modules should depend on abstractions, not concretions."
    },
    {
        "id": "CR1",
        "category": "Concurrency",
        "desc": "Use 'async/await' for asynchronous code; avoid callbacks and complex Promise chains."
    },
    {
        "id": "E1",
        "category": "Error Handling",
        "desc": "Do not ignore caught errors or rejected promises; always handle them."
    },
    {
        "id": "FR1",
        "category": "Formatting",
        "desc": "Use consistent capitalization for variables, functions, and classes."
    },
    {
        "id": "FR2",
        "category": "Formatting",
        "desc": "Keep related functions vertically close; callers should be above callees."
    },
    {
        "id": "CM1",
        "category": "Comments",
        "desc": "Only comment complex business logic; code should be self-documenting."
    },
    {
        "id": "CM2",
        "category": "Comments",
        "desc": "Remove all commented-out code; use version control for history."
    },
    {
        "id": "CM3",
        "category": "Comments",
        "desc": "Avoid positional markers or noisy banner comments."
    },
    {
        "id": "I1",
        "category": "Insider API",
        "desc": "Use latest EcmaScript (ESNext) features."
    },
    {
        "id": "I2",
        "category": "Insider API",
        "desc": "Do not use deprecated migration functions like 'spApi' or 'sQuery'."
    },
    {
        "id": "I3",
        "category": "Insider API",
        "desc": "Do not define variables on 'window'; use 'Insider.__external' for globals."
    },
    {
        "id": "I4",
        "category": "Insider API",
        "desc": "For globals on 'Insider.__external', use a unique suffix (e.g., variationId) to avoid clashes."
    },
    {
        "id": "I5",
        "category": "Insider API",
        "desc": "Check if external functions exist before calling them ('Insider.fns.isFunction')."
    },
    {
        "id": "I6",
        "category": "Insider API",
        "desc": "When manually triggering API functions, ensure all related events and storage are also updated."
    },
    {
        "id": "I7",
        "category": "Insider API",
        "desc": "Do not hardcode GDPR, email, or push opt-in consents; use dynamic values."
    },
    {
        "id": "I8",
        "category": "Insider API",
        "desc": "Use existing Insider API functions instead of recreating logic."
    },
    {
        "id": "I9",
        "category": "Insider API",
        "desc": "'console.log' and 'alert' are disallowed; use 'Insider.logger.log' with a variation ID."
    },
    {
        "id": "I10",
        "category": "Insider API",
        "desc": "Use Insider library methods ('Insider.fns.*') over native JS equivalents where possible."
    },
    {
        "id": "I11",
        "category": "Insider API",
        "desc": "Use 'Insider.campaign.getCampaignStorage' to access campaign storage."
    },
    {
        "id": "I12",
        "category": "Insider API",
        "desc": "Always use 'Insider.systemRules.call('ruleName')' instead of calling the rule function directly."
    },
    {
        "id": "I13",
        "category": "Insider API",
        "desc": "Use a self-invoking function (IIFE) if code has multiple functions or needs a return."
    },
    {
        "id": "ST1",
        "category": "Style Guide",
        "desc": "Curly braces are required for all control structures (if, for, while), even for single statements."
    },
    {
        "id": "ST2",
        "category": "Style Guide",
        "desc": "Use a four-space indentation for each new block level."
    },
    {
        "id": "ST3",
        "category": "Style Guide",
        "desc": "Every statement must be terminated with a semicolon."
    },
    {
        "id": "ST4",
        "category": "Style Guide",
        "desc": "Lines should not exceed 120 characters."
    },
    {
        "id": "ST5",
        "category": "Style Guide",
        "desc": "Declare each variable on its own line; avoid comma-separated declarations."
    },
    {
        "id": "ST6",
        "category": "Style Guide",
        "desc": "Prefix variables holding DOM elements or nodes with a dollar sign ($). Don't capitalize first letter"
    },
    {
        "id": "ST7",
        "category": "Style Guide",
        "desc": "Ternary operators should be simple and based on one or two conditions at most for readability."
    },
    {
        "id": "ST8",
        "category": "Style Guide",
        "desc": "Break long lines of code logically to stay within the column limit."
    },
    {
        "id": "ST9",
        "category": "Style Guide",
        "desc": "Break long ternary operators into multiple lines, aligning '?' and ':' for readability."
    },
    {
        "id": "ST10",
        "category": "Style Guide",
        "desc": "Use only block comments (/* */) for task numbers (e.g., /* OPT-123 */)."
    },
    {
        "id": "ST11",
        "category": "Style Guide",
        "desc": "Use vertical whitespace to separate logical blocks of code (e.g., before return, between functions)."
    },
    {
        "id": "ST12",
        "category": "Style Guide",
        "desc": "Use horizontal whitespace consistently (e.g., after keywords like 'if', around operators)."
    },
    {
        "id": "ST13",
        "category": "Style Guide",
        "desc": "there should be a space between the text in curly braces."
    },
    {
        "id": "JS1",
        "category": "General JS",
        "desc": "Prefer 'const' by default. If reassignment is needed, use 'let'. Avoid 'var'."
    },
    {
        "id": "JS2",
        "category": "General JS",
        "desc": "Avoid creating global variables; always declare with 'const' or 'let'."
    },
    {
        "id": "JS3",
        "category": "General JS",
        "desc": "Functions must do only one thing and be named clearly for their purpose."
    },
    {
        "id": "JS4",
        "category": "General JS",
        "desc": "Avoid creating wrapper functions that only call another function; use the original function directly."
    },
    {
        "id": "JS5",
        "category": "General JS",
        "desc": "Prefer function expressions (e.g., const sum = () => {}) over function declarations."
    },
    {
        "id": "JS6",
        "category": "General JS",
        "desc": "Use arrow functions unless you need lexical 'this' (e.g., in event handlers or object methods)."
    },
    {
        "id": "JS7",
        "category": "General JS",
        "desc": "Use default parameter syntax (opts = {}) instead of mutating arguments."
    },
    {
        "id": "JS8",
        "category": "General JS",
        "desc": "Always include parentheses around arguments in arrow functions, even for a single argument."
    },
    {
        "id": "JS9",
        "category": "General JS",
        "desc": "Use single quotes (') for string literals."
    },
    {
        "id": "JS10",
        "category": "General JS",
        "desc": "Use template literals (``) for string interpolation instead of concatenation."
    },
    {
        "id": "JS11",
        "category": "General JS",
        "desc": "Use array literals (`[]`) for array creation, not 'new Array()'."
    },
    {
        "id": "JS12",
        "category": "General JS",
        "desc": "For unique lists where existence checks are frequent, use 'Set' and 'set.has()' for better performance."
    },
    {
        "id": "JS13",
        "category": "General JS",
        "desc": "Use object literals ('{}') for object creation."
    },
    {
        "id": "JS14",
        "category": "General JS",
        "desc": "Use computed property names ('{[key]: value}') for dynamic keys in object literals."
    },
    {
        "id": "JS15",
        "category": "General JS",
        "desc": "Use object property value shorthand when the key and variable name are the same."
    },
    {
        "id": "JS16",
        "category": "General JS",
        "desc": "Use object and array destructuring to access properties and elements."
    },
    {
        "id": "JS17",
        "category": "General JS",
        "desc": "For functions returning multiple values, return an object and use destructuring to consume it."
    },
    {
        "id": "JS18",
        "category": "General JS",
        "desc": "Always use strict equality ('===', '!==') over loose equality ('==', '!=')."
    },
    {
        "id": "JS19",
        "category": "General JS",
        "desc": "Use boolean shortcuts ('if (isValid)'), but explicit comparisons for strings ('name !== ''') and numbers ('collection.length > 0')."
    },
    {
        "id": "JS20",
        "category": "General JS",
        "desc": "Use dot notation ('.') for static property access and bracket notation ('[]') for dynamic access."
    },
    {
        "id": "JS21",
        "category": "General JS",
        "desc": "Use the exponentiation operator ('**') instead of 'Math.pow()'."
    },
    {
        "id": "JS22",
        "category": "General JS",
        "desc": "Use explicit constructors for type casting: 'String()', 'Number()', 'Boolean()' or '!!'."
    },
    {
        "id": "JS23",
        "category": "General JS",
        "desc": "Use the spread operator ('...') for creating new arrays from existing ones (concatenation, copying)."
    },
    {
        "id": "JS24",
        "category": "General JS",
        "desc": "Use 'Promise.all' for multiple independent asynchronous operations."
    },
    {
        "id": "JS25",
        "category": "General JS",
        "desc": "Pass function references directly to callbacks or event handlers instead of wrapping in an anonymous function."
    },
    {
        "id": "N1",
        "category": "Naming",
        "desc": "Avoid abbreviations and use meaningful, descriptive names for variables and functions."
    },
    {
        "id": "N2",
        "category": "Naming",
        "desc": "Function names should start with a verb, followed by a noun, in camelCase (e.g., 'getUserData')."
    },
    {
        "id": "N3",
        "category": "Naming",
        "desc": "Functions returning a boolean should be prefixed with 'is', 'has', 'does', or 'check'."
    },
    {
        "id": "N4",
        "category": "Naming",
        "desc": "Boolean-returning function names should have a positive meaning (e.g., 'isCarPurchased' not 'isCarNotPurchased')."
    },
    {
        "id": "N5",
        "category": "Naming",
        "desc": "Constructor functions must use UpperCamelCase (PascalCase)."
    },
    {
        "id": "N6",
        "category": "Naming",
        "desc": "Variable names must be in camelCase."
    },
    {
        "id": "N7",
        "category": "Naming",
        "desc": "Group more than 3 related class or selector strings into a single object."
    },
    {
        "id": "N8",
        "category": "Naming",
        "desc": "If a value or selector is used more than once, store it in a variable."
    },
    {
        "id": "N9",
        "category": "Naming",
        "desc": "Variables holding a boolean value should be prefixed with 'is', 'has', 'does', or 'check'."
    },
    {
        "id": "N10",
        "category": "Naming",
        "desc": "Do not use the 'OPT' prefix in event namespaces; use only the variation ID."
    },
    {
        "id": "N11",
        "category": "Naming",
        "desc": "Storage keys must start with 'ins-', use kebab-case, and include a variation ID if campaign-specific."
    },
    {
        "id": "N12",
        "category": "Naming",
        "desc": "Custom Rule names must be meaningful, explanatory, and capitalized (Title Case)."
    },
    {
        "id": "N13",
        "category": "Naming",
        "desc": "User attribute names must be meaningful and use snake_case."
    },
    {
        "id": "P1",
        "category": "Practices",
        "desc": "Use 'Insider.eventManager.once()' for binding events to prevent duplicate listeners."
    },
    {
        "id": "P2",
        "category": "Practices",
        "desc": "Event listeners must have a namespace, formatted as 'event.action:element:variationId'."
    },
    {
        "id": "P3",
        "category": "Practices",
        "desc": "Use 'Insider.fns.throttle' or 'debounce' for high-frequency events like 'scroll' or 'resize'."
    },
    {
        "id": "P4",
        "category": "Practices",
        "desc": "Use optional chaining (?.) and the nullish coalescing operator (??) for safe property access and fallbacks."
    },
    {
        "id": "P5",
        "category": "Practices",
        "desc": "Provide a default value when using 'getDataFromDataLayer' or 'getDataFromIO' if the return type is not a string."
    },
    {
        "id": "P6",
        "category": "Practices",
        "desc": "For multi-variation campaigns, encapsulate shared logic in a reusable constructor function."
    },
    {
        "id": "P7",
        "category": "Practices",
        "desc": "A reset function that removes all campaign elements and events is mandatory to prevent side effects."
    },
    {
        "id": "P8",
        "category": "Practices",
        "desc": "When using a class object with more than 3 properties, programmatically generate a corresponding selectors object."
    },
    {
        "id": "P9",
        "category": "Practices",
        "desc": "If there is already a selectors object, don't create another one. Add to accumulator of the current one."
    },
    {
        "id": "P10",
        "category": "Practices",
        "desc": "For self object, don't change the current structure at all. Method declarations should remain same."
    },
    {
        "id": "CH1",
        "category": "CSS & HTML",
        "desc": "All CSS class names must start with 'ins-' and be unique, typically by including the variation ID."
    },
    {
        "id": "CH2",
        "category": "CSS & HTML",
        "desc": "All CSS selectors must be scoped under a unique, 'ins-' prefixed parent wrapper class."
    },
    {
        "id": "CH3",
        "category": "CSS & HTML",
        "desc": "Do not style partner elements directly; add a custom 'ins-' prefixed class and style that class instead."
    },
    {
        "id": "CH4",
        "category": "CSS & HTML",
        "desc": "Inside media queries, CSS rules must be prefixed with '.ins-preview-wrapper'."
    },
    {
        "id": "CH5",
        "category": "CSS & HTML",
        "desc": "Always use hex color codes (e.g., '#000000') instead of color names."
    },
    {
        "id": "CH6",
        "category": "CSS & HTML",
        "desc": "HTML strings in JS must be properly indented and stored in a variable."
    },
    {
        "id": "CH7",
        "category": "CSS & HTML",
        "desc": "When building HTML strings, use variables for dynamic content like classes, text, and numbers."
    },
    {
        "id": "CH8",
        "category": "CSS & HTML",
        "desc": "CSS strings in JS must be properly indented and stored in a variable."
    },
    {
        "id": "CH9",
        "category": "CSS & HTML",
        "desc": "Use CSS media queries for responsive styles instead of conditional logic in JavaScript."
    }
];

module.exports = rulesArray;