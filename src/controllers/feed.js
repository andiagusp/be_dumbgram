const { feed, user, follow } = require('../../models')
const Joi = require('joi')
const except = ['createdAt', 'updatedAt', 'userId']

const addFeed = async (req, res) => {
  try {
    const data = req.body
    const { idUser } = req

    const schema = Joi.object({
      fileName: Joi.string().required(),
      caption: Joi.string().optional().allow('')
    })
    const { error } = schema.validate(data)
    if (error) {
      return res.status(400).send({
        status: 'failed',
        message: error.details[0].message
      })
    }

    const resultPost = await feed.create({ ...data, userId: idUser })
    const findFeed = await feed.findOne({
      where: {
        id: resultPost.id
      },
      attributes: {
        exclude: except
      },
      include: {
        model: user,
        as: 'user',
        attributes: {
          exclude: [...except, 'email', 'bio', 'password']
        }
      }
    })
    res.status(200).send({
      status: 'success',
      data: {
        feed: findFeed
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

const getFeedByFollow = async (req, res) => {
  try {
    const { idUser } = req
    const { id } = req.params
    const checkAccountPeople = await user.findOne({ where: { id: id } })
    if (!checkAccountPeople) {
      res.status(404).send({
        status: 'failed',
        message: 'user not found'
      })
    }

    const cekFollow = await feed.findAll({
      where: {
        userId: id
      },
      attributes : {
        exclude: except
      },
      include: {
        model: user,
        as: 'user',
        attributes : {
          exclude: [...except, 'password', 'bio', 'email']
        },
        include: {
          model: follow,
          as: 'follower',
          where: {
            followingId: idUser
          },
          attributes: []
        }
      }
    })

    res.status(200).send({
      status: 'success',
      data: {
        feed: cekFollow
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

const getAllFeed = async (req, res) => {
  try {
    const allFeeds = await feed.findAll({
      include: {
        model: user,
        as: 'user',
        attributes: ['id', 'fullName', 'username', 'image']
      },
      attributes: {
        exclude: [...except, 'userId']
      }
    })

    res.status(200).send({
      status: 'success',
      data: {
        feed: allFeeds
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

module.exports = { addFeed, getFeedByFollow, getAllFeed }
