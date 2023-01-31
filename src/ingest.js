const {
  LexMachinaClient,
  CasesQueryRequest,
} = require("@lexmachina/lexmachina-client");
const storage = require("node-persist");
const { lawFirmId, myFirmName, startDate, defaultEmail } = require("./config");
const getAllLinks = require("./links");

const client = new LexMachinaClient("config/config.json");

const casesData = [];
const defenseAttyData = [];

function getJudgeList(districtCase) {
  return [...districtCase.judges, ...districtCase.magistrateJudges];
}

function getDefenseCounsel(districtCase) {
  return districtCase.attorneys
    .filter((attorney) => attorney.lawFirmIds.includes(lawFirmId))
    .map(({ name, attorneyId }) => ({ name, attorneyId }));
}

function getPlaintiffLawFirms(districtCase) {
  const plaintiffParties =
    districtCase.parties.filter(({ role }) => role === "Plaintiff") ?? [];
  const plaintiffPartyIds = plaintiffParties.map(({ partyId }) => partyId);
  return districtCase.lawFirms
    .filter(({ clientPartyIds }) =>
      clientPartyIds.some((partyId) => plaintiffPartyIds.includes(partyId))
    )
    .map((firm) => ({
      firmName: firm.name,
      firmId: firm.lawFirmId,
      plaintiffClients: plaintiffParties
        .filter(({ partyId }) => firm.clientPartyIds.includes(partyId))
        .map(({ name, partyId }) => ({ name, partyId })),
    }));
}

const sortByFilingDate = (current, next) =>
  current.caseMeta.filingDate === next.caseMeta.filingDate
    ? 0
    : current.caseMeta.filingDate > next.caseMeta.filingDate
    ? -1
    : 1;

async function getCasesFirmForDefendant() {
  const query = new CasesQueryRequest()
    .setDate(startDate, "filed", "onOrAfter")
    .addLawFirmsIncludeDefendant(lawFirmId);

  const cases = await client.queryDistrictCases(query, { pageThrough: true });
  const casesEnhanced = cases.map(async (caseId) => {
    const districtCase = await client.districtCases(caseId);
    return {
      judges: getJudgeList(districtCase),
      plaintiffCounsel: getPlaintiffLawFirms(districtCase),
      defendantAttorney: getDefenseCounsel(districtCase),
      caseMeta: {
        caseId: districtCase.caseId,
        caseNumber: districtCase.caseNo,
        caseType: districtCase.caseType[0],
        court: districtCase.court,
        filingDate: districtCase.dates.filed,
        title: districtCase.title,
      },
    };
  });
  return Promise.all(casesEnhanced);
}

async function getAPIData() {
  console.log("Acquiring data from LexMachina API...");

  const [cases, attorneys] = await Promise.all([
    getCasesFirmForDefendant(),
    client.searchAttorneys(myFirmName),
  ]);

  attorneys.forEach(({ attorneyId, name }) => {
    if (!defenseAttyData.some((atty) => atty.attorneyId === attorneyId)) {
      defenseAttyData.push({
        attorneyId,
        name: name.replace(/\s+\(.*\)/, ""),
        email: defaultEmail,
      });
    }
  });

  cases.sort(sortByFilingDate).forEach((_case) => {
    casesData.push({
      ..._case,
      links: getAllLinks(_case),
    });
    _case.defendantAttorney.forEach((atty) => {
      if (
        !defenseAttyData.some(
          ({ attorneyId }) => attorneyId === atty.attorneyId
        )
      ) {
        defenseAttyData.push({
          attorneyId: atty.attorneyId,
          name: atty.name,
          email: defaultEmail,
        });
      }
    });
  });

  storage.setItem("defenseAttyData", defenseAttyData);

  casesData.forEach((_case) => {
    const contact = _case.defendantAttorney.map(({ attorneyId }) => {
      return ({ name, email } = defenseAttyData.find(
        (atty) => atty.attorneyId === attorneyId
      ));
    });
    Object.assign(_case, { contact });
  });

  console.log("Done.");
  return true;
}

async function getInitialData() {
  console.log("Retrieving stored app data");
  const storedDefenseAttyData = await storage.getItem("defenseAttyData") ?? [];
  defenseAttyData.push(...storedDefenseAttyData);
  console.log("Done.");

  return await getAPIData();
}

module.exports = { casesData, defenseAttyData, getAPIData, getInitialData };
