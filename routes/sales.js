const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const {
  getSalesSettings,
  updateSalesSettings,
  getSaleSettingsDetails,
  addSaleRecord,
  getSales,
  deleteSaleRecord
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

router.post("/add", (req, res) => {
  try {
    const { productId, salesPlan, quantity, unitPrice, taxAmount, discountAmount, total, userId } = req.body;
  
    const saleRecord = {
      saleId : uuidv4(),
      productId : productId,
      salesPlan : salesPlan,
      quantity : quantity,
      unitPrice : unitPrice,
      taxAmount : taxAmount,
      discountAmount : discountAmount,
      total : total,
      userId : userId,
    };

    addSaleRecord(saleRecord, (error, result) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(result);
      }
    })
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.get("/all", (req, res) => {
  try {
    getSales((error, results) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(results);
      }
    })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.delete("/delete/:id", (req, res) => {
  try {
    recordId = req.params.id;

    deleteSaleRecord(recordId, (error, result) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

module.exports = router;
