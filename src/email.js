const ejs = require("ejs");
const { defaultEmail, myFirmName } = require("./config");

async function getMailtoLink(caseData, name, email = defaultEmail) {
  const query = new URLSearchParams({
    subject:
      "Early Case Assessor and Judge Analytics for Recent Defense Appearance - Legal Analytics results",
    body: await ejs.renderFile("views/emails/default.ejs", {
      myFirmName,
      ...caseData,
    }),
  }).toString();

  return `mailto:${encodeURIComponent(name)}<${email}>?${query}`;
}

module.exports = { getMailtoLink };
