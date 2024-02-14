const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct
} = require("../mysql/queries/stockQueries");

router.post("/products", (req, res) => {
  try {
    const { productName, buyingPrice, sellingPrice } = req.body;
    const id = uuidv4();

    const product = {
      id: id,
      name: productName,
      buyingPrice: buyingPrice,
      sellingPrice: sellingPrice,
    };

    addProduct(product, (error, result) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/products", (req, res) => {
  try {
    const { productId, productName, buyingPrice, sellingPrice } = req.body;

    const product = {
      id: productId,
      name: productName,
      buyingPrice: buyingPrice,
      sellingPrice: sellingPrice,
    };

    editProduct(product, (error, result) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products/:id", (req, res) => {
  try {
    productId = req.params.id;

    getProduct(productId, (error, result) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products", (req, res) => {
  try {
    getProducts((error, results) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/products/:id", (req, res) => {
  try {
    productId = req.params.id;

    deleteProduct(productId, (error, result) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
