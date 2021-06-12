const { user } = require('../../models')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const saltRounds = 10
require('dotenv').config()

const registerUser = async (req, res) => {
  try {
    const data = req.body
    const { email, username, password } = data

    if (data.username.includes(' ')) {
      return res.status(400).send({
        status: 'failed',
        message: 'username not used white space'
      })
    }

    const schema = Joi.object({
      email: Joi.string().required().email().min(4),
      username: Joi.string().required().min(4).trim(),
      password: Joi.string().required().min(8).trim(),
      fullName: Joi.string().required().min(1)
    })

    const { error, value } = schema.validate(data)
    const checkEmailUsername = await user.findOne({
      where: {
        [Op.or]: [
          { email },
          { username }
        ]
      }
    })
    const hashPassword = await bcrypt.hash(password, saltRounds)

    if (checkEmailUsername) {
      return res.status(400).send({
        status: 'failed',
        message: 'email or username has been register'
      })
    }

    if (error) {
      return res.status(400).send({
        status: 'failed',
        error: error.details[0].message,
        value
      })
    }

    const dataUser = await user.create({
      ...data,
      password: hashPassword
    })
    const token = jwt.sign({
      id: dataUser.id,
      email: dataUser.email
    }, process.env.SECRET_KEY)
    res.status(200).send({
      status: 'success',
      data: {
        fullName: dataUser.fullName,
        username: dataUser.username,
        token
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

module.exports = registerUser
