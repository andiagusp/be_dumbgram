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

    const { error, value } = schema.validate(data)

    if (error) {
    	return res.status(404).send({
	      status: 'failed',
	      message: error.details[0].message
			})
    }

		const checkEmail = await user.findOne({ where: { email }})
		const isValidPassword = await bcrypt.compare(password, checkEmail.password)
		if (!checkEmail) {
			return res.status(404).send({
	      status: 'failed',
	      message: 'email or password incorrect'
			})
		}
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
					fullName: checkEmail.fullName,
					username: checkEmail.username,
					email: checkEmail.email,
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
