const net = require('net')
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')

// import router
const user = require('./router/user')
const dept = require('./router/dept')

// define listen port
const TCP_PORT = 9000
const API_PORT = 3000

// init mongodb conn
mongoose.set('useCreateIndex', true)
const mongodb = mongoose.connect('mongodb://localhost:27017/smd', { useNewUrlParser: true, useUnifiedTopology: true })

// init api server
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  name: 'smd_session',
  secret: 'smd_5ykMMO2LJSZwEkX9',
  cookie: { maxAge: 60*60*1000 },
  resave: false,
  saveUninitialized: true
}))

// define api interface
app.use('/api', user)
app.use('/api', dept)

app.use('/', (req, res) => {
  res.send('Yo!')
})

// init tcp server
const server = net.createServer(socket => {
  // receive data
  socket.on('data', data => {
    console.log(data.toString())
    socket.write('hello+' + data.toString())
  })
})

// run api server
app.listen(API_PORT, () => {
  console.log('API Server Started on', API_PORT)
})

// run tcp server
server.listen(TCP_PORT, () => {
  console.log('TCP Server Started on', TCP_PORT)
})
