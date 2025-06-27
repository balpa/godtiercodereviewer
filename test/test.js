function Do_Something() {
    console.log("log1");

    Insider.logger.log('test2');
    return true
}

Insider.__external.xxxx('optimize');

const classes = {
    style: `ins-custom-style-${ 1 }`,
};

const selectors = Object.keys(classes).reduce((createdSelector, key) => {
    createdSelector[key] = `.${ classes[key] }`;

    return createdSelector;
}, {})

const arr = [1, 2, 3];
if (arr.includes(x)) {
}