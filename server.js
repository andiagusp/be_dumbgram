const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

const router = require('./src/routers')

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.use('/api/v1', router)

app.listen(port, () => console.log(`Server running on port ${port}`))
