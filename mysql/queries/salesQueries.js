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

const getSales = (callback) => {
  const query = `SELECT s.id, pr.fullname, pr.phone_number,  p.product_name, s.sales_plan, s.quantity, s.unit_price, s.tax_amount, s.discount_amount, s.total, s.created_at, s.updated_at
                  FROM profiles pr
                  JOIN sales s 
                  ON pr.user_id = s.user_id
                  JOIN products p 
                  ON s.product_id = p.id`;

  pool.query(query, [], (error, results) => {
    if(error){
      callback(error, null)
    } else {
      callback(null, results);
    }
  })
};

const addSaleRecord = (saleRecord, callback) => {
  const {
    saleId,
    productId,
    salesPlan,
    quantity,
    unitPrice,
    taxAmount,
    discountAmount,
    total,
    userId,
  } = saleRecord;

  const values = [saleId, productId, salesPlan, quantity, unitPrice, taxAmount, discountAmount, total, userId];

  const query = `INSERT INTO sales(id, product_id, sales_plan, quantity, unit_price, tax_amount, discount_amount, total, user_id)
                  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(query, values, (error, result) => {
    if(error){
      callback(error, null);
    } else {
      pool.query(
        "SELECT * FROM sales WHERE id = ?",
        [saleId],
        (error, selectResults) => {
          callback(error, selectResults[0]);
        }
      );
    }
  })                
}

const deleteSaleRecord = (recordId, callback) => {
  pool.query("DELETE FROM sales WHERE id = ?", [recordId], (error, result) => {
    callback(error, recordId);
  });
};

const updateSaleRecord = (recordId, data, callback) => {};

module.exports = {
  getSaleSettingsDetails,
  deleteSaleRecord,
  updateSaleRecord,
  getSales,
  updateSalesSettings,
  getSalesSettings,
  addSaleRecord,
};
