const { user } = require('../../models')
const Joi = require('joi')

const getAllUser = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    })

    const userss = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      image: user.image,
      bio: user.bio
    }))

    res.status(200).send({
      status: 'success',
      data: { users: userss }
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { idUser } = req
    const data = req.body

    if (+id !== +idUser) {
      return res.status(403).send({
        status: 'failed',
        message: 'user not match'
      })
    }

    const detailUser = await user.findOne({ where: { id } })
    const cekUsername = await user.findAll({
      attributes: ['id', 'username'],
      where: { username: data.username }
    })
    const filterUsername = cekUsername.filter((user) => {
      if (user.username === data.username) {
        if (user.id !== +id) {
          return user.username
        }
      }
    })
    console.log(filterUsername.length)
    if (!detailUser) {
      return res.status(400).send({
        status: 'failed',
        message: 'not found'
      })
    }

    if (filterUsername.length > 0) {
      return res.status(400).send({
        status: 'failed',
        message: 'username already use'
      })
    }

    const schema = Joi.object({
      fullName: Joi.string().required().min(4),
      username: Joi.string().required().min(4),
      image: Joi.string(),
      bio: Joi.string()
    })
    const { error } = schema.validate(data)

    if (error) {
      return res.status(400).send({
        status: 'failed',
        message: error.details[0].message
      })
    }

    await user.update(data, { where: { id: idUser } })
    const userUpdate = await user.findOne({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password']
      },
      where: {
        id: idUser
      }
    })

    res.status(200).send({
      status: 'success',
      data: {
        user: {
          id: userUpdate.id,
          fullName: userUpdate.fullName,
          email: userUpdate.email,
          username: userUpdate.username,
          image: userUpdate.image,
          bio: userUpdate.bio
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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await user.destroy({ where: { id } })
    res.status(200).send({
      status: 'success',
      data: {
        id: +id
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

module.exports = { getAllUser, updateUser, deleteUser }
