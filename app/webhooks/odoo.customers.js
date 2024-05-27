// const express = require("express");
// const router = express.Router();
const { authenticate } = require("../routes/odoo.authenticate");
const companyData = require("../globals");
const {
  readCustomFied,
  readModel,
  createCustomField,
  readCustomer,
  createCustomer,
  updateCustomer,
} = require("../shared/odoo_customer.function");

const customerCreateUpdateHandler = async (
  eventName,
  { payload },
  companyId,
  applicationId
) => {
  try {
    // Create a customer
    const payloadData = payload[0].user;

    if (!payloadData) {
      return "ERROR";
    } else {
      const customerData = {
        name: payloadData?.firstName + " " + payloadData?.lastName,
        email: payloadData?.emails[0]?.email,
        phone: payloadData?.phoneNumbers[0]?.phone,
        mobile: payloadData?.phoneNumbers[1]?.phone,
        x_fynd_id: payloadData?._id,
      };

      const userId = await authenticate(
        companyData.odooUrl,
        companyData.db,
        companyData.username,
        companyData.password
      );

      const existingField = await readCustomFied(userId);

      if (existingField.length === 0) {
        const modelId = await readModel(userId);

        await createCustomField(userId, modelId);
      }

      const customerList = await readCustomer(userId, payloadData.user_id);

      if (customerList.length === 0) {
        const createdData = await createCustomer(userId, customerData);
        if (createdData) {
          return "Successful customer create.";
        } else {
          return "Failure to create customers.";
        }
      } else {
        const updateData = await updateCustomer(
          userId,
          customerList[0].id,
          customerData
        );

        if (updateData) {
          return "Successful customer update.";
        } else {
          return "Failure to update customers.";
        }
      }
    }
  } catch (err) {
    // Handling errors
    console.error("Error:", err.message);
    return err.message;
  }
};

const addressUpdateHandler = async (
  eventName,
  { payload },
  companyId,
  applicationId
) => {
  try {
    const payloadData = payload.address;
    console.log("🚀 -----------------------------🚀");
    console.log("🚀 ~ payloadData:", payloadData);
    console.log("🚀 -----------------------------🚀");

    if (!payloadData) {
      return "ERROR";
    } else {
      const userId = await authenticate(
        companyData.odooUrl,
        companyData.db,
        companyData.username,
        companyData.password
      );

      const stateData = await readState(userId, payloadData.state);

      const addressData = {
        city: payloadData?.city,
        street: payloadData?.address,
        street2: payloadData?.area + " " + payloadData?.landmark,
        type:
          payloadData?.address_type === "Home"
            ? "contact"
            : payloadData?.address_type === "Work"
            ? "other"
            : "invoice",
        zip: payloadData?.area_code,
        state_id: stateData.id,
        country_id: stateData.country_id[0],
      };

      const customerList = await readCustomer(userId, payloadData.user_id);

      if (customerList.length > 0) {
        const updatedCustomerId = await updateCustomer(
          userId,
          customerList[0].id,
          addressData
        );
        if (updatedCustomerId) {
          return "Successful customer update.";
        } else {
          return "Failure to update customers.";
        }
      } else {
        return "Customer data not found.";
      }
    }
  } catch (err) {
    // Handling errors
    console.error("Error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  addressUpdateHandler,
  customerCreateUpdateHandler,
};
