const { getMailtoLink } = require('./email');
const { myFirmName } = require("./config");

function base(content) {
    return `
<!doctype html>
<html>
    <head>
        <title>Cases with ${myFirmName} representing defendant</title>
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
            .actions a, .actions button {
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
    ${content}
    </body>
</html>
`;
}

function caseList(content) {
  return `
    <main>
      <h1>Cases</h1>
      <section>
      ${content}
      </section>
    </main>
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
                    <a href="${getMailtoLink(content.defendantAttorney ,content.caseMeta,content.links)}">Alert Defense Counsel</a>
                </div>
            </article>        
`;
}

function addressList(content) {
  return `
    <main>
      <h1>Contacts</h1>
      <section>
        <form action="/update-address" method="post">
        <table>
            <thead>
                <tr>
                  <td>Name</td>
                  <td>Email</td>
                </tr>
            </thead>
            <tbody>
                ${content}
            </tbody>
        </table>
        <div class="actions">
            <button type="submit">Save</button>
        </div>
        </form>
      </section>
    </main>
  `;
}

function addressItem({attorneyId, email, name}) {
  return `
                <tr>
                  <td>${name}</td>
                  <td>
                    <input type="text" name="email-${attorneyId}" size="25" value="${email}" />
                  </td>
                </tr>
  `;
}

function sentList(content) {
  return `
    <main>
      <h1>Sent Alerts</h1>
      <section>
        <table>
            <thead>
                <tr>
                  <td>Case</td>
                  <td>Name</td>
                  <td>Email</td>
                </tr>
            </thead>
            <tbody>
                ${content}
            </tbody>
        </table>
      </section>
    </main>
  `;
}

function sentItem({caseName, email, name}) {
  return `
                <tr>
                  <td>${caseName}</td>
                  <td>${name}</td>
                  <td>${email}</td>
                </tr>
  `;
}


module.exports = { addressList, addressItem, base, caseItem, caseList, sentList, sentItem };