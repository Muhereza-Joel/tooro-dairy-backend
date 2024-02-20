const express = require("express");
const router = express.Router();
const {
  getSalesSettings,
  updateSalesSettings,
  getSaleSettingsDetails
} = require("../mysql/queries/salesQueries");

router.get("/sales-settings", (req, res) => {
  try {
    getSalesSettings((error, results) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/sales-settings/:id", (req, res) => {
  try {
    const id = req.params.id;

    getSaleSettingsDetails(id, (error, results) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/sales-settings/:id", (req, res) => {
  try {
    const id = req.params.id;
    const { description, discount, taxRate } = req.body;
    const data = {
      description: description,
      discount: discount,
      taxRate: taxRate,
    };

    updateSalesSettings(id, data, (error, result) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
