const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const healthzRouter = require("./routes/healthz.router");
const fdkExtension = require("./fdk");
const app = express();
const config = require("./config");
const { getCompanyData } = require("./routes/odoo.authenticate");
const v1Router = require("./routes/v1.router");
const fyndRouter = require("./routes/fyndOauth.router");
const customerRouter = require("./routes/customers.router");

app.use(cookieParser("ext.session"));
app.use(
  bodyParser.json({
    limit: "2mb",
  })
);

app.get("/env.js", (req, res) => {
  const commonEnvs = {
    base_url: config.extension.base_url,
  };
  res.type("application/javascript");
  res.send(`window.env = ${JSON.stringify(commonEnvs, null, 4)}`);
});
app.use("/", healthzRouter);
app.use(express.static(path.resolve(__dirname, "../build/")));
app.use(
  "/bindings/product-highlights",
  express.static(path.join(__dirname, "../bindings/dist"))
);
app.use("/", fdkExtension.fdkHandler);

// platform routes
const apiRoutes = fdkExtension.apiRoutes;
app.use("/api", apiRoutes);
apiRoutes.use("/v1.0", v1Router);
apiRoutes.use("/v1.0", fyndRouter);
apiRoutes.use("/v1.0", customerRouter);

// application routes
const applicationProxyRoutes = fdkExtension.applicationProxyRoutes;
app.use("/app", applicationProxyRoutes);

app.get("/company/:company_id", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build/index.html"));
});

app.get("*", (req, res) => {
  res.contentType("text/html");
  res.sendFile(path.resolve(__dirname, "../build/index.html"));
});

app.use(async (req, res, next) => {
  const company_id = req.body.company_id
    ? req.body.company_id
    : req.fdkSession.company_id;

  await getCompanyData(company_id);
  next(); // Call the next middleware function
});

// webhook handler
app.post("/api/webhooks", async function (req, res) {
  try {
    await fdkExtension.webhookRegistry.processWebhook(req);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(`Error Processing ${req.body.event.name} Webhook`);
    return res.status(500).json({ success: false });
  }
});

module.exports = app;
