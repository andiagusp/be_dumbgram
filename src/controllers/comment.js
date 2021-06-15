const { comment, user, feed } = require('../../models')
const Joi = require('joi')

const addComment = async (req, res) => {
  try {
    const { idUser } = req
    const data = req.body
    const schema = Joi.object({ comment: Joi.string().required() })
    const { error } = schema.validate({ comment: data.comment })
    if (error) {
      return res.status(404).send({
        status: 'failed',
        message: 'comment blank'
      })
    }

    const postComment = await comment.create({
      feedId: data.id_feed,
      userId: idUser,
      comment: data.comment
    })

    res.status(200).send({
      status: 'success',
      data: {
        comment: {
          id: postComment.id
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

const getComment = async (req, res) => {
  try {
    // const { idUser } = req
    const { feedId } = req.params
    const checkFeed = await feed.findOne({ where: { id: feedId } })
    if (!checkFeed) {
      return res.status(404).send({
        status: 'failed',
        message: 'feed not found'
      })
    }

    const comments = await comment.findAll({
      attributes: ['id', 'comment'],
      where: {
        feedId: feedId
      },
      include: {
        model: user,
        as: 'user',
        attributes: ['id', 'fullName', 'username', 'image']
      }
    })

    res.status(200).send({
      status: 'success',
      comments: comments
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
}

module.exports = { addComment, getComment }
