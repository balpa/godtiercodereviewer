//1-> camelCase function name
//2-> remove console logs
function Do_Something() {
    console.log("log1");

    Insider.logger.log('test2');
    return true
}

//adds isFunction controls for extenal functions
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