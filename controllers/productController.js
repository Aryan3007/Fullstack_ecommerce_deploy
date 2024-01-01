import slugify from "slugify";
import fs from "fs";
import productModel from "../models/product.model.js";
import e from "cors";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, Catagory, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !Catagory:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("Catagory")
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "all product founded",
      products,
      totalcount: products.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in getting product",
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("Catagory");
    res.status(200).json({
      success: true,
      message: "single product founded",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error while finding single product",
    });
  }
};

export const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { photo } = product;

    if (photo && photo.data) {
      res.set("Content-type", photo.contentType);
      res.set("Content-Length", photo.data.length);
      return res.status(200).send(photo.data);
    } else {
      return res.status(404).json({
        success: false,
        message: "Product photo not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while finding product photo",
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).json({
      success: true,
      message: " product deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, Catagory, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !Catagory:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating product",
    });
  }
};

export const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let query = {};
    if (radio.length) {
      query.price = { $gte: radio[0], $lte: radio[1] };
    }
    if (checked.length > 0) {
      query.Catagory = checked;
    }
    const products = await productModel.find(query);
    res.status(200).json({
      success: true,
      message: "filtered",
      products,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "error while filtering product" });
  }
};

export const countProductController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).json({
      success: true,
      message: " got count product",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "cannot get pagination",
      error,
    });
  }
};

//product list based on page
export const ProductListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: " got list of product",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "cannot get list based on page",
      error,
    });
  }
};

//searchProduct

export const searchProductController = async (req, res) => {
  try {
    
    const { keyword } = req.params;
    const result = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
    .select("-photo");
  res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "error in search product",
      error,
    });
  }
};

export const getRelatedProductController = async (req, res) => {
  try {
    const{pid, cid} = req.params
    const products = await productModel.find({
      Catagory:cid,
      _id:{$ne:pid}
    }).select("-photo").populate("Catagory")

    res.status(200).json({
      success:true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error while getting realated product",
      error
    });
  }
};

