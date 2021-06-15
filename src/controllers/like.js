const { like, feed } = require('../../models')

const addLike = async (req, res) => {
  try {
    const { idUser } = req
    const { id } = req.body

    const feedCheck = await feed.findOne({
      attributes: ['id', 'like'],
      where: {
        id: id
      }
    })
    const feedLikeCheck = await like.findOne({
      where: {
        feedId: id,
        userId: idUser
      }
    })

    if (feedLikeCheck) {
      const decrement = feedCheck.like - 1
      await like.destroy({
        where: {
          feedId: id,
          userId: idUser
        }
      })
      await feed.update({
        like: decrement
      },
      {
        where: {
          id: id
        }
      })
      return res.status(500).send({
        status: 'failed',
        message: 'anda sudah like'
      })
    }

    const increment = feedCheck.like + 1

    await feed.update({ like: increment }, { where: { id: id } })
    const love = await like.create({ feedId: id, userId: idUser })
    res.status(200).send({
      status: 'success',
      feed: {
        id: love.feedId
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

module.exports = { addLike }
