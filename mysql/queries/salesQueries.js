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
    if (error) {
      callback(error, null);
    } else {
      callback(null, result[0]);
    }
  });
};

const getSales = (callback) => {
  const query = `SELECT s.id, pr.fullname, pi.url, pr.phone_number,  p.product_name, s.sales_plan, s.quantity, s.unit_price, s.tax_amount, s.discount_amount, s.total, s.created_at, s.updated_at
                  FROM profiles pr
                  JOIN profile_images pi
                  ON pr.user_id = pi.user_id
                  JOIN sales s 
                  ON pr.user_id = s.user_id
                  JOIN products p 
                  ON s.product_id = p.id 
                  ORDER BY s.created_at DESC`;

  pool.query(query, [], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
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

  const query = `INSERT INTO sales(id, product_id, sales_plan, quantity, unit_price, tax_amount, discount_amount, total, user_id)
                  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(query, values, (error, result) => {
    if (error) {
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
  });
};

const deleteSaleRecord = (recordId, callback) => {
  pool.query("DELETE FROM sales WHERE id = ?", [recordId], (error, result) => {
    callback(error, recordId);
  });
};

const updateSaleRecord = (recordId, data, callback) => {};

const addSubscription = (subscription, callback) => {
  const id = uuidv4();
  const queryUpdateActiveSubscriptions = `
    UPDATE subscriptions SET active = 0 WHERE user_id = ? AND active = 1
  `;
  const queryInsertSubscription = `
    INSERT INTO subscriptions(id, start_date, end_date, sales_plan, unit_price, total, tax_amount, discount_amount, quantity, product_id, user_id, active)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valuesUpdateActiveSubscriptions = [subscription.userId];
  const valuesInsertSubscription = [
    id,
    subscription.startDate,
    subscription.endDate,
    subscription.salesPlan,
    subscription.unitPrice,
    subscription.total,
    subscription.taxAmount,
    subscription.discountAmount,
    subscription.quantity,
    subscription.productId,
    subscription.userId,
    1, // Set active to 1 for the new subscription (active)
  ];

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
      return;
    }

    connection.beginTransaction((beginErr) => {
      if (beginErr) {
        connection.release();
        callback(beginErr, null);
        return;
      }

      connection.query(queryUpdateActiveSubscriptions, valuesUpdateActiveSubscriptions, (updateError) => {
        if (updateError) {
          return connection.rollback(() => {
            connection.release();
            callback(updateError, null);
          });
        }

        connection.query(queryInsertSubscription, valuesInsertSubscription, (insertError, result) => {
          if (insertError) {
            return connection.rollback(() => {
              connection.release();
              callback(insertError, null);
            });
          }

          connection.commit((commitErr) => {
            if (commitErr) {
              return connection.rollback(() => {
                connection.release();
                callback(commitErr, null);
              });
            }

            connection.release();
            callback(null, { message: "Subscription Added" });
          });
        });
      });
    });
  });
};


const getUserSubscriptions = (recordId, callback) => {
  const query = "SELECT * FROM subscriptions WHERE id = ?";
  pool.query(query, [recordId], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result[0]);
    }
  });
};

const getAllSubscriptions = (callback) => {
  const query = "SELECT * FROM subscriptions";
  pool.query(query, [], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const deleteSubscription = (recordId, callback) => {
  const query = "DELETE FROM subscriptions WHERE id = ?";
  pool.query(query, [recordId], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, {message: "Record deleted successfully", id:recordId});
    }
  });
};

module.exports = {
  getSaleSettingsDetails,
  deleteSaleRecord,
  updateSaleRecord,
  getSales,
  updateSalesSettings,
  getSalesSettings,
  addSaleRecord,
  addSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  deleteSubscription
};
