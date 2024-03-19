const express = require("express");
const router = express.Router();

const {getUsersCount, getActiveSubscriptions, getBalancesTotal, getTotalSalesForToday, getTotalSalesForThisWeek, getTotalSalesForThisMonth} = require("../mysql/queries/metricsQueries")

const handleResponse = (res, error, result) => {
  if (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    return;
  }
  res.json(result);
};

router.get("/users-count", (req, res) => {
    getUsersCount((error, result) => {
        handleResponse(res, error, result);
    })
});

router.get("/active-subscriptions-count", (req, res) => {
    getActiveSubscriptions((error, result) => {
        handleResponse(res, error, result);
    })
});

router.get("/stock-balances", (req, res) => {
    getBalancesTotal((error, result) => {
        handleResponse(res, error, result);
    })
});

router.get("/revenue-today", (req, res) => {
    getTotalSalesForToday((error, result) => {
        handleResponse(res, error, result);
    })
});

router.get("/revenue-this-week", (req, res) => {
    getTotalSalesForThisWeek((error, result) => {
        handleResponse(res, error, result);
    })
});

router.get("/revenue-this-month", (req, res) => {
    getTotalSalesForThisMonth((error, result) => {
        handleResponse(res, error, result);
    })
});

module.exports = router;
