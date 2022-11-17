const defaultEmail = "lregla@lexmachina.com";

function printAlertByCase(contact, meta, links) {
    const lineTo = contact.reduce((to, next) => {
        return `${to} ${next.name}<${defaultEmail}>\n`;
    }, "");
    const lineSubject = `Early Case Assessor re: ${meta.title}`;
    const body = `
A recently filed case, ${meta.title} in ${meta.court} has you as defense counsel.
    
You may view analytics for this case directly on Lex Machina at ${links.case.url}.
    
You may learn more about the judge(s) presiding over this case at: 
    ${links.judges.reduce((judgeList, next) => (`${judgeList}\n\n${next.name}\n${next.url}`), "")}
       
Use the Early Case Assessor Quicktool from LexMachina to get valuable insights on plaintiff counsel:
    ${links.earlyCaseAssessor.reduce((plaintiffList, next) => (`${plaintiffList}\n\n${next.name}\n${next.url}`), "")}
`;
    console.log("----- email start ------");
    console.log(`To: ${lineTo}`);
    console.log(`Subject: ${lineSubject}`);
    console.log(body);
    console.log("----- email end ------\n\n");
}

function getMailtoLink(meta, links) {
    const lineSubject = `Early Case Assessor re: ${meta.title}`;
    const body = `A recently filed case, ${meta.title} in ${meta.court} has you as defense counsel.\n
You may view analytics for this case directly on Lex Machina at ${links.case.url}.
    
You may learn more about the judge(s) presiding over this case at: 
    ${links.judges.reduce((judgeList, next) => (`${judgeList}\n\n${next.name}\n${next.url}`), "")}
       
Use the Early Case Assessor Quicktool from LexMachina to get valuable insights on plaintiff counsel:
    ${links.earlyCaseAssessor.reduce((plaintiffList, next) => (`${plaintiffList}\n\n${next.name}\n${next.url}`), "")}
`;
    return `mailto:${defaultEmail}?subject=${encodeURIComponent(lineSubject)}&body=${encodeURIComponent(body)}`
}



module.exports = { printAlertByCase, getMailtoLink };


