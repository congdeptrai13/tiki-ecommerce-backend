const express = require("express");
const UserController = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken, refreshTokenJwtService } = require("../services/jwtService");
const { authMiddleware, authUserMiddleware } = require("../middlewares/authMiddleware");
UserController.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "Error",
        message: "tất cả các trường phải được nhập"
      })
    }
    const reqEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!reqEmail.test(email)) {
      return res.status(200).json({
        status: "Error",
        message: "email không đúng định dạng"
      })
    }
    if (password !== confirmPassword) {
      return res.status(200).json({
        status: "Error",
        message: "mật khẩu không giống nhau"
      })
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hashedPass });
    user.save();
    return res.status(200).json({
      status: "Success",
      message: "Tạo tài khoản thành công",
      data: user
    })
  } catch (error) {
    console.log(error);
  }
})

UserController.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        status: "Error",
        message: "tất cả các trường phải được nhập"
      })
    }
    const reqEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!reqEmail.test(email)) {
      return res.status(200).json({
        status: "Error",
        message: "email không đúng định dạng"
      })
    }
    const checkUser = await User.findOne({ email: req.body.email })
    if (!checkUser) {
      return res.status(200).json({
        status: "Error",
        message: "sai tài khoản hoặc mật khẩu"
      })
    }
    const checkPass = await bcrypt.compare(req.body.password, checkUser.password);
    if (!checkPass) {
      return res.status(200).json({
        status: "Error",
        message: "sai tài khoản hoặc mật khẩu"
      })
    }
    const access_token = await generalAccessToken({ id: checkUser._id, isAdmin: checkUser.isAdmin })
    const refresh_token = await generalRefreshToken({ id: checkUser._id, isAdmin: checkUser.isAdmin })
    return res.status(200).json({
      status: "Success",
      message: "Đăng nhập thành công",
      access_token,
    })
  } catch (error) {
    console.log(error)
  }
})

UserController.put("/update-user/:id", authUserMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(200).json({
        status: "Error",
        message: "Không tìm thấy User"
      })
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    return res.status(200).json({
      status: "success",
      message: "Cập nhật user thành công",
      data: updateUser
    });
  } catch (error) {
    console.log(error)
  }
})

//delete a user
UserController.delete("/delete-user/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(200).json({
        status: "Error",
        message: "Không tìm thấy User"
      })
    }
    await User.findByIdAndDelete(req.params.id, { new: true });
    return res.status(200).json({
      status: "success",
      message: "Xóa user thành công",
    });
  } catch (error) {
    console.log(error)
  }
})

//get all user
UserController.get("/getAllUser", authMiddleware, async (req, res) => {
  try {
    const Users = await User.find({});
    return res.status(200).json({
      status: "Success",
      message: "lấy tất cả dùng người dùng",
      data: Users
    })
  } catch (error) {
    console.log(error)
  }
})

//get a user details
UserController.get("/getDetails-user/:id", authUserMiddleware, async (req, res) => {
  try {
    const userDetails = await User.findById(req.params.id);
    return res.status(200).json({
      status: "success",
      msg: "lấy thông tin chi tiết user",
      data: userDetails
    })
  } catch (error) {
    console.log(error)
  }
})

UserController.post("/refreshToken", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(200).json({
        Status: "Error",
        message: "Bắt buộc phải có token"
      })
    }
    const data = await refreshTokenJwtService(token);
    console.log(data);
    return res.status(200).json(
      data
    )
  } catch (error) {
    console.log(error)
  }
})

module.exports = UserController;