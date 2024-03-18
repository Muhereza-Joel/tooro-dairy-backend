const express = require("express");
const router = express.Router();

const {addSubscription, getUserSubscriptions, getAllSubscriptions, deleteSubscription} = require('../mysql/queries/salesQueries')

const handleResponse = (res, error, result) => {
  if (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    return;
  }
  res.json(result);
};

router.post("/add", (req, res) => {
  const {
    discountAmount,
    endDate,
    startDate,
    productId,
    quantity,
    salesPlan,
    taxAmount,
    total,
    unitPrice,
    userId,
  } = req.body;

  const subscription = {
    startDate : startDate,
    endDate : endDate,
    salesPlan : salesPlan,
    unitPrice : unitPrice,
    total : total,
    taxAmount : taxAmount,
    discountAmount : discountAmount,
    quantity : quantity,
    productId : productId,
    userId : userId,
  }

  addSubscription(subscription, (error, result) => {
    handleResponse(res, error, result);
  });
});

router.get("/subscription/:id", (req, res) => {
    const id = req.params.id;

    getUserSubscriptions(id, (error, result) => {
        handleResponse(res, error, result);
    })
})

router.get("/all", (req, res) => {
    getAllSubscriptions((error, result) => {
        handleResponse(res, error, result);
    })
})

router.delete("/subscription/:id", (req, res) => {
    const id = req.params.id;
    deleteSubscription(id, (error, result) => {
        handleResponse(res, error,result);
    })
})

module.exports = router;
