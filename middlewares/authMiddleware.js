const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        status: "Error",
        message: "Lỗi xác thực người dùng"
      })
    }
    const { isAdmin } = user;
    if (isAdmin) {
      next();
    } else {
      return res.status(404).json({
        status: "Error",
        message: "Lỗi xác thực người dùng"
      })
    }
  });
}
const authUserMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const userId = req.params.id;

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        status: "Error",
        message: "Lỗi xác thực người dùng"
      })
    }
    const { isAdmin, id } = user;
    if (isAdmin || id === userId) {
      next();
    } else {
      return res.status(404).json({
        status: "Error",
        message: "Lỗi xác thực người dùng"
      })
    }
  });
}

module.exports = {
  authMiddleware,
  authUserMiddleware
}