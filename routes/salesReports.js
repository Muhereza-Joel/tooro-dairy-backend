const express = require('express');
const router = express.Router();

const { getSalesData, getWeeklySalesData, getMonthlySalesData, getSalesDataWithDates } = require('../mysql/queries/salesReportQueries');

const handleResponse = (res, error, result) => {
    if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
    }
    res.json(result);
};


router.get('/daily', (req, res) => {
    const { productName, salesPlan } = req.query;
    getSalesData(productName, salesPlan, (error, result) => {
        handleResponse(res, error, result);
    });
});

router.get('/weekly', (req, res) => {
    const { productName, salesPlan } = req.query;
    getWeeklySalesData(productName, salesPlan, (error, result) => {
        handleResponse(res, error, result);
    });
});

router.get('/monthly', (req, res) => {
    const { productName, salesPlan } = req.query;
    getMonthlySalesData(productName, salesPlan, (error, result) => {
        handleResponse(res, error, result);
    });
});

router.get('/custom', (req, res) => {
    const { startDate, endDate, productName, salesPlan } = req.query;
    getSalesDataWithDates(startDate, endDate, productName, salesPlan, (error, result) => {
        handleResponse(res, error, result);
    });
});



module.exports = router;
