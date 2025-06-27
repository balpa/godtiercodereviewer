const addSemiColon = (line) => {
    return line.replace(/([^;\s{}])\n/g, '$1;\n')
}

module.exports = { addSemiColon };