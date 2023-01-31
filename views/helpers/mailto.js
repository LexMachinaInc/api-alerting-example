ejs = require("ejs");
alert = require("../emails/alert")

function mailto(attorneyId) {
    const lineSubject = `Early Case Assessor re: `;
    const body = ejs.render(alert, { caseName: "heeeeee" })
    return `mailto:lregla@lexmachina.com?subject=${encodeURIComponent(lineSubject)}&body=${encodeURIComponent(body)}`
}

