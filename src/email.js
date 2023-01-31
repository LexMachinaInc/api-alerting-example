const ejs = require("ejs");
const { defaultEmail, myFirmName } = require("./config");

function printAlertByCase(contact, meta, links) {
    const lineTo = contact.reduce((to, next) => {
        return `${to} ${next.name}<${defaultEmail}>\n`;
    }, "");
    const lineSubject = `Early Case Assessor re: ${meta.title}`;
    const body = ejs.render("emails/alert",{
        caseText: `<a href="${links.case.url}">${meta.title}</a>  ${meta.caseNumber}`,
        defenseText: contact.map(({name}) => (name)).join(", "),
        judgeText: links.judges.reduce((judgeList, next) => (`
            ${judgeList}
            Federal District Court Judge Assigned: ${next.name}
            <a href="${next.url}">Judge Analytics Summary for Judge ${next.name}</a>
            <a href="${next.url}">Legal Analytics for Judge ${next.name} in ${meta.caseType} cases</a>
        `), ""),
        plaintiffText: links.earlyCaseAssessor.reduce((plaintiffList, next) => (`
            ${plaintiffList}
            Early Case Assessor results for plaintiff <a href="${next.url}">${next.name} and ${meta.caseType}</a>.
        `), ""),
    });

    console.log("----- email start ------");
    console.log(`To: ${lineTo}`);
    console.log(`Subject: ${lineSubject}`);
    console.log(body);
    console.log("----- email end ------\n\n");
}

function getMailtoLink(contact, meta, links) {
    const lineSubject = `Early Case Assessor re: ${meta.title}`;
    const body = ejs.render("emails/alert",{
        caseText: `<a href="${links.case.url}">${meta.title}</a>  ${meta.caseNumber}`,
        // defenseText: contact.map(({name}) => (name)).join(", "),
        judgeText: links.judges.reduce((judgeList, next) => (`
            ${judgeList}
            Federal District Court Judge Assigned: ${next.name}
            <a href="${next.url}">Judge Analytics Summary for Judge ${next.name}</a>
            <a href="${next.url}">Legal Analytics for Judge ${next.name} in ${meta.caseType} cases</a>
        `), ""),
        plaintiffText: links.earlyCaseAssessor.reduce((plaintiffList, next) => (`
            ${plaintiffList}
            Early Case Assessor results for plaintiff <a href="${next.url}">${next.name} and ${meta.caseType}</a>.
        `), ""),
    });
    return `mailto:${defaultEmail}?subject=${encodeURIComponent(lineSubject)}&body=${encodeURIComponent(body)}`
}



module.exports = { printAlertByCase, getMailtoLink };
