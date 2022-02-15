const express = require('express')
const PORT = process.env.PORT ||3001
//import modular routers
const htmlRouter = require('./routes/html')
const apiRouter = require('./routes/api')

const app = express()
//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api', apiRouter)
app.use('/', htmlRouter)


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);



