const express = require("express");
const { getCasesFirmForDefendant, sortByFilingDate } = require("./ingest");
const templates = require("./template");
const getAllLinks = require("./links");

const app = express();
const PORT = process.env.PORT || 4200;
const casesDataFromAPI = [];

app.get("/", (request, response) => {
    const content = casesDataFromAPI.reduce((content, next) => (`${content}\n${templates.caseItem(next)}`), "");
    response.send(templates.base(content));
});

app.listen(PORT, async () => {
  console.log("Acquiring data from LexMachina API...");
  const cases = await getCasesFirmForDefendant();
  console.log("Done.");
  casesDataFromAPI.push(...cases
    .sort(sortByFilingDate)
    .map((districtCase) => ({
      ...districtCase,
      links: getAllLinks(districtCase),
      contact: districtCase.defendantAttorney,
    })));
  console.log(`Server started on port ${PORT}`);
});
