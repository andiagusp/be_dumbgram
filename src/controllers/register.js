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
      fullName: Joi.string().required().min(1),
      username: Joi.string().required().min(4).trim(),
      password: Joi.string().required().min(8).trim()
    })
    const { error, value } = schema.validate(data)
    if (error) {
      return res.status(400).send({
        status: 'failed',
        message: error.details[0].message
      })
    }

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

    

    const dataUser = await user.create({
      ...data,
      image: 'unknow.jpg',
      password: hashPassword
    })
    const token = jwt.sign({
      id: dataUser.id,
      email: dataUser.email
    }, process.env.SECRET_KEY)
    res.status(200).send({
      status: 'success',
      data: {
        user: {
          fullName: dataUser.fullName,
          username: dataUser.username,
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

module.exports = registerUser
