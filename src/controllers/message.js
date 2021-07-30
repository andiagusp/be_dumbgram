const { message, user, sequelize } = require('../../models')
const Joi = require('joi')
const { Op, QueryTypes } = require('sequelize')
const except = ['updatedAt']

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
      createdAt: m.createdAt,
      user: m.sender,
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

const getLastReceiveMessage = async (req, res) => {
  try {
    const { idUser } = req
    
    // const result = await sequelize.query(`
    //   SELECT
    //     messages.id, messages.senderMessageId, messages.receiverMessageId, messages.message,
    //     sender.id, sender.fullName, sender.email, sender.username, sender.image
    //     FROM messages
    //     JOIN users as sender
    //     ON messages.senderMessageId = sender.id
    //     WHERE receiverMessageId = ${idUser}
    //     AND messages.id
    //     IN (SELECT MAX(messages.id) FROM messages GROUP BY senderMessageId )
    //   `, {
    //   type: QueryTypes.SELECT
    // })
    const last = await sequelize.query('SELECT MAX(id) as last FROM messages GROUP BY senderMessageId', { type: QueryTypes.SELECT})
    const ress = last.map((l) => l.last)
    console.log(ress)
    const result = await message.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      where: {
        id: {
          [Op.in]: ress
        },
        receiverMessageId: idUser
      },
      include: {
        model: user,
        as: 'sender',
        attributes: ['id', 'fullName', 'username', 'image']
      }
    })
    // const result = await sequelize.query(`
    //   SELECT
    //     messages.id, messages.senderMessageId, messages.receiverMessageId, messages.message,
    //     sender.id, sender.fullName, sender.email, sender.username, sender.image
    //   FROM (SELECT * FROM messages WHERE receiverMessageId = ${idUser}) as messages
    //   JOIN users as sender
    //   ON messages.senderMessageId = sender.id
    //   WHERE messages.id
    //   IN (SELECT MAX(id) FROM messages GROUP BY senderMessageId )
    // `, {
    //   type: QueryTypes.SELECT
    // })
    
    return res.status(200).send({
      status: 'success',
      data: {
        message: result
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

module.exports = { addMessage, getMessage, getLastReceiveMessage }
