import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { ProductListController, searchProductController, countProductController, createProductController, deleteProductController, filterProductController, getProductController, getProductPhotoController, getSingleProductController, updateProductController, getRelatedProductController } from "../controllers/productController.js";
import formidable from "express-formidable";

const productRouter = express.Router();

//create Product Route
productRouter.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//update Product Route
productRouter.put(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
//get Product Route
productRouter.get(
  '/get-product',
  getProductController
);

//get single Product Route
productRouter.get(
  '/getSingle-product/:slug',
  getSingleProductController

);

//get similar Product Route
productRouter.get(
  '/related-product/:pid/:cid',
  getRelatedProductController

);

//get photo of Product Route
productRouter.get(
  '/product-photo/:pid',
  getProductPhotoController
);

//delete Product Route
productRouter.delete(
  '/delete-product/:pid',
  deleteProductController
);

//filter Product Route
productRouter.post(
  '/product-filters',
  filterProductController
);

//count Product Route
productRouter.get(
  '/product-count',
  countProductController
);

// Product Per Page Route
productRouter.get(
  '/product-list/:page',
  ProductListController
);
// Product search Route
productRouter.get(
  '/search/:keyword',
  searchProductController
);

export default productRouter;
