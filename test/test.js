//1-> camelCase function name
//2-> remove console logs
function Do_Something() {
    console.log("log1");

    Insider.logger.log('test2');
    return true
}

//adds isFunction controls for extenal functions
//TODO: if içerisinde değişken vs olarak kullanılabilir. bu case'i cover'la
Insider.__external.xxxx('optimize');

//replaces Object.keys with Insider.fns.keys
const selectors = Object.keys({ style: `ins-custom-style-${1}` }).reduce((createdSelector, key) => {
    createdSelector[key] = `.${classes[key]}`;

    return createdSelector;
}, {})

//Insider.fns.has instead of .includes()
const arr = [1, 2, 3];
if (arr.includes(x)) {
}

//Insider.campaign.getCampaignStorage to get campaign data
Insider.storage.localStorage.get(`sp-camp-${variationId}`);

//use call method for system rules
Insider.systemRules.isOnProductPage();
Insider.systemRules.isOnCartPage();
Insider.systemRules.getCurrency();

//add dollar prefix for node variables
const productBox = Insider.dom('.ins-product-box')
const productBox2 = Insider.dom('.ins-product-box').first()
const productBox3 = Insider.dom('.ins-product-box').text()

//add dollar prefix for accessNodes parameter
Insider.dom('.ins-product-box').accessNodes((node) => {
});

//convert es5 functions to arrow function
function test() {
    document.querySelector('test')
}

//replace var to const
var a = 1;

//FIX: convert to function expression
function sum(a, b, c) {
    return a + b;
}

//add paranthesis for function params NOT WORKING
[1, 2, 3].map(x => x * x);

//convert new array to literal
var productIds = new Array('1234', '34445', '5677');

//NEEDS FIX: convert object properties to shorthand
const createPerson = {
    name: name,
    age: age,
    status: status,
};

//apply destructring (works only for classes, selectors, config)
//TODO: more testing and one line for destructring ALSO remove var decs after dsting for 86 87
const foo = () => {
    Insider.dom('box-item').addClass(classes.relative);

    if (Insider.dom('wrapper').hasClass(classes.relative)) {
    }
}

const buildCSS = () => {
    const customStyle =
    `${ selectors.hide } {
        display: none;
    }`;
};

const getFullName = (user) => {
    const firstName = config.firstName;
    const lastName = config.lastName;

    return `${ firstName } ${ lastName }`;
}

//change length control for if cond
if (collection.length) {
}

//change toString to String
const totalScore = this.reviewScore.toString();

//add error handling NEEDS TO BE DONE FROM SCRATCH
Insider.request.get({
    url: 'https://cronus.useinsider.com/api/inone/get-status/' + partnerName,
    success: (response) => {
    }
});

//add variation id for event namespace
Insider.eventManager.once('click.test:name', () => {
});