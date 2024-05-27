const express = require("express");
const { ProductHighlightRecord } = require("../db/mongo");
const router = express.Router();

// Get applications list
router.get("/applications", async function view(req, res, next) {
  try {
    console.log("object", req.fdkSession.company_id);
    const { platformClient } = req;
    const companyId = req.fdkSession.company_id;

    let applications = await platformClient.configuration.getApplications({
      pageSize: 1000,
      q: JSON.stringify({ is_active: true }),
    });

    return res.status(200).json(applications);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
