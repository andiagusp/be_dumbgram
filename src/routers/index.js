const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const registerUser = require('../controllers/register')
const login = require('../controllers/login')
const {
  getFollower, getFollowing
} = require('../controllers/follow')
const {
  getAllUser, updateUser, deleteUser
} = require('../controllers/user')

router.post('/login', login)
router.post('/register', registerUser)

router.get('/followers/:id', getFollower)
router.get('/following/:id', getFollowing)

router.get('/users', getAllUser)
router.delete('/user/:id', deleteUser)
router.put('/user/:id', auth, updateUser)

module.exports = router
