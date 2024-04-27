const pool = require("../databaseConnection");
const { v4: uuidv4 } = require("uuid");

const getCustomerOrders = (userId, callback) => {
  const query = `SELECT o.id, pr.fullname, pi.url, pr.phone_number,  p.product_name, o.sales_plan, o.quantity, o.unit_price, o.tax_amount, o.discount_amount, o.total, o.status, o.user_id, o.created_at, o.updated_at
                  FROM profiles pr
                  LEFT JOIN profile_images pi
                  ON pr.user_id = pi.user_id
                  JOIN orders o
                  ON pr.user_id = o.user_id
                  JOIN products p 
                  ON o.product_id = p.id 
                  WHERE o.user_id = ?
                  ORDER BY o.created_at DESC`;

  pool.query(query, [userId], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};

const getOrders = (callback) => {
  const query = `SELECT o.id, pr.fullname, pi.url, pr.phone_number,  p.product_name, o.sales_plan, o.quantity, o.unit_price, o.tax_amount, o.discount_amount, o.total, o.status, o.user_id, o.created_at, o.updated_at
                  FROM profiles pr
                  LEFT JOIN profile_images pi
                  ON pr.user_id = pi.user_id
                  JOIN orders o
                  ON pr.user_id = o.user_id
                  JOIN products p 
                  ON o.product_id = p.id 
                  ORDER BY o.created_at DESC`;

  pool.query(query, [], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};

const addOrderRecord = (saleRecord, callback) => {
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

  const values = [
    saleId,
    productId,
    salesPlan,
    quantity,
    unitPrice,
    taxAmount,
    discountAmount,
    total,
    userId,
  ];

  const query = `INSERT INTO orders(id, product_id, sales_plan, quantity, unit_price, tax_amount, discount_amount, total, user_id)
                  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(query, values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      pool.query(
        "SELECT * FROM orders WHERE id = ?",
        [saleId],
        (error, selectResults) => {
          callback(error, selectResults[0]);
        }
      );
    }
  });
};

const deleteOrderRecord = (recordId, callback) => {
  pool.query("DELETE FROM orders WHERE id = ?", [recordId], (error, result) => {
    callback(error, recordId);
  });
};

const updateOrderRecord = (recordId, data, callback) => {};

module.exports = {
  deleteOrderRecord,
  updateOrderRecord,
  getOrders,
  addOrderRecord,
  getCustomerOrders
};
