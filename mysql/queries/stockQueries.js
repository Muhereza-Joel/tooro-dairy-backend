const pool = require("../databaseConnection");

const addProduct = (product, callback) => {
  const query =
    "INSERT INTO products(id, product_name, buying_price, selling_price) VALUES(?, ?, ?, ?)";

  const values = [
    product.id,
    product.name,
    product.buyingPrice,
    product.sellingPrice,
  ];

  pool.query(query, values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      pool.query(
        "SELECT * FROM products WHERE id = ?",
        [product.id],
        (error, selectResults) => {
          callback(error, selectResults[0]);
        }
      );
    }
  });
};

const editProduct = (product, callback) => {
  const query =
    "UPDATE products SET product_name = ?, buying_price = ?, selling_price = ? WHERE id = ?";

  const values = [
    product.name,
    product.buyingPrice,
    product.sellingPrice,
    product.id,
  ];

  pool.query(query, values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      pool.query(
        "SELECT * FROM products WHERE id = ?",
        [product.id],
        (error, selectResults) => {
          callback(error, selectResults[0]);
        }
      );
    }
  });
};

const markCollectionAsPaid = (productId, callback) => {
  const query = "UPDATE stock SET amount_paid = 0, balance = 0, status = 'paid' WHERE id = ?";
  pool.query(query, [productId], (error, result) => {
    if(error){
      callback(error, null);
    } else {
      pool.query(
        "SELECT * FROM stock WHERE id = ?",
        [productId],
        (error, selectResults) => {
          callback(error, selectResults[0]);
        }
      );
    }
  })
}

const getProduct = (id, callback) => {
  pool.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (error, selectResults) => {
      callback(error, selectResults[0]);
    }
  );
};

const getProducts = (callback) => {
  pool.query(
    "SELECT * FROM products ORDER BY products.created_at DESC",
    [],
    (error, selectResults) => {
      callback(error, selectResults);
    }
  );
};

const deleteProduct = (id, callback) => {
  pool.query("DELETE FROM products WHERE id = ?", [id], (error, result) => {
    callback(error, id);
  });
};

const addCollection = (collection, callback) => {
  const {
    collectionId,
    stockPlan,
    userId,
    productId,
    quantity,
    unitPrice,
    amountPayed,
    balance,
    total,
    payed,
  } = collection;

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
      return;
    }

    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        connection.release();
        callback(beginTransactionErr);
        return;
      }

      // Update stock in products table
      const updateStockQuery = `UPDATE products SET stock = stock + ? WHERE id = ?`;

      connection.query(
        updateStockQuery,
        [quantity, productId],
        (updateStockErr, updateStockResult) => {
          if (updateStockErr) {
            connection.rollback(() => {
              connection.release();
              callback(updateStockErr);
            });
            return;
          }

          // Insert collection record in the stock table
          const insertCollectionQuery = `
          INSERT INTO stock (id, stock_plan, user_id, product_id, quantity, unit_price, amount_paid, balance, total, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

          connection.query(
            insertCollectionQuery,
            [
              collectionId,
              stockPlan,
              userId,
              productId,
              quantity,
              unitPrice,
              amountPayed,
              balance,
              total,
              payed,
            ],
            (insertCollectionErr, insertCollectionResult) => {
              if (insertCollectionErr) {
                connection.rollback(() => {
                  connection.release();
                  callback(insertCollectionErr);
                });
                return;
              }

              connection.commit((commitErr) => {
                if (commitErr) {
                  connection.rollback(() => {
                    connection.release();
                    callback(commitErr);
                  });
                } else {
                  connection.release();
                  callback(null, "Collection added successfully");
                }
              });
            }
          );
        }
      );
    });
  });
};


const getUserCollections = (userId, callback) => {
  try {
    const query = `
    SELECT s.id, products.buying_price, products.product_name, p.username, pi.url, s.stock_plan, s.amount_paid, s.quantity, s.balance, s.status, s.total, s.created_at, s.updated_at FROM stock s 
    JOIN products ON products.id = s.product_id
    JOIN profiles p ON s.user_id = p.user_id 
    LEFT JOIN profile_images pi ON pi.user_id = p.user_id 
    WHERE p.user_id = ?
    ORDER BY s.created_at DESC
    `;
    pool.query(query, [userId], (error, results) => {
      callback(error, results);
    });
  } catch (error) {
    callback(error);
  }
};

const getCollections = (callback) => {
  try {
    const query = `
    SELECT s.id, products.buying_price, products.product_name, p.username, pi.url, s.stock_plan, s.amount_paid, s.quantity, s.balance, s.status, s.total, s.created_at, s.updated_at FROM stock s 
    JOIN products ON products.id = s.product_id
    JOIN profiles p ON s.user_id = p.user_id 
    LEFT JOIN profile_images pi ON pi.user_id = p.user_id ORDER BY s.created_at DESC
    `;
    pool.query(query, [], (error, results) => {
      callback(error, results);
    });
  } catch (error) {
    callback(error);
  }
};

const updateCollection = (collectionId, updatedFields, callback) => {
  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      callback(getConnectionError);
      return;
    }

    connection.beginTransaction((beginTransactionError) => {
      if (beginTransactionError) {
        connection.release();
        callback(beginTransactionError, null);
        return;
      }

      const selectStockQuery =
        "SELECT product_id, quantity FROM stock WHERE id = ?";
      connection.query(
        selectStockQuery,
        [collectionId],
        (selectStockError, stockResults) => {
          if (selectStockError) {
            connection.rollback();
            connection.release();
            callback(selectStockError, null);
            return;
          }

          if (stockResults.length === 0) {
            connection.rollback();
            connection.release();
            callback(new Error("Stock not found"));
            return;
          }

          const { product_id, quantity } = stockResults[0];

          // Update the products table by subtracting the existing quantity
          const updateProductsQuery =
            "UPDATE products SET stock = stock - ? WHERE id = ?";
          connection.query(
            updateProductsQuery,
            [quantity, product_id],
            (updateProductsError) => {
              if (updateProductsError) {
                connection.rollback();
                connection.release();
                callback(updateProductsError, null);
                console.log("at update stock");
                return;
              }

              // Begin a new transaction to add the new quantity
              connection.beginTransaction((newTransactionError) => {
                if (newTransactionError) {
                  connection.rollback();
                  connection.release();
                  callback(newTransactionError, null);
                  return;
                }

                // Add the new quantity to the products table
                const addNewQuantityQuery =
                  "UPDATE products SET stock = stock + ? WHERE id = ?";
                connection.query(
                  addNewQuantityQuery,
                  [updatedFields.quantity, product_id],
                  (addNewQuantityError) => {
                    if (addNewQuantityError) {
                      connection.rollback();
                      connection.release();
                      callback(addNewQuantityError, null);
                      return;
                    }

                    // Commit the new transaction
                    connection.commit((commitError) => {
                      if (commitError) {
                        connection.rollback();
                        connection.release();
                        callback(commitError, null);
                      } else {
                        // Continue with updating other details in the stock table
                        const updateStockQuery =
                          "UPDATE stock SET ? WHERE id = ?";
                        connection.query(
                          updateStockQuery,
                          [updatedFields, collectionId],
                          (updateStockError) => {
                            if (updateStockError) {
                              connection.rollback();
                              connection.release();
                              callback(updateStockError);
                            } else {
                              // Commit the main transaction
                              connection.commit((mainCommitError) => {
                                if (mainCommitError) {
                                  connection.rollback();
                                  connection.release();
                                  callback(mainCommitError, null);
                                } else {
                                  connection.release();
                                  callback(
                                    null,
                                    "Collection updated successfully"
                                  );
                                }
                              });
                            }
                          }
                        );
                      }
                    });
                  }
                );
              });
            }
          );
        }
      );
    });
  });
};

const deleteCollection = (collectionId, callback) => {
  pool.getConnection((getConnectionError, connection) => {
    if (getConnectionError) {
      callback(getConnectionError);
      return;
    }

    connection.beginTransaction((beginTransactionError) => {
      if (beginTransactionError) {
        connection.release();
        callback(beginTransactionError);
        return;
      }

      const selectStockQuery =
        "SELECT product_id, quantity FROM stock WHERE id = ? FOR UPDATE";
      connection.query(
        selectStockQuery,
        [collectionId],
        (selectStockError, stockResults) => {
          if (selectStockError) {
            connection.rollback();
            connection.release();
            callback(selectStockError);
            return;
          }

          if (stockResults.length === 0) {
            connection.rollback();
            connection.release();
            callback(new Error("Stock not found"));
            return;
          }

          const { product_id, quantity } = stockResults[0];

          const updateProductsQuery =
            "UPDATE products SET stock = stock - ? WHERE id = ?";
          connection.query(
            updateProductsQuery,
            [quantity, product_id],
            (updateProductsError) => {
              if (updateProductsError) {
                connection.rollback();
                connection.release();
                callback(updateProductsError);
                return;
              }

              const deleteQuery = "DELETE FROM stock WHERE id = ?";
              connection.query(deleteQuery, [collectionId], (deleteError) => {
                if (deleteError) {
                  connection.rollback();
                  connection.release();
                  callback(deleteError);
                  return;
                }

                connection.commit((commitError) => {
                  if (commitError) {
                    connection.rollback();
                    connection.release();
                    callback(commitError);
                  } else {
                    connection.release();
                    callback(null, "Collection deleted successfully");
                  }
                });
              });
            }
          );
        }
      );
    });
  });
};

const getCollectionDetails = async (collectionId, callback) => {
  try {
    const query = "SELECT * FROM stock WHERE id = ?";
    pool.query(query, [collectionId], (error, result) => {
      if (result.length > 0) {
        callback(error, result[0]);
      } else {
        callback({ message: "Collection not found" });
      }
    });
  } catch (error) {
    callback(error);
  }
};

module.exports = {
  addProduct,
  editProduct,
  getProduct,
  getProducts,
  deleteProduct,
  addCollection,
  getCollections,
  getUserCollections,
  updateCollection,
  deleteCollection,
  getCollectionDetails,
  markCollectionAsPaid
};
