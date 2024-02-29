const pool = require("../databaseConnection");

const getSalesData = (productName, salesPlan, callback) => {
    pool.getConnection((connectionError, connection) => {
        if (connectionError) {
            callback(connectionError, null);
            return;
        }

        connection.query('CALL GetSalesDataForToday(?, ?)',[productName, salesPlan], (queryError, result) => {
            connection.release();

            if (queryError) {
                callback(queryError, null);
                return;
            }

            callback(null, result[0]);
        });
    });
};


const getWeeklySalesData = (productName, salesPlan, callback) => {
    pool.getConnection((connectionError, connection) => {
        if (connectionError) {
            callback(connectionError, null);
            return;
        }

        connection.query('CALL GetWeeklySalesData(?, ?)',[productName, salesPlan], (queryError, result) => {
            connection.release();

            if (queryError) {
                callback(queryError, null);
                return;
            }

            callback(null, result[0]);
        });
    });
};

const getMonthlySalesData = (productName, salesPlan, callback) => {
    pool.getConnection((connectionError, connection) => {
        if (connectionError) {
            callback(connectionError, null);
            return;
        }

        connection.query('CALL GetMonthlySalesData(?, ?)',[productName, salesPlan], (queryError, result) => {
            connection.release();

            if (queryError) {
                callback(queryError, null);
                return;
            }

            callback(null, result[0]);
        });
    });
};


const getSalesDataWithDates = (startDate, endDate, productName, salesPlan, callback) => {
    pool.getConnection((connectionError, connection) => {
        if (connectionError) {
            callback(connectionError, null);
            return;
        }

        connection.query('CALL GetSalesDataWithDates(?, ?, ?, ?)', [startDate, endDate, productName, salesPlan], (queryError, result) => {
            connection.release();

            if (queryError) {
                callback(queryError, null);
                return;
            }

            callback(null, result[0]);
        });
    });
};

module.exports = { getSalesData, getWeeklySalesData, getMonthlySalesData, getSalesDataWithDates };
