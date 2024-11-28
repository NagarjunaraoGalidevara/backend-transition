const checklistRules = [
    {
      name: "Valuation Fee Paid",
      field: "isValuationFeePaid",
      condition: (data) => data.isValuationFeePaid === true,
    },
    {
      name: "UK Resident",
      field: "isUkResident",
      condition: (data) => data.isUkResident === true,
    },
    {
      name: "Risk Rating Medium",
      field: "riskRating",
      condition: (data) => data.riskRating === "Medium",
    },
    {
      name: "LTV Below 60%",
      field: "ltv",
      condition: (data) => {
        const ltv = (data.loanRequired / data.purchasePrice) * 100;
        return ltv < 60;
      },
    },
  ];
  
  module.exports = checklistRules;
  