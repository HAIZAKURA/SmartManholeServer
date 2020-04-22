// router/user.js
// user router file

const express = require('express')
const router = express.Router()

// use md5 crypto
const md5 = require('md5-node')

// import user schema
const User = require('../schema/user')

// user login interface
router.post('/user/login', (req, res) => {
  User.findOne({ 'uname': req.body.uname, 'upass': md5(req.body.upass) })
    .then(user => {
      // console.log(user)
      // set session : json : { "uname": {uname}, "uauth": {uauth}, "udept": {udept} }
      req.session.userinfo = { 'uname': user.uname, 'uauth': user.uauth, 'udept': user.udept }
      // login succeed return
      res.json({
        status: 'success',
        uname: user.uname,
        uauth: user.uauth,
        udept: user.udept
      })
    })
    .catch(err => {
      // console.log(err)
      // login failed return
      res.json({
        status: 'fail',
        uname: req.body.uname
      })
    })
})

// user logout interface
router.post('/user/logout', (req, res) => {
  // destroy session
  req.session.destroy(err => {
    res.json({
      status: 'success',
      msg: 'success'
    })
  })
})

// user add interface
router.post('/user/add', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // user permission judgment
    if (req.session.userinfo.uauth == 'admin' || req.session.userinfo.uauth == 'company') {
      // add user auth judgment
      if (req.session.userinfo.uauth == 'company' && req.body.uauth == 'admin') {
        res.json({
          status: 'error',
          msg: 'unauthorized'
        })
      } else {
        // add data
        addData = { 'uname': req.body.uname, 'upass': md5(req.body.upass), 'uauth': req.body.uauth }
        // users only can create users in their own dept except admin
        if (req.session.userinfo.uauth == 'admin') {
          addData.udept = req.body.udept
        } else {
          addData.udept = req.session.userinfo.udept
        }
        // create user
        User.create(addData, (err, data) => {
          if (err) {
            res.json({
              status: 'fail',
              msg: req.body.uname
            })
          } else {
            res.json({
              status: 'success',
              msg: req.body.uname 
            })
          }
        })
      }
    } else {
      res.json({
        status: 'error',
        msg: 'unauthorized'
      })
    }
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// user delete interface
router.post('/user/del', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // user permission judgment
    if (req.session.userinfo.uauth == 'admin' || req.session.userinfo.uauth == 'company') {
      // del data
      delData = { 'uname': req.body.uname }
      // users only can delete users in their own dept except admin
      if (req.session.userinfo.uauth == 'admin') {
        delData.udept = req.body.udept
      } else {
        delData.udept = req.session.userinfo.udept
      }
      // delete user
      User.findOneAndDelete(delData)
        .then(user => {
          res.json({
            status: 'success',
            msg: req.body.uname
          })
        })
        .catch(err => {
          res.json({
            status: 'fail',
            msg: req.body.uname
          })
        })
    } else {
      res.json({
        status: 'error',
        msg: 'unauthorized'
      })
    }
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// user password modify interface
router.post('/user/mod', (req, res) => {
  if (req.session.userinfo) {
    res.json({
      status: 'success',
      msg: req.session.userinfo
    })
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// user list get interface
router.post('/user', (req, res) => {
  if (req.session.userinfo) {
    res.json({
      status: 'success',
      msg: req.session.userinfo
    })
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

module.exports = router
