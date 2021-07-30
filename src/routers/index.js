const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const uploadFile = require('../middleware/uploadfile')

const registerUser = require('../controllers/register')
const login = require('../controllers/login')
const { getFollower, getFollowing, addFollower } = require('../controllers/follow')
const {
  addComment, getComment, getNotif, deleteComment
} = require('../controllers/comment')
const {
  addMessage, getMessage, getLastReceiveMessage
} = require('../controllers/message')
const {
  getAllUser, updateUser, deleteUser, getUserLogin, getDetailUser
} = require('../controllers/user')
const {
  addFeed, getFeedByFollow, getAllFeed, getFeedPeople, getFeedLike
} = require('../controllers/feed')
const { addLike, checkLike, checkLikeUserLogin } = require('../controllers/like')

router.post('/login', login)
router.post('/register', registerUser)

router.get('/followers/:id', auth, getFollower)
router.get('/following/:id', auth, getFollowing)
router.post('/follow', auth, addFollower)

router.post('/message/:idSendTo', auth, addMessage)
router.get('/message-user/:idSendTo', auth, getMessage)

router.get('/users', getAllUser)
router.delete('/user/:id', deleteUser)
router.patch('/user/:id', auth, uploadFile('imageFile'), updateUser)

router.post('/feed', auth, uploadFile('imageFile'), addFeed)
router.post('/like', auth, addLike)
router.get('/feed', auth, getFeedByFollow)
router.get('/feeds', auth, getAllFeed)
router.post('/comment', auth, addComment)
router.get('/comments/:feedId', auth, getComment)

// improve
router.get('/user/:id', getDetailUser)
router.get('/cek-login', auth, getUserLogin)
router.get('/likes', auth, checkLikeUserLogin)
router.get('/like/:id', auth, checkLike)
router.get('/feeds/:id', auth, getFeedPeople)
router.get('/feed-like/:id', auth, getFeedLike)
router.get('/message-last', auth, getLastReceiveMessage)
router.get('/comments-notif', auth, getNotif)
router.delete('/comment/:id', auth, deleteComment)

// SELECT messages.id, messages.senderMessageId, messages.receiverMessageId, messages.message, sender.id, sender.fullName, sender.email, sender.username FROM `messages` JOIN users as sender ON messages.senderMessageId = sender.id WHERE receiverMessageId = 3 AND messages.id IN (SELECT MAX(messages.id) FROM messages GROUP BY senderMessageId )

module.exports = router
