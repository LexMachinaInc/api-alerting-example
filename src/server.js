const express = require("express");
const getCasesFirmForDefendant = require("./ingest");
const templates = require("./template");
const getAllLinks = require("./links");

const app = express();
const PORT = process.env.PORT || 4200;
let caseDataFromAPI = {};

app.get("/", (request, response) => {
    const content = caseDataFromAPI.reduce((content, next) => (`${content}\n${templates.caseItem(next)}`), "");
    response.send(templates.base(content));
});

app.listen(PORT, async () => {
    const cases = await getCasesFirmForDefendant();
    caseDataFromAPI = cases
        .sort((current, next) => current.caseMeta.filingDate === next.caseMeta.filingDate ? 0 : current.caseMeta.filingDate > next.caseMeta.filingDate ? -1 : 1)
        .map((districtCase) => ({...districtCase, links: getAllLinks(districtCase), contact: districtCase.defendantAttorney}));
    console.log(`Server started on port ${PORT}`);
});