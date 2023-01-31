const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const bulmaCSS = require('express-bulma');
const storage = require("node-persist");
const path = require('path');

const { getAPIData, getInitialData, casesData, defenseAttyData } = require("./ingest");
const { defaultEmail, myFirmName } = require("./config");
const { getMailtoLink } = require("./email");

const app = express();
const PORT = process.env.PORT || 4200;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(bulmaCSS("/default.css"));
app.set('layout', './layouts/index')
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "..", "views"));

app.get("/", (request, response) => {
  response.render("cases", {
    title:
      `Lex Machina API: Cases where ${myFirmName} represents the defendant`,
    cases: casesData,
    helpers: { getMailtoLink, getContact: ((id) => defenseAttyData.find(({attorneyId}) => attorneyId === id)) }
  });
});

app.get("/contacts", async (request, response) => {
  response.render("contacts", {
    title:
      `Lex Machina API: ${myFirmName} attorney contacts`,
    contacts: defenseAttyData,
  });
});

app.post("/contacts", async (request, response) => {
  defenseAttyData.forEach((atty) => {
    atty.email = request.body[`email-${atty.attorneyId}`]
  });
  storage.setItem('defenseAttyData', defenseAttyData);
  response.redirect("/address-list");
});

app.get("/send-alerts", (request, response) => {
  const content = casesData.reduce((content, next) => {
    const item = {caseName: next.caseMeta.title, name: next.defendantAttorney[0].name, email: defaultEmail};
    return `${content}\n${templates.sentItem(item)}`
  }, "");
  response.send(templates.base(templates.sentList(content)));
});

app.get("/refresh", async (request, response) => {
  await getAPIData();
  response.send(200)
});

app.listen(PORT, async () => {
  await storage.init();
  await getInitialData();
  console.log(`Server started on port ${PORT}`);
});
