import urlJoin from "url-join";
import root from "window-or-global";
let envVars = root.env || {};

// envVars.EXAMPLE_MAIN_URL = `${root.location.protocol}//${root.location.hostname}`;
envVars.EXAMPLE_MAIN_URL = `${root.location.protocol}//${root.location.hostname}:${root.location.port}`;

if (
  root &&
  root.process &&
  root.process.env &&
  root.process.NODE_ENV === "test"
) {
  envVars.EXAMPLE_MAIN_URL = "https://api.xyz.com";
}

const Endpoints = {
  GET_ALL_APPLICATIONS() {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, "/api/v1.0/applications");
  },
  CRETE_OAUTH() {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, "/api/v1.0/oauth/create");
  },
  EXIST_OAUTH_ACCOUNT(application_id) {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, `/api/v1.0/oauth/isAuthenticated/${application_id}`);
  },
  GET_ALL_CUSTOMERS() {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, "/api/v1.0/customer/list");
  },
  GET_CUSTOMER_DETAILS() {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, "/api/v1.0/customer/detail");
  },
  SYNC_CUSTOMER_DETAILS(application_id, sync_id) {
    return urlJoin(
      envVars.EXAMPLE_MAIN_URL,
      `/api/v1.0/customer/sync/${application_id}/${sync_id}`
    );
  },
};

export default Endpoints;
