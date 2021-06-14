const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const registerUser = require('../controllers/register')
const login = require('../controllers/login')
const { getFollower, getFollowing } = require('../controllers/follow')
const { addComment, getComment } = require('../controllers/comment')
const {
  getAllUser, updateUser, deleteUser
} = require('../controllers/user')
const {
  addFeed, getFeedByFollow, getAllFeed
} = require('../controllers/feed')
const { addLike } = require('../controllers/like')

router.post('/login', login)
router.post('/register', registerUser)

router.get('/followers/:id', getFollower)
router.get('/following/:id', getFollowing)

router.get('/users', getAllUser)
router.delete('/user/:id', deleteUser)
router.put('/user/:id', auth, updateUser)


router.post('/feed', auth, addFeed)
router.post('/like', auth, addLike)
router.get('/feed/:id', auth, getFeedByFollow)
router.get('/feeds', auth, getAllFeed)
router.post('/comment', auth, addComment)
router.get('/comment/:feedId', auth, getComment)

module.exports = router
