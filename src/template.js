const { getMailtoLink } = require('./email');

function base(content) {
    return `
<!doctype html>
<html>
    <head>
        <title>Cases representing defendant</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0">
        <style>
            article {
                margin: 1em;
                padding: 1em;
                border: 1px solid #ccc;
                box-shadow: 1px 1px 3px rgba(125,125,125,50);
                max-width: 72em;
            }
            .list-container {
                margin-left: 2.5em;
                max-height: 12em;
                overflow: auto;
            }
            .actions {
                text-align: center;
                margin: 2em 1em 1em;
            }
            .actions a {
                text-decoration: none;
                background: #4169e1;
                color: white;
                padding: 1em;
                line-height: 1.5;
                border-radius: 0.5em;
            }
        </style>
    </head>
    <body>
        <h1>Cases</h1>
        <section>
        ${content}
        </section>
    </body>
</html>
`;
}

const listNameUrls = (list) => list.reduce((all, next) => (`${all}<p><a href="${next.url}">${next.name}</a></p>`), "");

function caseItem(content) {
    return `
            <article>
                <h2>${content.caseMeta.title}</h2>
                <ul>
                    <li>Court: ${content.caseMeta.court}</li>
                    <li>Case Number: ${content.caseMeta.caseNumber}</li>
                    <li>Case Type: ${content.caseMeta.caseType}</li>
                    <li>Filing Date: ${content.caseMeta.filingDate}</li>
                </ul>
                <div class="list-container">
                    Judge(s) presiding over this case: 
                    ${listNameUrls(content.links.judges)}
                </div>
                <div class="list-container">
                    Use the Early Case Assessor Quicktool:
                    ${listNameUrls(content.links.earlyCaseAssessor)}
                <div/>
                <div class="actions">
                    <a href="${getMailtoLink(content.caseMeta,content.links)}">Alert Defense Counsel</a>
                </div>
            </article>        
`;
}

module.exports = { base, caseItem };