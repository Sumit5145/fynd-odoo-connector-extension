let company_id = null;
let tab_active = null;

export const setCompany = (companyId) => {
  company_id = companyId;
};

export const getCompany = () => {
  return company_id;
};

export const setTabActive = (tabActive) => {
  tab_active = tabActive;
};

export const getTabActive = () => {
  return tab_active;
};
