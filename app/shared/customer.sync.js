const { OauthOdooRecord, CustomerRecord } = require("../db/mongo");
const {
  authenticate,
  decrypt,
  getCompanyData,
} = require("../routes/odoo.authenticate");
const {
  readCustomFied,
  readModel,
  createCustomField,
  readCustomer,
  createCustomer,
  updateCustomer,
  insetUpdateCustomer,
} = require("./odoo_customer.function");

const syncCustomer = async (req, res) => {
  try {
    const company_id = req.fdkSession.company_id;
    const { sync_id, application_id } = req.params;
    const _id = sync_id;

    const existing = await OauthOdooRecord.findOne({ company_id });

    if (existing) {
      await getCompanyData(company_id);
      const getCustomer = await CustomerRecord.findOne({
        company_id,
        _id,
        application_id,
      });

      if (getCustomer) {
        const customerData = {
          name: getCustomer?.firstName + " " + getCustomer?.lastName,
          email: getCustomer?.email[0],
          phone: getCustomer?.phone[0],
          mobile: getCustomer?.phone[1],
          x_fynd_id: getCustomer?.fynd_id.toString(),
        };

        const userId = await authenticate(
          existing.odoo_url,
          existing.odoo_db_name,
          existing.odoo_userName,
          decrypt(existing.odoo_password)
        );

        const existingField = await readCustomFied(userId);

        if (existingField.length === 0) {
          const modelId = await readModel(userId);

          await createCustomField(userId, modelId);
        }

        const customerList = await readCustomer(
          userId,
          getCustomer?.fynd_id.toString()
        );

        if (customerList.length === 0) {
          const createdData = await createCustomer(userId, customerData);
          if (createdData) {
            await insetUpdateCustomer(
              sync_id,
              company_id,
              application_id,
              createdData,
              getCustomer?.fynd_id
            );
            return res.status(200).send({
              status: "success",
              statusCode: 200,
            });
          } else {
            return res
              .status(400)
              .send("error", "Failure to update customers.");
          }
        } else {
          const updateData = await updateCustomer(
            userId,
            customerList[0].id,
            customerData
          );

          if (updateData) {
            const dataCustomer = await insetUpdateCustomer(
              sync_id,
              company_id,
              application_id,
              customerList[0].id,
              getCustomer?.fynd_id
            );

            if (dataCustomer) {
              return res.status(200).send({
                status: "success",
                statusCode: 200,
              });
            }
          } else {
            return res
              .status(400)
              .send("error", "Failure to update customers.");
          }
        }
      } else {
        return res.status(400).send("error", "Failure sync customer.");
      }
    } else {
      return res.status(400).send("error", "Company not found.");
    }
  } catch (err) {
    return res.status(400).send("error", err.message);
  }
};

// const syncCustomer = async (req, res) => {
//   try {
//     const company_id = req.fdkSession.company_id;
//     const { sync_id, application_id } = req.params;
//     const _id = sync_id;
//     const existing = await OauthOdooRecord.findOne({ company_id });

//     if (!existing) {
//       return res
//         .status(400)
//         .send({ status: "error", message: "Company not found." });
//     }

//     await getCompanyData(company_id);
//     const getCustomer = await CustomerRecord.findOne({
//       company_id,
//       _id,
//       application_id,
//     });

//     if (!getCustomer) {
//       return res
//         .status(400)
//         .send({ status: "error", message: "Failure sync customer." });
//     }

//     const customerData = {
//       name: `${getCustomer?.firstName} ${getCustomer?.lastName}`,
//       email: getCustomer?.email[0],
//       phone: getCustomer?.phone[0],
//       mobile: getCustomer?.phone[1],
//       x_fynd_id: getCustomer?.fynd_id.toString(),
//     };

//     const userId = await authenticate(
//       existing.odoo_url,
//       existing.odoo_db_name,
//       existing.odoo_userName,
//       decrypt(existing.odoo_password)
//     );

//     const existingField = await readCustomFied(userId);
//     if (existingField.length === 0) {
//       const modelId = await readModel(userId);
//       await createCustomField(userId, modelId);
//     }

//     const customerList = await readCustomer(
//       userId,
//       getCustomer?.fynd_id.toString()
//     );

//     if (customerList.length === 0) {
//       const createdData = await createCustomer(userId, customerData);
//       if (createdData) {
//         await insetUpdateCustomer(
//           sync_id,
//           company_id,
//           application_id,
//           createdData,
//           getCustomer?.fynd_id
//         );
//         return res.status(200).send({ status: "success", statusCode: 200 });
//       } else {
//         return res
//           .status(400)
//           .send({ status: "error", message: "Failure to update customers." });
//       }
//     } else {
//       const updateData = await updateCustomer(
//         userId,
//         customerList[0].id,
//         customerData
//       );
//       if (updateData) {
//         const dataCustomer = await insetUpdateCustomer(
//           sync_id,
//           company_id,
//           application_id,
//           customerList[0].id,
//           getCustomer?.fynd_id
//         );
//         if (dataCustomer) {
//           return res.status(200).send({ status: "success", statusCode: 200 });
//         }
//       } else {
//         return res
//           .status(400)
//           .send({ status: "error", message: "Failure to update customers." });
//       }
//     }
//   } catch (err) {
//     return res.status(400).send({ status: "error", message: err.message });
//   }
// };

module.exports = { syncCustomer };
