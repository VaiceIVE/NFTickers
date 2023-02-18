const express = require('express')
const cors = require('cors')
const {urlencoded} = require('express')
const PORT = process.env.PORT || 8000
const NFTRouter = require('./routers/NFTRouter')


const app = express();


app.use(cors())
app.use(express.json())
app.use(urlencoded(true))


app.use(NFTRouter)



app.listen(PORT, () => {console.log(`Listening ${PORT}`)})