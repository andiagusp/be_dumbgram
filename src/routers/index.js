const express = require('express')
const router = express.Router()

const registerUser = require('../controllers/register')
const login = require('../controllers/login')

// register
router.post('/register', registerUser)
router.post('/login', login)

module.exports = router
