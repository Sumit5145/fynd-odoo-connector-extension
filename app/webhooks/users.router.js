const express = require("express");
const xmlrpc = require("xmlrpc");
const router = express.Router();

const odooUrl = process.env.ODOO_URL;
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
const password = process.env.ODOO_PASSWORD;

// Create an XML-RPC client for common methods (authentication)
const odooClientCommon = xmlrpc.createClient({
  url: `${odooUrl}/xmlrpc/2/common`,
});

// Create an XML-RPC client for object methods (CRUD operations)
const odooClientObject = xmlrpc.createClient({
  url: `${odooUrl}/xmlrpc/2/object`,
});

// Authenticate and obtain a session ID
function authenticate(db, username, password) {
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

// Create a customer
function createCustomer(userId, customerData) {
  return new Promise((resolve, reject) => {
    odooClientObject.methodCall(
      "execute_kw",
      [db, userId, password, "res.users", "create", [customerData]],
      (error, customerId) => {
        if (error) {
          reject(error);
        } else {
          resolve(customerId);
        }
      }
    );
  });
}

// Read a customer
function readCustomer(userId, mobile) {
  return new Promise((resolve, reject) => {
    odooClientObject.methodCall(
      "execute_kw",
      [
        db,
        userId,
        password,
        "res.users",
        "search_read",
        [[["mobile", "=", mobile]]],
      ],
      (error, customerInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(customerInfo[0]);
        }
      }
    );
  });
}

// List a customer
function listCustomer(userId) {
  return new Promise((resolve, reject) => {
    odooClientObject.methodCall(
      "execute_kw",
      [db, userId, password, "res.users", "search_read", [[['is_company', '=', false]]]],
      (error, customerList) => {
        if (error) {
          reject(error);
        } else {
          resolve(customerList);
        }
      }
    );
  });
}

// Update a customer
function updateCustomer(userId, customerId, updatedCustomerData) {
  return new Promise((resolve, reject) => {
    odooClientObject.methodCall(
      "execute_kw",
      [
        db,
        userId,
        password,
        "res.users",
        "write",
        [[customerId], updatedCustomerData],
      ],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

// Delete a customer
function deleteCustomer(userId, customerId) {
  return new Promise((resolve, reject) => {
    odooClientObject.methodCall(
      "execute_kw",
      [db, userId, password, "res.users", "unlink", [[customerId]]],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

router.post("/", async (req, res, next) => {
  try {
    // Extracting data from the request
    const objectData = {
      tableName: req.body.event.name,
      type: req.body.event.type,
      companyId: req.body.company_id,
      payload: req.body.payload.company,
    };
    console.log("🚀 ---------------------------🚀")
    console.log("🚀 ~ objectData:", objectData.payload.addresses)
    console.log("🚀 ---------------------------🚀")

    
    

    // Create a customer
    const customerData = {
      name: objectData.payload.name,
      website : objectData.payload.domain,
      city : objectData.payload.addresses.city,
      zipcode: objectData.payload.addresses.pincode,
      country: objectData.payload.addresses.country,
      country:objectData.payload.addresses.country_code,
      street: objectData.payload.addresses.address1,
    };
    
    const userId = await authenticate(db, username, password);

    if (objectData.type === "create") {
      const customerID = await createCustomer(userId, customerData);
    }

    if (objectData.type === "update") {
      const customerList = await readCustomer(
        userId,
        objectData.payload.user_id
      );

      const updatedCustomerId = await updateCustomer(
        userId,
        customerList.id,
        customerData
      );
      console.log('updatedCustomerId: ', updatedCustomerId);
    }
    //const getCustomer = await listCustomer(userId);
    
    // Responding with success
    return res.status(200).json({ success: true });
  } catch (err) {
    // Handling errors
    console.error("Error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
