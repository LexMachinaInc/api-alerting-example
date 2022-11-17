

function getAllLinks({ caseMeta: { caseId, caseType, title }, judges, plaintiffCounsel }) {
  return {
    case: { name: title, url: `https://law.lexmachina.com/cases/${caseId}` },
    judges: getJudgeLinks(judges),
    earlyCaseAssessor: invertPlaintiffCounsel(plaintiffCounsel).map((plaintiff) => getEarlyCaseAssessorLink(plaintiff, caseType)),
  };
}

function getJudgeLinks(judges) {
  return judges.map(({ federalJudgeId, magistrateJudgeId, name }) => ({
    name,
    url: `https://law.lexmachina.com/federal-court/judge/${federalJudgeId || magistrateJudgeId}`,
  }));
}

function invertPlaintiffCounsel(plaintiffLawFirm) {
  const plaintiffList = [];
  plaintiffLawFirm.forEach(({firmName, plaintiffClients}) => {
    plaintiffClients.forEach(({name}) => plaintiffList.push({ plaintiff: name, lawFirm: firmName}))
  });
  return plaintiffList;
}

function getEarlyCaseAssessorLink({plaintiff, lawFirm}, caseType) {
  const base = "https://law.lexmachina.com/apps/case-assessor/generate";
  const query = [
    `case_type=${encodeURIComponent(caseType)}`,
    `entity_name=${encodeURIComponent(plaintiff)}`,
    `law_firm_name=${encodeURIComponent(lawFirm)}`,
  ];
  return {
    name: `Early Case Assessor: ${plaintiff} represented by ${lawFirm}`,
    url: `${base}?${query.join("&")}`
  };
}

module.exports = getAllLinks;
