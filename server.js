const express = require('express')
const app = express()
const port = 5000

const router = require('./src/routers')

app.use(express.json())

app.use('/api/v1', router)

app.listen(port, () => console.log(`Server running on port ${port}`))
