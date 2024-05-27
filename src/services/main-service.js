import URLS from "./endpoint.service";
import axios from "axios";
import { getCompany } from "../helper/utils";

axios.interceptors.request.use((config) => {
  config.headers["x-company-id"] = getCompany();
  return config;
});

const MainService = {
  getAllApplications(params = {}) {
    return axios.get(URLS.GET_ALL_APPLICATIONS());
  },
  createOauth(data) {
    return axios.post(URLS.CRETE_OAUTH(), data);
  },
  existOauthAccount(application_id) {
    return axios.post(URLS.EXIST_OAUTH_ACCOUNT(application_id));
  },
  getAllCustomers(pageNumber, pageSize, field, order) {
    return axios.get(URLS.GET_ALL_CUSTOMERS(), {
      params: { pageNumber, pageSize, field, order },
    });
  },
  getCustomersDetails(id) {
    return axios.get(URLS.GET_CUSTOMER_DETAILS(), {
      params: { id },
    });
  },
  syncCustomersDetail(application_id, sync_id) {
    return axios.post(URLS.SYNC_CUSTOMER_DETAILS(application_id, sync_id));
  },
};

export default MainService;
