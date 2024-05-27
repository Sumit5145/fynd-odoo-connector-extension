const { CustomerRecord } = require("../db/mongo");
const companyData = require("../globals");

// Create a customer
function createCustomer(userId, customerData) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "res.partner",
        "create",
        [customerData],
      ],
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
function readCustomer(userId, fyndId) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "res.partner",
        "search_read",
        [[["x_fynd_id", "=", fyndId]]],
      ],
      (error, customerInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(customerInfo);
        }
      }
    );
  });
}

// List a customer
function listCustomer(userId) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "res.partner",
        "search_read",
        [[]],
        {
          fields: [
            "name",
            "email",
            "phone",
            "street",
            "street2",
            "city",
            "mobile",
            "type",
            "zip",
            "x_fynd_id",
          ],
        },
      ],
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
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "res.partner",
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
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "res.partner",
        "unlink",
        [[customerId]],
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

// Create a custom field
function createCustomField(userId, modelId) {
  const fieldData = {
    name: "x_fynd_id",
    field_description: "Fynd Id",
    readonly: true,
    related: false,
    required: false,
    compute: false,
    copied: true,
    depends: false,
    ttype: "char",
    size: 60,
    model_id: modelId,
  };

  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "ir.model.fields",
        "create",
        [fieldData],
      ],
      (error, fieldId) => {
        if (error) {
          reject(error);
        } else {
          resolve(fieldId);
        }
      }
    );
  });
}

function readCustomFied(userId) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "ir.model.fields",
        "search_read",
        [[["name", "=", "x_fynd_id"]]],
      ],
      (error, fieldInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(fieldInfo);
        }
      }
    );
  });
}

function readModel(userId) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "ir.model",
        "search_read",
        [[["model", "=", "res.partner"]]],
      ],
      (error, modelInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(modelInfo[0].id);
        }
      }
    );
  });
}

function readState(userId, stateName) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "res.country.state",
        "search_read",
        [["&", ["country_id", "=?", false], ["name", "ilike", stateName]]],
      ],
      (error, stateInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(stateInfo[0]);
        }
      }
    );
  });
}

async function insetUpdateCustomer(
  sync_id,
  company_id,
  application_id,
  odooId,
  fyndId
) {
  return new Promise(async (resolve, reject) => {
    const existingCustomer = await CustomerRecord.findOne({
      fynd_id: fyndId,
    });
    
    if (!existingCustomer) {
      const newCustomer = {
        company_id: existingCustomer.company_id,
        application_id: existingCustomer.application_id,
        fynd_id: existingCustomer.fynd_id,
        firstName: existingCustomer.firstName,
        lastName: existingCustomer.lastName,
        email: existingCustomer.email[0],
        phone: existingCustomer.phone[0],
        status: existingCustomer.status,
        odoo_id: odooId,
      };
      //   const combinedObj = { ...newCustomer, ...customerObject };

      await new CustomerRecord(newCustomer).save();
      resolve("create");
    } else {
      const filter = { fynd_id: existingCustomer.fynd_id }; // Replace with your filter criteria
      const updateDocument = {
        $set: {
          company_id: existingCustomer.company_id,
          application_id: existingCustomer.application_id,
          fynd_id: existingCustomer.fynd_id,
          firstName: existingCustomer.firstName,
          lastName: existingCustomer.lastName,
          email: existingCustomer.email[0],
          phone: existingCustomer.phone[0],
          status: existingCustomer.status,
          odoo_id: odooId,
        },
      };
      //   const combinedObj = { ...updateDocument, ...customerObject };

      await CustomerRecord.updateOne(filter, updateDocument);
      resolve("update");
    }
  });
}

module.exports = {
  readCustomFied,
  readModel,
  createCustomField,
  readCustomer,
  createCustomer,
  updateCustomer,
  insetUpdateCustomer,
  readState,
};
