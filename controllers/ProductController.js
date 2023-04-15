const Product = require("../models/ProductModel");

const ProductController = require("express").Router();

//create product
ProductController.post("/create", async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description } = req.body;
    if (!name || !image || !type || !price || !countInStock || !rating || !description) {
      return res.status(200).json({
        status: "Error",
        message: "tất cả các trường phải được điền",
      })
    }
    const newProduct = await Product.create({ ...req.body });
    return res.status(200).json({
      status: "success",
      message: "tạo mới sản phẩm thành công",
      data: newProduct
    })
  } catch (error) {
    console.log(error)
  }
})

//update product
ProductController.put("/update/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(200).json({
        status: "Error",
        message: "Không tìm thấy sản phẩm",
      })
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    return res.status(200).json({
      status: "success",
      message: "cập nhật sản phẩm thành công",
      data: updatedProduct
    })
  } catch (error) {
    console.log(error)
  }
})

//details product
ProductController.get("/details-product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(200).json({
        status: "Error",
        message: "Không tìm thấy sản phẩm",
      })
    }
    return res.status(200).json({
      status: "success",
      message: "lấy thông tin chi tiết sản phẩm thành công",
      data: product
    })
  } catch (error) {
    console.log(error)
  }
})

//delete product
ProductController.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(200).json({
        status: "Error",
        message: "Không tìm thấy sản phẩm",
      })
    }
    await Product.findByIdAndDelete(req.params.id, { new: true });
    return res.status(200).json({
      status: "success",
      message: "xóa sản phẩm thành công",
    })
  } catch (error) {
    console.log(error)
  }
})

//get all product 
ProductController.get("/getAllProduct", async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const totalProduct = await Product.count();
    if (filter) {
      const allProductFilter = await Product.find({ [filter[0]]: { $regex: filter[1] } }).limit(limit || 8).skip(page * limit || 0);
      return res.status(200).json({
        status: "success",
        message: "lấy tất cả sản phẩm thành công",
        data: allProductFilter,
        totalProduct: totalProduct,
        pageCurrent: +page + 1,
        totalPage: Math.ceil(totalProduct / limit)
      })
    }
    if (sort) {
      const objectSort = {};
      objectSort[sort[1]] = sort[0];
      const allProductSort = await Product.find({}).limit(limit || 8).skip(page * limit || 0).sort(objectSort);
      return res.status(200).json({
        status: "success",
        message: "lấy tất cả sản phẩm thành công",
        data: allProductSort,
        totalProduct: totalProduct,
        pageCurrent: +page + 1,
        totalPage: Math.ceil(totalProduct / limit)
      })
    }
    const allProduct = await Product.find({}).limit(limit || 8).skip(page * limit || 0)
    return res.status(200).json({
      status: "success",
      message: "lấy tất cả sản phẩm thành công",
      data: allProduct,
      totalProduct: totalProduct,
      pageCurrent: +page + 1,
      totalPage: Math.ceil(totalProduct / limit)
    })
  } catch (error) {
    console.log(error)
  }
})
ProductController.get("/getAllType", async (req, res) => {
  try {
    const allType = await Product.distinct("type");
    return res.status(200).json({
      status: "success",
      message: "lấy tất cả type thành công",
      data: allType
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = ProductController
