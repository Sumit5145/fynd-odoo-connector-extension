const express = require("express");
const router = express.Router();
const { OauthOdooRecord } = require("../db/mongo");
const { authenticate, encrypt, decrypt } = require("./odoo.authenticate");

router.post("/oauth/create", async function view(req, res) {
  const company_id = req.fdkSession.company_id;
  const application_id = req.body.application_id;
  const odoo_password = req.body.password;
  const odoo_userName = req.body.userName;
  const odoo_url = req.body.odooUrl;
  const odoo_db_name = req.body.dbName;

  try {
    let data;
    const auth = await authenticate(
      odoo_url,
      odoo_db_name,
      odoo_userName,
      odoo_password
    );

    if (auth) {
      const existing = await OauthOdooRecord.findOne({
        company_id,
        application_id,
      });

      if (existing) {
        data = await OauthOdooRecord.update(existing.id, {
          company_id,
          odoo_password: encrypt(odoo_password),
          odoo_userName: req.body.userName,
          odoo_url: req.body.odooUrl,
          odoo_db_name: req.body.dbName,
          application_id,
        });
      } else {
        data = await OauthOdooRecord.create({
          company_id,
          odoo_password: encrypt(odoo_password),
          odoo_userName: req.body.userName,
          odoo_url: req.body.odooUrl,
          odoo_db_name: req.body.dbName,
          application_id,
        });
      }

      if (data) {
        res.status(200).send({
          auth: auth,
          message: "done",
        });
      }
    } else {
      res.status(400).send("Authenticated not sucessfull.");
    }
  } catch (err) {
    console.log("🚀 -------------🚀");
    console.log("🚀 ~ err:", err.message);
    console.log("🚀 -------------🚀");
    res.status(400).send("error", err.message);
  }
});

router.post("/oauth/isAuthenticated/:application_id", async (req, res) => {
  const company_id = req.fdkSession.company_id;
  const { application_id } = req.params;
  const existing = await OauthOdooRecord.findOne({
    company_id,
    application_id,
  });

  let auth;
  if (existing) {
    auth = await authenticate(
      existing.odoo_url,
      existing.odoo_db_name,
      existing.odoo_userName,
      decrypt(existing.odoo_password)
    );
    
    if (auth) {
      res.status(200).send({
        auth: auth,
        message: "Authenticated sucessfull.",
      });
    } else {
      res.status(400).send("Authenticated not sucessfull.");
    }
  } else {
    res.status(400).send("Customer data not found.");
  }
});

module.exports = router;
