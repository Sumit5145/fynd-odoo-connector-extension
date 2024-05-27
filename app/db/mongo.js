const { ObjectId } = require("bson");
const config = require("../config");
const mongoose = require("mongoose");

// mongodb connection
mongoose.connect(config.mongodb.uri);

const OauthOdooSchema = new mongoose.Schema({
  company_id: {
    type: String,
    require: true,
  },
  application_id: {
    type: String,
    require: true,
  },
  odoo_url: {
    type: String,
    require: true,
  },
  odoo_db_name: {
    type: String,
    require: true,
  },
  odoo_userName: {
    type: String,
    require: true,
  },
  odoo_password: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const CustomerSchema = new mongoose.Schema({
  company_id: {
    type: String,
    require: true,
  },
  application_id: {
    type: String,
    require: true,
  },
  fynd_id: {
    type: ObjectId,
  },
  odoo_id: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: [String],
  },
  phone: {
    type: [String],
  },
  addressLine1: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  addressType: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  pincode: {
    type: String,
  },
  status: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const CustomerRecord = mongoose.model("Customer", CustomerSchema);
const OauthOdooRecord = mongoose.model("OauthOdoo", OauthOdooSchema);

module.exports = { OauthOdooRecord, CustomerRecord };
