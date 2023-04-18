const { getCasesFirmForDefendant } = require("./ingest");
const { getAllLinks } = require("./links");


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
      cases.forEach(({ contact, links, meta }) => console.log(contact, meta, links))
    );
})();































