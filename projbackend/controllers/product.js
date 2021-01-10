const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

//middlewares
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, prod) => {
      if (err || !prod) {
        return res.status(400).json({
          error: "Product not found in DB",
        });
      }
      req.product = prod;
      next();
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//actual controllers
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to upload file",
      });
    }
    //destructure fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      console.log(fields)
      return res.status(400).json({
        error: "All fields are mandatory",
      });
    }
    let product = new Product(fields);

    //handling file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too large",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to DB
    product.save((err, prod) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save product in DB",
        });
      }
      res.json(prod);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProd) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    res.json({
      message: "Successfully Deleted",
      deletedProd,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to upload file",
      });
    }
    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    //handling file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too large",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //save to DB
    product.save((err, prod) => {
      if (err) {
        res.status(400).json({
          error: "Product updation failed",
        });
      }
      res.json(prod);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, prods) => {
      if (err) {
        return res.status(400).json({
          error: "No products found",
        });
      }
      res.json(prods);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, cate) => {
    if (err) {
      return res.json({
        error: "Unable to fetch categories",
      });
    }
    res.json(cate);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status.json({
        error: "Bulk Operation failed",
      });
    }
    next();
  });
};
