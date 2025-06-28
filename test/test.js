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
const selectors = Object.keys({style: `ins-custom-style-${ 1 }`}).reduce((createdSelector, key) => {
    createdSelector[key] = `.${ classes[key] }`;

    return createdSelector;
}, {})

//Insider.fns.has instead of .includes()
const arr = [1, 2, 3];
if (arr.includes(x)) {
}

//Insider.campaign.getCampaignStorage to get campaign data
Insider.storage.localStorage.get(`sp-camp-${ variationId }`);

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
function test () {
    document.querySelector('test')
}

//replace var to const
var a = 1;

//convert to function expression
function sum(a, b, c) {
    return a + b;
}

//add paranthesis for function params
[1, 2, 3].map(x => x * x);