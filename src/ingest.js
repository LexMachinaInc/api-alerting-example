const { LexMachinaClient, CasesQueryRequest } = require("@lexmachina/lexmachina-client");

const client = new LexMachinaClient("config/config.json");
const lawFirmId = 3277;
const startDate = "2022-10-01";

function getJudgeList(districtCase) {
    return [...districtCase.judges, ...districtCase.magistrateJudges];
}

function getDefenseCounsel(districtCase) {
    return districtCase.attorneys
        .filter((attorney) => attorney.lawFirmIds.includes(lawFirmId))
        .map(({name, attorneyId}) => ({name, attorneyId}));
}

function getPlaintiffLawFirms(districtCase) {
    const plaintiffParties = districtCase.parties
        .filter(({role}) => role === "Plaintiff") ?? [];
    const plaintiffPartyIds = plaintiffParties.map(({partyId}) => (partyId));
    return districtCase.lawFirms
        .filter(({clientPartyIds}) => clientPartyIds.some((partyId) => plaintiffPartyIds.includes(partyId)))
        .map((firm) => ({
            firmName: firm.name,
            firmId: firm.lawFirmId,
            plaintiffClients: plaintiffParties
                .filter(({partyId}) => firm.clientPartyIds.includes(partyId))
                .map(({name, partyId}) => ({name, partyId})),
        }));
}

async function getCasesFirmForDefendant() {
    const query = new CasesQueryRequest()
        .setDate(startDate, "filed", "onOrAfter")
        .addLawFirmsIncludeDefendant(lawFirmId)
        .setPageSize(100);

    const cases = await client.queryDistrictCases(query);
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

module.exports = getCasesFirmForDefendant;