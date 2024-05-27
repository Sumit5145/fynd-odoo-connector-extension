const express = require("express");
const router = express.Router();
const { CustomerRecord, OauthOdooRecord } = require("../db/mongo");
const { syncCustomer } = require("../shared/customer.sync");

router.get("/customer/list", async function view(req, res) {
  const { platformClient } = req;
  const company_id = req.fdkSession.company_id;
  
  // Extract pagination parameters from the query string
  const page = parseInt(req.query.pageNumber) || 1;
  const limit = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * limit;

  const sortField = req.query.field || "_id";
  const sortOrder = req.query.order === "asc" ? 1 : -1;

  try {
    const existing = await OauthOdooRecord.findOne({ company_id });

    if (existing) {
      const getCustomerData = await platformClient
        .application(existing.application_id)
        .user.getCustomers();

      if (getCustomerData) {
        await Promise.all(
          getCustomerData.items.map(async (item) => {
            let customerObject = {};
            const getCustomerAddress = await platformClient
              .application(existing.application_id)
              .cart.getAddresses({
                userId: item.user_id,
                buyNow: false,
                isDefault: false,
              });

            if (getCustomerAddress.address.length > 0) {
              const { address } = await getCustomerAddress;
              customerObject = {
                addressLine1: address[0].address + " " + address[0].area,
                addressLine2: address[0].landmark,
                addressType: address[0].address_type,
                city: address[0].city,
                state: address[0].state,
                country: address[0].country,
                pincode: address[0].area_code,
              };
            }

            const existingCustomer = await CustomerRecord.findOne({
              fynd_id: item._id,
            });

            if (!existingCustomer) {
              const newCustomer = {
                company_id: company_id,
                application_id: item.application_id,
                fynd_id: item._id,
                firstName: item.first_name,
                lastName: item.last_name,
                email: item.emails[0]?.email,
                phone: item.phone_numbers[0]?.phone,
                status: item.status,
              };
              const combinedObj = { ...newCustomer, ...customerObject };

              await new CustomerRecord(combinedObj).save();
            } else {
              const filter = { fynd_id: item._id }; // Replace with your filter criteria
              const updateDocument = {
                $set: {
                  company_id: company_id,
                  application_id: item.application_id,
                  fynd_id: item._id,
                  firstName: item.first_name,
                  lastName: item.last_name,
                  email: item.emails[0]?.email,
                  phone: item.phone_numbers[0]?.phone,
                  status: item.status,
                },
              };
              const combinedObj = { ...updateDocument, ...customerObject };

              await CustomerRecord.updateOne(filter, combinedObj);
            }
          })
        );

        const total = await CustomerRecord.countDocuments({
          company_id: company_id,
          application_id: existing.application_id,
        });
        
        const customerData = await CustomerRecord.find({
          company_id: company_id,
          application_id: existing.application_id,
        })
          .sort({ [sortField]: sortOrder })
          .skip(skip)
          .limit(limit);

        res.status(200).send({
          data: customerData,
          page,
          limit,
          total,
          status: "success",
          statusCode: 200,
        });
      } else {
        console.log("🚀 LIST🚀🚀", err.message);
        res.status(400).send("Customer data not found.");
      }
    } else {
      console.log("🚀 LIST🚀", err.message);
      res.status(400).send("Customer data not found.");
    }
  } catch (err) {
    console.log("🚀 LIST🚀", err.message);
    res.status(400).send("error", err.message);
  }
});

router.get("/customer/detail", async function view(req, res) {
  const company_id = req.fdkSession.company_id;
  const _id = req.query.id;

  try {
    if (_id) {
      const getCustomer = await CustomerRecord.findOne({ _id, company_id });
      if (getCustomer) {
        const dataResponse = [
          { key: "ID", value: getCustomer._id },
          {
            key: "Name",
            value:
              getCustomer.firstName + " " + getCustomer.lastName
                ? getCustomer.firstName + " " + getCustomer.lastName
                : "-",
          },
          {
            key: "Email",
            value: getCustomer.email[0] ? getCustomer.email[0] : "-",
          },
          {
            key: "Phone no.",
            value: getCustomer.phone[0] ? getCustomer.phone[0] : "-",
          },
          {
            key: "Address",
            value:
              getCustomer?.addressLine1 === undefined
                ? "-"
                : getCustomer?.addressLine1 + " " + getCustomer?.addressLine2,
          },
          { key: "City", value: getCustomer.city ? getCustomer.city : "-" },
          { key: "State", value: getCustomer.state ? getCustomer.state : "-" },
          {
            key: "Country",
            value: getCustomer.country ? getCustomer.country : "-",
          },
          {
            key: "Pin Code",
            value: getCustomer.pincode ? getCustomer.pincode : "-",
          },
          {
            key: "Fynd ID",
            value: getCustomer.fynd_id ? getCustomer.fynd_id : "-",
          },
          {
            key: "Odoo ID",
            value: getCustomer.odoo_id ? getCustomer.odoo_id : "-",
          },
        ];

        res.status(200).send({
          data: dataResponse,
          status: "success",
          statusCode: 200,
        });
      } else {
        res.status(400).send("Customer data not found.");
      }
    } else {
      res.status(400).send("Customer id not found in request.");
    }
  } catch (err) {
    res.status(400).send("error", err.message);
  }
});

router.post("/customer/sync/:application_id/:sync_id", async (req, res) => {
  await syncCustomer(req, res);
});

module.exports = router;
