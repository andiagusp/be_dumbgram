require('dotenv').config()
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const auth = async (req, res, next) => {
  try {
    const header = req.header('Authorization')
    if (!header) {
      return res.status(401).send({
        status: 'failed',
        message: 'Unauthorized'
      })
    }

    const token = header.substring('Bearer '.length)
    const verify = jwt.verify(token, secretKey)
    req.idUser = verify.id
    next()
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

module.exports = auth
