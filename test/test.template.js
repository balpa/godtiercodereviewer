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
Insider.storage
    .localStorage.get(`sp-camp-${ variationId }`);