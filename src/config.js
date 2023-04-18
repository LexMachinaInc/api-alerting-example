const fs = require("fs");
const path = require("path");
const { format, sub } = require("date-fns");

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../config/main.json")));

module.exports = {
    lawFirmId: config.lawFirmId,
    startDate: format(sub(new Date(), { days: config.rollingDays}), 'yyyy-MM-dd'),
    myFirmName: config.myFirmName,
    defaultEmail: config.defaultEmail,
    emailHost: config.emailHost,
    emailUser: config.emailUser,
    emailPassword: config.emailPassword,
}



