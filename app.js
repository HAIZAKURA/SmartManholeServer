// app.js
// Server Main Program

console.log('Server Booting...')

const net = require('net')
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')

// import router
const user = require('./router/user')
const dept = require('./router/dept')
const device = require('./router/device')
const log = require('./router/log')

// define listen port
const TCP_PORT = 9000
const API_PORT = 3000

// init mongodb conn
mongoose.set('useCreateIndex', true)
const mongodb = mongoose.connect('mongodb://localhost:27017/sms', { useNewUrlParser: true, useUnifiedTopology: true })

// init api server
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  name: 'sms_session',
  secret: 'sms_5ykMMO2LJSZwEkX9',
  cookie: { maxAge: 60*60*1000 },
  resave: false,
  saveUninitialized: true
}))

// define api interface
app.use('/api', user)
app.use('/api', dept)
app.use('/api', device)
app.use('/api', log)

app.use('/', (req, res) => {
  res.send('Yo!')
})

// get now date function
function getNowDate() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  // format date : yyyy-MM-dd-HH-mm-ss
  let formatDate = year + '-' + month + '-' + day + '-' + hour + '-' + minute + '-' + second
  return formatDate
}

// init tcp server
const server = net.createServer(socket => {
  // receive data
  socket.on('data', data => {
    // console.log(data.toString())
    // socket.write('hello+' + data.toString())

    // split message
    let msg = data.toString().split('/')
    let opt = msg[0]
    if (opt == 'op') {
      // while device open
      let dev = msg[1]
      let usr = msg[2]
      let dep = dev.split('@')[0]
      let Device = require('./schema/device')
      let Log = require('./schema/log')
      // modify device status
      Device.findOneAndUpdate({ vidno: dev, vdept: dep }, { $set: { vstat: 'open' } })
        .then(res => {
          console.log(dev, 'opened by', usr)
        })
      // create log
      Log.create({ ldev: dev, ldep: dep, lopt: 'open', lusr: usr, ldat: getNowDate() }, (err, data) => {
        if (!err) {
          console.log(dev, 'open log added')
        }
      })
    } else if (opt == 'cl') {
      // while device close
      let dev = msg[1]
      let usr = msg[2]
      let dep = dev.split('@')[0]
      let Device = require('./schema/device')
      let Log = require('./schema/log')
      // modify device status
      Device.findOneAndUpdate({ vidno: dev, vdept: dep }, { $set: { vstat: 'close' } })
        .then(res => {
          console.log(dev, 'closed by', usr)
        })
      // create log
      Log.create({ ldev: dev, ldep: dep, lopt: 'close', lusr: usr, ldat: getNowDate() }, (err, data) => {
        if (!err) {
          console.log(dev, 'close log added')
        }
      })
    } else if (opt == 'al') {
      // while device alarm
      let dev = msg[1]
      let usr = msg[2]
      let dep = dev.split('@')[0]
      let Device = require('./schema/device')
      let Log = require('./schema/log')
      // modify device status
      Device.findOneAndUpdate({ vidno: dev, vdept: dep }, { $set: { vstat: 'alarm' } })
        .then(res => {
          console.log(dev, 'alarmed')
        })
      // create log
      Log.create({ ldev: dev, ldep: dep, lopt: 'alarm', lusr: usr, ldat: getNowDate() }, (err, data) => {
        if (!err) {
          console.log(dev, 'alarm log added')
        }
      })
    } else {
      socket.write('ERROR')
    }
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
