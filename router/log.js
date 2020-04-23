// router/log.js
// log router file

const express = require('express')
const router = express.Router()

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

// import log schema
const Log = require('../schema/log')

// get logs interface
router.post('/log', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // get logs
    Log.find({ ldep: req.session.udept }, { _id: 0 }).gte('ldat', req.body.ldatbeg).lte('ldat', req.body.ldatend)
      .sort({ ldat: 1 })
      .then(loglist => {
        res.json({
          status: 'success',
          log: loglist
        })
      })
      .catch(err => {
        res.json({
          status: 'fail',
          msg: req.session.udept
        })
      })
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// create logs interface
router.post('/log/add', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // add data
    let addData = {
      'ldev': req.body.ldev,
      'ldep': req.session.userinfo.udept,
      'lopt': req.body.lopt,
      'lusr': req.session.userinfo.uname,
      'ldat': getNowDate()
    }
    // create logs
    Log.create(addData, (err, data) => {
      if (err) {
        res.json({
          status: 'fail',
          msg: req.body.ldev
        })
      } else {
        res.json({
          status: 'success',
          msg: req.body.ldev
        })
      }
    })
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// export log router
module.exports = router
