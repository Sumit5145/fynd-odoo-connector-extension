const xmlrpc = require("xmlrpc");
const CryptoJS = require("crypto-js");
const { OauthOdooRecord } = require("../db/mongo");
const companyData = require("../globals");
const secretKey = process.env.CRYPTO_SECRETKEY; // Make sure to use a strong password

function authenticate(odooUrl, db, username, password) {
  const odooClientCommon = xmlrpc.createClient({
    url: `${odooUrl}/xmlrpc/2/common`,
  });

  return new Promise((resolve, reject) => {
    odooClientCommon.methodCall(
      "authenticate",
      [db, username, password, {}],
      (error, userId) => {
        if (error) {
          reject(error);
        } else {
          resolve(userId);
        }
      }
    );
  });
}

function encrypt(text) {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();

  return encrypted;
}

function decrypt(text) {
  const decrypted = CryptoJS.AES.decrypt(text, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  return decrypted;
}

async function getCompanyData(company_id) {
  const existing = await OauthOdooRecord.findOne({ company_id });
  if (existing) {
    companyData.companyId = company_id;
    companyData.odooUrl = existing.odoo_url;
    companyData.db = existing.odoo_db_name;
    companyData.username = existing.odoo_userName;
    companyData.password = decrypt(existing.odoo_password);
    companyData.odooClientCommon = xmlrpc.createClient({
      url: `${existing.odoo_url}/xmlrpc/2/common`,
    });
    companyData.odooClientObject = xmlrpc.createClient({
      url: `${existing.odoo_url}/xmlrpc/2/object`,
    });
    companyData.applicationIrd = existing.application_id;
  }

  return companyData;
}

module.exports = {
  authenticate,
  encrypt,
  decrypt,
  getCompanyData,
};
