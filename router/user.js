// router/user.js
// user router file

const express = require('express')
const router = express.Router()

// use md5 crypto
const md5 = require('md5-node')

// import user schema
const User = require('../schema/user')

// user login check interface
router.get('/check', (req, res) => {
  if (req.session.userinfo) {
    res.json({
      status: 'success',
      uname: req.session.userinfo.uname,
      uauth: req.session.userinfo.uauth,
      udept: req.session.userinfo.udept
    })
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

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
  // user login & permission judgment
  if (req.session.userinfo.uauth == 'admin') {
    // add data while admin request
    let addData = { 'uname': req.body.uname, 'upass': md5(req.body.upass), 'uauth': req.body.uauth, 'udept': req.body.uauth }
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
  } else if (req.session.userinfo.uauth == 'company') {
    // uauth effective judgement
    if (req.body.uauth == 'admin') {
      res.json({
        status: 'error',
        msg: 'unauthorized'
      })
    } else {
      // add data while company request
      let addData = { 'uname': req.body.uname, 'upass': md5(req.body.upass), 'uauth': req.body.uauth, 'udept': req.session.userinfo.udept }
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
})

// user delete interface
router.post('/user/del', (req, res) => {
  // user login & permission judgment
  if (req.session.userinfo.uauth == 'admin' || req.session.userinfo.uauth == 'company') {
    if (req.session.userinfo.uauth == 'admin') {
      // delete data while admin request
      var delData = { 'uname': req.body.uname, 'udept': req.body.udept }
    } else {
      // delete data while company request
      var delData = { 'uname': req.body.uname, 'udept': req.session.userinfo.udept }
    }
    // delete user
    User.findOneAndDelete(delData)
      .then(user => {
        // delete succeed return
        res.json({
          status: 'success',
          msg: req.body.uname
        })
      })
      .catch(err => {
        // delete failed return
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
})

// user password modify interface
router.post('/user/mod', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // modify user password only by self
    User.findOneAndUpdate({ uname: req.session.userinfo.uname, upass: md5(req.body.old_upass) }, { $set: { upass: md5(req.body.new_upass) } })
      .then(user => {
        res.json({
          status: 'success',
          msg: req.session.userinfo.uname
        })
      })
      .catch(err => {
        res.json({
          status: 'fail',
          msg: req.session.userinfo.uname
        })
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
  // user login & permission judgment
  if (req.session.userinfo.uauth == 'admin') {
    if (req.body.udept == 'all') {
      // get all users only by admin
      User.find({}, { _id: 0 })
        .then(userlist => {
          res.json({
            status: 'success',
            user: userlist
          })
        })
        .catch(err => {
          res.json({
            status: 'fail',
            msg: req.body.udept
          })
        })
    } else {
      // get one dept users
      User.find({ udept: req.body.udept }, { _id: 0 })
        .then(userlist => {
          res.json({
            status: 'success',
            user: userlist
          })
        })
        .catch(err => {
          res.json({
            status: 'fail',
            msg: req.body.udept
          })
        })
    }
  } else if (req.session.userinfo.uauth == 'company') {
    // get owned dept users
    User.find({ udept: req.session.userinfo.udept }, { _id: 0 })
      .then(userlist => {
        res.json({
          status: 'success',
          user: userlist
        })
      })
      .catch(err => {
        res.json({
          status: 'fail',
          msg: req.session.userinfo.udept
        })
      })
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// export user router
module.exports = router
