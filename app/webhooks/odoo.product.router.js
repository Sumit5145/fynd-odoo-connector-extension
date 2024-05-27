const express = require("express");
const router = express.Router();
const { authenticate } = require("../routes/odoo.authenticate");
const companyData = require("../globals");

// Create a product
function createProduct(userId, productData) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "product.template",
        "create",
        [productData],
      ],
      (error, productId) => {
        if (error) {
          reject(error);
        } else {
          resolve(productId);
        }
      }
    );
  });
}

// Read a product
function readProduct(userId, fyndId) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "product.template",
        "search_read",
        [[["x_fynd_id", "=", fyndId]]],
      ],
      (error, productInfo) => {
        if (error) {
          reject(error);
        } else {
          resolve(productInfo);
        }
      }
    );
  });
}

// List a product
function listProduct(userId) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "product.template",
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
      (error, productList) => {
        if (error) {
          reject(error);
        } else {
          resolve(productList);
        }
      }
    );
  });
}

// Update a product
function updateProduct(userId, productId, updatedProductData) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "product.template",
        "write",
        [[productId], updatedProductData],
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

// Delete a product
function deleteProduct(userId, productId) {
  return new Promise((resolve, reject) => {
    companyData.odooClientObject.methodCall(
      "execute_kw",
      [
        companyData.db,
        userId,
        companyData.password,
        "product.template",
        "unlink",
        [[productId]],
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
        [[["model", "=", "product.template"]]],
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

router.post("/", async (req, res, next) => {
  try {
    // Extracting data from the request
    const objectData = {
      tableName: req.body.event.name,
      type: req.body.event.type,
      companyId: req.body.company_id,
      payload: req.body.payload.product[0],
    };
    console.log("🚀 ---------------------------🚀")
    console.log("🚀 ~ objectData:", objectData.payload)
    console.log("🚀 ---------------------------🚀")

    // Create a product
    const productData = {
      name: objectData.payload.item_code,
      // email: objectData.payload.emails[0]?.email,
      // phone: objectData.payload.phoneNumbers[0]?.phone,
      // mobile: objectData.payload.phoneNumbers[1]?.phone,
      x_fynd_id: objectData.payload._id,
    };
    console.log("🚀 -----------------------------🚀")
    console.log("🚀 ~ productData:", productData)
    console.log("🚀 -----------------------------🚀")

    // const userId = await authenticate(
    //   companyData.odooUrl,
    //   companyData.db,
    //   companyData.username,
    //   companyData.password
    // );

    // const existingField = await readCustomFied(userId);

    // if (existingField.length === 0) {
    //   const modelId = await readModel(userId);

    //   await createCustomField(userId, modelId);
    // }

    // const productList = await readProduct(userId, objectData.payload.user_id);

    // if (productList.length === 0) {
    //   const createdData = await createProduct(userId, productData);
    //   if (createdData) {
    //     return res
    //       .status(200)
    //       .json({ success: true, message: "Successful product create." });
    //   } else {
    //     return res
    //       .status(400)
    //       .json({ success: false, message: "Failure to create products." });
    //   }
    // } else {
    //   const updateData = await updateProduct(
    //     userId,
    //     productList[0].id,
    //     productData
    //   );

    //   if (updateData) {
    //     return res
    //       .status(200)
    //       .json({ success: true, message: "Successful product update." });
    //   } else {
    //     return res
    //       .status(400)
    //       .json({ success: false, message: "Failure to update products." });
    //   }
    // }
  } catch (err) {
    // Handling errors
    console.error("Error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post("/address", async (req, res, next) => {
  try {
    const objectData = {
      tableName: req.body.event.name,
      type: req.body.event.type,
      companyId: req.body.company_id,
      payload: req.body.payload.address,
    };

    const userId = await authenticate(
      companyData.odooUrl,
      companyData.db,
      companyData.username,
      companyData.password
    );

    const stateData = await readState(userId, objectData.payload.state);

    const addressData = {
      city: objectData.payload.city,
      street: objectData.payload.address,
      street2: objectData.payload.area + " " + objectData.payload.landmark,
      type:
        objectData.payload.address_type === "Home"
          ? "contact"
          : objectData.payload.address_type === "Work"
          ? "other"
          : "invoice",
      zip: objectData.payload.area_code,
      state_id: stateData.id,
      country_id: stateData.country_id[0],
      partner_latitude: objectData.payload.geo_location["latitude"],
      partner_longitude: objectData.payload.geo_location["longitude"],
    };
    const productList = await readProduct(userId, objectData.payload.user_id);

    if (productList.length > 0) {
      const updatedProductId = await updateProduct(
        userId,
        productList[0].id,
        addressData
      );
      if (updatedProductId) {
        return res
          .status(200)
          .json({ success: true, message: "Successful product update." });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Failure to update products." });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Product data not found.",
      });
    }
  } catch (err) {
    // Handling errors
    console.error("Error:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
