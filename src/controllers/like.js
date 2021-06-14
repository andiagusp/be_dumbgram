const { feed, like } = require('../../models')

const addLike = async (req, res) => {
	try {
    const { idUser } = req
    const { id } = req.body

    const feedLikeCheck = await like.findOne({
      where: {
        feedId: id,
        userId: idUser
      }
    })

    if (feedLikeCheck) {
      await like.destroy({ where: { feedId: id, userId: idUser } })
      return res.status(500).send({
        status: 'failed',
        message: 'anda sudah like'
      })
    }

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
