const express = require("express");
const { getAllData, casesData, defenseAttyData } = require("./ingest");
const templates = require("./template");

const app = express();
const PORT = process.env.PORT || 4200;

app.get("/", (request, response) => {
  const content = casesData.reduce((content, next) => (`${content}\n${templates.caseItem(next)}`), "");
  response.send(templates.base(content));
});

app.get("/address-list", async (request, response) => {
  response.send('address list');
});

app.get("/autosend", (request, response) => {
  response.send('autosend');
});

app.get("/refresh", async (request, response) => {
  await getAllData();
  response.send(200)
});

app.listen(PORT, async () => {
  await getAllData();
  console.log(`Server started on port ${PORT}`);
});
