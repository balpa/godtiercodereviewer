//1-> camelCase function name
//2-> remove console logs
function Do_Something() {
    console.log("log1");

    Insider.logger.log('test2');
    return true
}

//adds isFunction controls for extenal functions
//TODO: değişken tanımlamalarında gereksiz if cond eklenecek. cover'lanabilir mi araştır

Insider.__external.xxxx('optimize');

if (Insider.__external.xxxx('optimize')) {
}

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

//convert to function expression
function sum(a, b, c) {
    return a + b;
}

//convert new array to literal
var productIds = new Array('1234', '34445', '5677');

//NEEDS FIX: convert object properties to shorthand  --> might not be feasible with recast
const createPerson = {
    name: name,
    age: age,
    status: status,
};

//apply destructring (works only for classes, selectors, config)
//IDEA: apply destructring for forEach etc method parameters
//NOTE: one line not working
const foo = () => {
    Insider.dom('box-item').addClass(classes.relative);

    if (Insider.dom('wrapper').hasClass(classes.relative)) {
    }
}

const buildCSS = () => {
    const customStyle =
    `${ selectors.hide } {
        display: none;
    }
    ${ selectors.flex } {
        display: flex;
    }
    ${ selectors.block } {
        display: block;
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

//add error handling
Insider.request.get({
    url: 'https://cronus.useinsider.com/api/inone/get-status/' + partnerName,
    success: (response) => {
    }
});

Insider.request.post({
    url: 'https://cronus.useinsider.com/api/inone/get-status/ggfdsgsfdgsmk',
    success: (response) => {
    }
});

//add variation id for event namespace
Insider.eventManager.once('click.test:name', () => {
});

//add debounce/throttle
Insider.eventManager.once('scroll.back:to:top:3', window, () => {
});