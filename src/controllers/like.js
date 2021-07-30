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
      return res.status(200).send({
        status: 'success',
        message: 'success unlike',
        feed: {
          id
        }
      })
    }
    console.log('test')
    const increment = feedCheck.like + 1
    console.log('test bawah')

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


const checkLike = async (req, res) => {
  try {
    const { idUser } = req
    const { id } = req.params

    const result = await like.findOne({
      attributes: ['id', 'feedId', 'userId'],
      where: {
        feedId: id,
        userId: idUser
      }
    })
    if (!result) {
      return res.status(200).send({
        status: 'success',
        message: 'like not found'
      })
    }

    console.log('sampe');
    res.status(200).send({
      status: 'success',
      message: 'success like',
      data: {
        feed: result?.feedId
      }
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      status: 'failed',
      message: 'Internal server error'
    })
  }
}

const checkLikeUserLogin = async (req, res) => {
  try {
    const { idUser } = req
    const likeUser = await like.findAll({
      attributes: ['id', 'feedId', 'userId'],
      where: {
        userId: idUser
      }
    })

    return res.status(200).send({
      status: 'success',
      data: {
        like: likeUser
      }
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      status: 'failed',
      message: 'Internal server error'
    })
  }
}

module.exports = { addLike, checkLike, checkLikeUserLogin }
