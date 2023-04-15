const nodemailer = require("nodemailer");

const sendEmailCreateOrder = async (email, orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  let listItem = "";
  orderItems.forEach(order => {
    listItem = `<div>bạn đã đặt sản phẩm <b>${order.name}</b> bên dưới:<img src=${order.image} alt="sản phẩm"/><div>Với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price}</b></div></div>`
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: "cong102.201@gmail.com", // list of receivers
    subject: "Bạn đã đặt hàng thành công tại shop tiki clone", // Subject line
    html: `<div><b>bạn đã đặt hàng thành công tại shop tiki clone</b></div>
    <div>${listItem}</div>`, // html body
  });
}

module.exports = {
  sendEmailCreateOrder
}