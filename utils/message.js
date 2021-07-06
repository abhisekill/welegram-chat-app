const moment = require('moment');

function formatMessage(username,text){

    var date = moment.utc().format();

    var local = moment.utc(date).local().format('hh:mm a');

    return{
        username,
        text,
        time:local
    }
}

module.exports = formatMessage;