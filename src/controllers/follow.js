const { follow, user } = require('../../models')
const except = ['password', 'createdAt', 'updatedAt', 'email', 'bio']

const getFollower = async (req, res) => {
  try {
    const { id } = req.params
    const account = await user.findOne({ where: { id: id } })
    if (!account) {
      return res.status(404).send({
        status: 'failed',
        message: 'user not found'
      })
    }
    const followers = await follow.findAll({
      where: {
        followingId: id
      },
      attributes: [['followingId', 'id']],
      include: {
        model: user,
        as: 'follower',
        attributes: { exclude: except }
      }
    })
    const userFollow = followers.map((f) => ({
      id: f.id,
      user: f.follower
    }))
    res.status(200).send({
      status: 'success',
      data: {
        followers: userFollow
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

const getFollowing = async (req, res) => {
  try {
    const { id } = req.params
    const account = await user.findOne({ where: { id: id } })
    if (!account) {
      return res.status(404).send({
        status: 'failed',
        message: 'user not found'
      })
    }

    const following = await follow.findAll({
      where: {
        followerId: id
      },
      attributes: [['followerId', 'id']],
      include: {
        model: user,
        as: 'following',
        attributes: { exclude: except }
      }
    })
    const userFollowing = following.map((f) => ({
      id: f.id,
      user: f.following
    }))
    res.status(200).send({
      status: 'success',
      data: {
        following: userFollowing
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

const addFollower = async (req, res) => {
  try {
    const { idUser } = req
    const data = req.params

    const checkFollower = await follow.findOne({ where: { followingId: data.followingId } })
    if (checkFollower) {
      await follow.destroy({ where: { id: checkFollower.id } })
      return res.status(400).send({
        status: 'failed',
        message: 'user sudah difollow'
      })
    }

    const addFoll = await follow.create({
      followerId: idUser,
      followingId: data.id
    })

    res.status(200).send({
      status: 'success',
      data: {
        follow: {
          id: addFoll.id,
          follower: idUser,
          following: data.id
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

module.exports = { getFollower, getFollowing, addFollower }
