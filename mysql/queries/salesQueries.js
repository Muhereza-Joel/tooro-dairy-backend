const pool = require("../databaseConnection");
const { v4: uuidv4 } = require("uuid");

const getSalesSettings = (callback) => {
  pool.query(
    "SELECT * FROM  sales_plan_settings ORDER BY  sales_plan_settings.created_at DESC",
    [],
    (error, selectResults) => {
      callback(error, selectResults);
    }
  );
};

const updateSalesSettings = (id, data, callback) => { 
  const query = `UPDATE sales_plan_settings SET description = ?, discount = ?, tax_rate = ? WHERE id = ?`;
  const values = [data.description, data.discount, data.taxRate, id];
  pool.query(query, values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      pool.query(
        "SELECT * FROM sales_plan_settings WHERE id = ?",
        [id],
        (error, selectResults) => {
          callback(error, selectResults[0]);
        }
      );
    }
  });
};

const getSaleSettingsDetails = (recordId, callback) => {
    const query = "SELECT * FROM sales_plan_settings WHERE id = ?";
    pool.query(query, [recordId], (error, result) => {
        if(error){
            callback(error, null)
        }else{
            callback(null, result[0])
        }
    })
};

const getSales = (callback) => {};


const deleteSaleRecord = (recordId, callback) => {};

const updateSaleRecord = (recordId, data, callback) => {};

module.exports = {
  getSaleSettingsDetails,
  deleteSaleRecord,
  updateSaleRecord,
  getSales,
  updateSalesSettings,
  getSalesSettings,
};
