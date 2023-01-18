const { defaultEmail, myFirmName } = require("./config");

const emailBodyTemplate = ({caseText, defenseText, judgeText, plaintiffText}) => `
Greetings. Please find below links to an automatic report providing litigation analytics and judge analytics. These analytics may be relevant for a case in which a ${myFirmName} lawyer recently appeared in federal district court for the defense. 

These Legal Analytics are from (a) Lex Machina's Early Case Assessor, which provides a report for any case based on the track record in federal district court of the plaintiff and its law firm, and (b) Lex Machina's Judge Analytics for the federal district court judge assigned to the case. 

Case: ${caseText}
${myFirmName} attorneys representing defendants CVI SGP Acquisition Trust and CVI SGP-CO Acquisition Trust: ${defenseText}

(a) ${plaintiffText}

(b) ${judgeText}
`;

function printAlertByCase(contact, meta, links) {
    const lineTo = contact.reduce((to, next) => {
        return `${to} ${next.name}<${defaultEmail}>\n`;
    }, "");
    const lineSubject = `Early Case Assessor re: ${meta.title}`;
    const body = emailBodyTemplate({
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
    const body = emailBodyTemplate({
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
    return `mailto:${defaultEmail}?subject=${encodeURIComponent(lineSubject)}&body=${encodeURIComponent(body)}`
}



module.exports = { printAlertByCase, getMailtoLink };


