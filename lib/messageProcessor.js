var mailStoreObj = require('./dao/mailerStore');
module.exports = {
    process: function(mailerData){
    var actionType = mailerData['dataType'];
    switch (actionType) {
        case "mailSent":
            mailStoreObj.insert(mailerData);
            break;
        case "open":
            mailStoreObj.openRateInsert(mailerData);
            break;
        case "click":
            mailStoreObj.clicksInsert(mailerData);
            break;
        default:
            break;
    }
}
}

