const OrderController = require("express").Router();
const nodemailerService = require("../services/nodemailerService");
const { authUserMiddleware } = require("../middlewares/authMiddleware");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
OrderController.post("/create-order", authUserMiddleware, async (req, res) => {
  try {
    const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, email } = req.body;
    if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
      return res.status(200).json({
        status: "Error",
        message: "tất cả các trường phải được điền",
      })
    }
    const promises = orderItems.map(async (order) => {
      const productData = await Product.findOneAndUpdate(
        {
          _id: order.product,
          countInStock: { $gte: order.amount }
        },
        {
          $inc: {
            countInStock: -order.amount,
            selled: +order.amount
          }
        },
        { new: true }
      )
      if (productData) {
        return res.status(200).json({
          status: 'OK',
          message: 'SUCCESS'
        })
      }
      else {
        return res.status(200).json({
          status: 'OK',
          message: 'SUCCESS',
          id: order.product
        })
      }
    })
    const results = await Promise.all(promises)
    const newData = results && results.filter((item) => item.id);
    if (newData.length) {
      const arrId = []
      newData.forEach((item) => {
        arrId.push(item.id);
      });
      return ({
        status: 'error',
        message: `San pham voi id: ${arrId} khong du hang`
      })
    }
    else {
      const createOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone
        },
        paymentMethod, itemsPrice, shippingPrice, totalPrice,
        user
      });
      if (createOrder) {
        await nodemailerService.sendEmailCreateOrder(email, orderItems);
        return res.status(200).json({
          status: "success",
          message: "đặt hàng thành công",
          data: createOrder
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
})

OrderController.get("/get-all-order/:id", authUserMiddleware, async (req, res) => {
  try {
    const order = await Order.find({ user: req.params.id });
    if (!order) {
      return res.status(200).json({
        status: "Error",
        message: "Không tìm thấy đơn hàng",
      })
    }
    return res.status(200).json({
      status: "success",
      message: "lấy thông tin chi tiết đơn hàng thành công",
      data: order
    })
  } catch (error) {
    console.log(error)
  }
})

OrderController.get("/get-details-order/:id", authUserMiddleware, async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.id });
    if (!order) {
      return res.status(200).json({
        status: "Error",
        message: "Không tìm thấy đơn hàng",
      })
    }
    return res.status(200).json({
      status: "success",
      message: "lấy thông tin chi tiết đơn hàng thành công",
      data: order
    })
  } catch (error) {
    console.log(error)
  }
})

OrderController.delete("/cancel-order-details/:id", authUserMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    let order = [];

    const promises = data.map(async (order) => {
      const productData = await Product.findOneAndUpdate(
        {
          _id: order.product,
          selled: { $gte: order.amount }
        },
        {
          $inc: {
            countInStock: +order.amount,
            selled: -order.amount
          }
        },
        { new: true }
      )
      if (productData) {
        order = await Order.findByIdAndDelete(id);
        if (order === null) {
          return res.status(200).json({
            status: "error",
            message: "The order is not defined"
          })
        }
      } else {
        return res.status(200).json({
          status: "success",
          message: "đặt hàng thành công",
          id: order.product
        })
      }
    })

    const results = await Promise.all(promises)
    const newData = results && results[0] && results[0].id
    if (newData) {
      return res.status(200).json({
        status: "error",
        message: "Xóa thành công"
      })
    }
    // return res.status(200).json({
    //   status: "error",
    //   message: "The order is not defined",
    //   data: order
    // })


  } catch (error) {
    console.log(error)
  }
})


module.exports = OrderController
