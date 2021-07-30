require('dotenv').config()
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
    console.log(req.files)
    let image = null
    if (req.files.imageFile) {
      console.log('cek')
      image = req.files.imageFile[0].filename
    } else if (!image) {
      const result = await user.findOne({
        attributes: ['id', 'image'],
        where: {
          id: idUser
        }
      })
      image = result.image
    }

    if (data.username.includes(' ')) {
      return res.status(400).send({
        status: 'failed',
        message: 'username not used white space'
      })
    }

    console.log(data);
    if (+id !== +idUser) {
      return res.status(403).send({
        status: 'failed',
        message: 'user not match'
      })
    }

    const detailUser = await user.findOne({ where: { id } })
    const cekUsername = await user.findAll({
      attributes: ['id', 'username'],
      where: { username: detailUser.username }
    })
    const filterUsername = cekUsername.filter((user) => {
      if (user.username === data.username) {
        if (user.id !== +id) {
          return user.username
        }
      }
    })
    if (!detailUser) {
      return res.status(404).send({
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
    if (data.username === '' || data.fullName === '') {
      return res.status(400).send({
        status: 'failed',
        message: 'username empty'
      })
    }
    const schema = Joi.object({
      bio: Joi.string()
    })
    const { error } = schema.validate({ bio: data.bio })

    if (error) {
      return res.status(400).send({
        status: 'failed',
        message: error.details[0].message
      })
    }

    await user.update({ ...data, image }, { where: { id: idUser } })
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

const getUserLogin = async (req, res) => {
  try {
    const { idUser } = req

    const result = await user.findOne({
      attributes: ['id', 'fullName', 'username', 'image', 'bio'],
      where: {
        id: idUser
      }
    })
    if (!result) {
      return res.status(404).send({
        status: 'failed',
        message: 'user not found'
      })
    }
    
    res.status(200).send({
      status: 'success',
      data: {
        user: result
      }
    })
  } catch (error) {
    res.status(500).send({
      status: 'failed',
      message: 'server error',
      error: error.message
    })
  }
}

const getDetailUser = async (req, res) => {
  try {
    const { id } = req.params
    const detail = await user.findOne({
      attributes: ['id', 'fullName', 'username', 'image', 'bio'],
      where: {
        id: id
      }
    })

    if (!detail) {
      return res.status(404).send({
        status: 'failed',
        message: 'user not found'
      })
    }

    res.status(200).send({
      status: 'success',
      data: {
        user: detail
      }
    })
  } catch (error) {
    res.status(500).send({
      status: 'failed',
      message: 'server error',
      error: error.message
    })
  }
}

module.exports = { getAllUser, updateUser, deleteUser, getUserLogin, getDetailUser }
