const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const pool = require("../mysql/databaseConnection");
const {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
  addCollection,
  getCollections,
  getCollectionDetails,
  updateCollection,
  deleteCollection,
  markCollectionAsPaid,
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

router.post("/collections", (req, res) => {
  try {
    const collectionId = uuidv4();
    const {
      stockPlan,
      userId,
      productId,
      quantity,
      unitPrice,
      amountPayed,
      balance,
      total,
      payed,
    } = req.body;

    const collection = {
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
    };

    addCollection(collection, (error, result) => {
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

router.get("/collections", async (req, res) => {
  try {
    getCollections((error, collections) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(collections);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/collections/:collectionId", async (req, res) => {
  const collectionId = req.params.collectionId;

  try {
    getCollectionDetails(collectionId, (error, collectionDetails) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error occured" });
      } else {
        res.json(collectionDetails);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/collections/:collectionId", async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const updatedFields = req.body; // Assuming you send the updated fields in the request body

    updateCollection(collectionId, updatedFields, (error, result) => {
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

router.delete("/collections/:collectionId", async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    deleteCollection(collectionId, (error, result) => {
      if (error) {
        res.status(500).json({ errors: error });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    await pool.rollback(); // Rollback the transaction on error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/collections/mark-as-paid/:collectionId", (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    markCollectionAsPaid(collectionId, (error, result) => {
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
