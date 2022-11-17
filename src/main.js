const getCasesFirmForDefendant = require("./ingest");
const getAllLinks = require("./links");
const { printAlertByCase } = require("./email");

(function () {
  getCasesFirmForDefendant()
    .then((cases) =>
      cases.map((districtCase) => ({
        contact: districtCase.defendantAttorney,
        links: getAllLinks(districtCase),
        meta: districtCase.caseMeta,
      }))
    )
    .then((cases) =>
      cases.forEach(({ contact, links, meta }) => printAlertByCase(contact, meta, links))
    );
})();































