import { getCasesFirmForDefendant, sortByFilingDate } from "./ingest";
import getAllLinks from "./links";
import templates from "./template";

window.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("content");
  getCasesFirmForDefendant().then((cases) => {
    element.innerHTML = cases
      .sort(sortByFilingDate)
      .map((districtCase) => ({
        ...districtCase,
        links: getAllLinks(districtCase),
        contact: districtCase.defendantAttorney,
      }))
      .reduce((content, next) => `${content}\n${templates.caseItem(next)}`, "");
  });
});
