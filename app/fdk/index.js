const { setupFdk } = require("fdk-extension-javascript/express");
const { RedisStorage } = require("fdk-extension-javascript/express/storage");
const config = require("../config");
const { appRedis } = require("./../common/redis.init");
const {
  customerCreateUpdateHandler,
  addressUpdateHandler,
} = require("../webhooks/odoo.customers");
console.log("🚀 ---------------------🚀");
console.log("🚀 ~ api_key:", config.extension.api_key);
console.log("🚀 ---------------------🚀");
console.log("🚀 ---------------------🚀");
console.log("🚀 ~ api_secret:", config.extension.api_secret);
console.log("🚀 ---------------------🚀");
console.log("🚀 ---------------------🚀");
console.log("🚀 ~ base_url:", config.extension.base_url);
console.log("🚀 ---------------------🚀");
let fdkExtension = setupFdk({
  api_key: config.extension.api_key,
  api_secret: config.extension.api_secret,
  base_url: config.extension.base_url,

  // scopes: [
  //   "company/saleschannel",
  //   "company/application/settings",
  //   "company/order",
  // ],
  callbacks: {
    auth: async (req) => {
      // Writee you code here to return initial launch url after suth process complete
      return `${req.extension.base_url}/company/${req.query["company_id"]}`;
    },

    uninstall: async (req) => {
      // Write your code here to cleanup data related to extension
      // If task is time taking then process it async on other process.
    },
  },
  storage: new RedisStorage(appRedis, "fynd-odoo-connector-extension"), // add your prefix
  // access_mode: "online",
  access_mode: "offline",
  cluster: config.extension.fp_api_server, // this is optional (default: "https://api.fynd.com")
  webhook_config: {
    api_path: "/api/webhooks", // required
    notification_email: "rushi.fynd@gmail.com", // required
    // subscribe_on_install: false, // optional. default `true`
    // subscribed_saleschannel: "specific", // optional. default all
    event_map: {
      "application/user/create": {
        version: "1",
        handler: customerCreateUpdateHandler,
      },
      "application/user/update": {
        version: "1",
        handler: customerCreateUpdateHandler,
      },
      "application/user/delete": {
        version: "1",
        handler: () => {
          console.log("Deleted");
        },
      },
      "application/address/create": {
        version: "1",
        handler: addressUpdateHandler,
      },
      "application/address/update": {
        version: "1",
        handler: addressUpdateHandler,
      },
      "application/address/delete": {
        version: "1",
        handler: () => {
          console.log("Deleted");
        },
      },
    },
  },
});

module.exports = fdkExtension;
