const path = require('path');
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const bulmaCSS = require('express-bulma');
const storage = require("node-persist");
const nodemailer = require("nodemailer");
const ejs = require("ejs");

const { getAPIData, getInitialData, casesData } = require("./ingest");
const { emailHost, emailUser, emailPassword, myFirmName, defaultEmail } = require("./config");
const { getMailtoLinks } = require("./links");

const app = express();
const PORT = process.env.PORT || 4200;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(bulmaCSS("/default.css"));
app.use(express.json());
app.set("layout", "./layouts/index")
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "..", "views"));

app.get("/", async (request, response) => {
  const contacts = await storage.getItem("defenseAttyData");
  // const cases = await getMailtoLinks(casesData, contacts);
  response.render("cases", {
    title:
      `Lex Machina API: Cases where ${myFirmName} represents the defendant`,
    cases: casesData,
  });
});

app.get("/contacts", async (request, response) => {
  const contacts = await storage.getItem("defenseAttyData");
  response.render("contacts", {
    title: `Lex Machina API: ${myFirmName} attorney contacts`,
    contacts,
  });
});

app.post("/contacts", async (request, response) => {
  const defenseAttyData = await storage.getItem("defenseAttyData");
  Object.entries(request.body).forEach(([key, value]) => {
    const a = defenseAttyData.find((a) => a.attorneyId === parseInt(key));
    a["email"] = value;
  });
  await storage.setItem('defenseAttyData', defenseAttyData);
  response.send(200);
});

app.get("/send-alerts", async (request, response) => {
  let transporter = nodemailer.createTransport({
    host: emailHost,
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  const defenseAttyData = await storage.getItem("defenseAttyData");

  casesData.forEach((data) => {
    const contacts = data.defendantAttorney.reduce((agg, next) => {
      const contact = defenseAttyData.find(
        (a) => a.attorneyId === next.attorneyId && a.hasOwnProperty("email")
      );
      if (contact) agg.push(`${contact.name} <${contact.email}>`);
      return agg;
    }, []);
    if (contacts.length > 0) {
      ejs
        .renderFile("views/emails/default.ejs", { myFirmName, ...data })
        .then((html) => ({
          from: `${myFirmName} <${defaultEmail}>`,
          to: contacts.join(", "),
          subject:
            "Early Case Assessor and Judge Analytics for Recent Defense Appearance - Legal Analytics results",
          text: "",
          html: html,
        }))
        .then((message) => {
          transporter.sendMail(message, (err, info) => {
            if (err) {
              console.log("Error occurred. " + err.message);
            }
            console.log("Message sent: %s", info.messageId);
          });
        });
    }
  });
  response.send(200);
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
