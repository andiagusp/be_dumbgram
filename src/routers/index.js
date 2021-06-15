const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const registerUser = require('../controllers/register')
const login = require('../controllers/login')
const { getFollower, getFollowing, addFollower } = require('../controllers/follow')
const { addComment, getComment } = require('../controllers/comment')
const { addMessage, getMessage } = require('../controllers/message')
const {
  getAllUser, updateUser, deleteUser
} = require('../controllers/user')
const {
  addFeed, getFeedByFollow, getAllFeed
} = require('../controllers/feed')
const { addLike } = require('../controllers/like')

router.post('/login', login)
router.post('/register', registerUser)

router.get('/followers/:id', auth, getFollower)
router.get('/following/:id', auth, getFollowing)
router.post('/follow', auth, addFollower)

router.post('/message/:idSendTo', auth, addMessage)
router.get('/message-user/:idSendTo', auth, getMessage)

router.get('/users', getAllUser)
router.delete('/user/:id', deleteUser)
router.patch('/user/:id', auth, updateUser)

router.post('/feed', auth, addFeed)
router.post('/like', auth, addLike)
router.get('/feed/:id', auth, getFeedByFollow)
router.get('/feeds', auth, getAllFeed)
router.post('/comment', auth, addComment)
router.get('/comments/:feedId', auth, getComment)

module.exports = router
