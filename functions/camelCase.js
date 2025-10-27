const camelCase = (str) => {
    const hasDollarPrefix = str.startsWith('$');
    let strToProcess = str;

    if (hasDollarPrefix) {
        strToProcess = str.substring(1);
    }

    const camelCasedStr = strToProcess
        .replace(/[_-]+/g, ' ')
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '');

    return hasDollarPrefix ? '$' + camelCasedStr : camelCasedStr;
};

module.exports = { camelCase };