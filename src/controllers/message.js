const { message, user } = require('../../models')
const Joi = require('joi')
const { Op } = require('sequelize')
const except = ['createdAt', 'updatedAt']

const addMessage = async (req, res) => {
  try {
    const { idSendTo } = req.params
    const { idUser } = req
    const data = req.body
    const checkUser = await user.findOne({ where: { id: idSendTo } })
    if (!checkUser) {
      return res.status(404).send({
        status: 'failed',
        message: 'user not found'
      })
    }
    const schema = Joi.object({ message: Joi.string().required() })
    const { error } = schema.validate(data)
    if (error) {
      return res.status(400).send({
        status: 'failed',
        message: error.details[0].message
      })
    }

    const messageSend = await message.create({
      message: data.message,
      senderMessageId: idUser,
      receiverMessageId: idSendTo
    })

    const messageCek = await message.findOne({
      where: {
        id: messageSend.id
      },
      attributes: ['id', 'message'],
      include: {
        model: user,
        as: 'receiver',
        attributes: ['id', 'fullName', 'username', 'image']
      }
    })

    const messageResponse = {
      id: messageCek.id,
      message: messageCek.message,
      user: { ...messageCek.receiver.dataValues }
    }

    res.status(200).send({
      status: 'success',
      data: {
        message: messageResponse
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

const getMessage = async (req, res) => {
  try {
    const { idUser } = req
    const { idSendTo } = req.params
    const checkUser = await user.findOne({ where: { id: idSendTo } })
    if (!checkUser) {
      return res.status(404).send({
        status: 'failed',
        message: 'not found'
      })
    }

    const getMessage = await message.findAll({
      attributes: { exclude: [...except, 'senderMessageId', 'receiverMessageId'] },
      order: [['id', 'asc']],
      where: {
        [Op.or]: [
          {
            senderMessageId: idUser,
            receiverMessageId: idSendTo
          },
          {
            senderMessageId: idSendTo,
            receiverMessageId: idUser
          }
        ]
      },
      include: {
        model: user,
        as: 'sender',
        attributes: ['id', 'fullName', 'username', 'image']
      }
    })

    const chat = getMessage.map(m => ({
      id: m.id,
      message: m.message,
      user: m.sender
    }))
    res.status(200).send({
      status: 'success',
      data: {
        message: chat
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

module.exports = { addMessage, getMessage }
