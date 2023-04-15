const jwt = require("jsonwebtoken")


const generalAccessToken = async (payload) => {
  const access_token = await jwt.sign(
    payload, process.env.ACCESS_TOKEN, { expiresIn: "2h" })
  return access_token;
}

const generalRefreshToken = async (payload) => {
  const refresh_token = await jwt.sign(
    payload, process.env.REFRESH_TOKEN, { expiresIn: "365d" })
  return refresh_token;
}

const refreshTokenJwtService = async (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            status: 'ERR',
            message: 'The authemtication'
          })
        }
        const access_token = await generalAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin
        })
        resolve({
          status: 'OK',
          message: 'SUCESS',
          access_token
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}
module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshTokenJwtService
}