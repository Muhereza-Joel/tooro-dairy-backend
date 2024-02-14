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
  pool.query("SELECT * FROM products ORDER BY products.created_at DESC", [], (error, selectResults) => {
    callback(error, selectResults);
  });
};

const deleteProduct = (id, callback) => {
  pool.query("DELETE FROM products WHERE id = ?", [id], (error, result) => {
    callback(error, id);
  });
};

module.exports = {
  addProduct,
  editProduct,
  getProduct,
  getProducts,
  deleteProduct,
};
