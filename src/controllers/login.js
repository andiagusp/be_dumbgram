const { user } = require('../../models')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const login = async (req, res) => {
  try {
    const data = req.body
    const { email, password } = data

    const schema = Joi.object({
      email: Joi.string().required().email().min(4).trim(),
      password: Joi.string().required().min(8).trim()
    })

    const { error } = schema.validate(data)

    if (error) {
      return res.status(400).send({
        status: 'failed',
        message: error.details[0].message
      })
    }

    const checkEmail = await user.findOne({
      attributes: ['id', 'fullName', 'username', 'email', 'image', 'password'],
      where: { email }
    })
    if (!checkEmail) {
      res.status(404)
      return res.send({
        status: 'failed',
        message: 'email or password incorrect'
      })
    }
    const isValidPassword = await bcrypt.compare(password, checkEmail.password)
    console.log(checkEmail)
    if (!isValidPassword) {
      return res.status(404).send({
        status: 'failed',
        message: 'email or password incorrect'
      })
    }

    const token = jwt.sign({
      id: checkEmail.id,
      email: checkEmail.email
    }, process.env.SECRET_KEY)

    res.status(200).send({
      status: 'success',
      data: {
        user: {
          id: checkEmail.id,
          fullName: checkEmail.fullName,
          username: checkEmail.username,
          email: checkEmail.email,
          image: checkEmail.image,
          token
        }
      }
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

module.exports = login
