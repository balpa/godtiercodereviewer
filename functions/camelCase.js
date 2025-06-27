const camelCase = (str) => {
    return str
        .replace(/[_-]+/g, ' ')
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '');
};

module.exports = { camelCase }