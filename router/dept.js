// router/dept.js
// dept router file

const express = require('express')
const router = express.Router()

// import dept schema
const Dept = require('../schema/dept')

// dept list get interface
router.post('/dept', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // user permission judgment
    if (req.session.userinfo.uauth == 'admin') {
      // get dept list
      Dept.find({}, {_id: 0})
        .then(deptlist => {
          res.json({
            status: 'success',
            dept: deptlist
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

// dept add interface
router.post('/dept/add', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // user permission judgment
    if (req.session.userinfo.uauth == 'admin') {
      // create dept
      Dept.create(req.body, (err, data) => {
        if (err) {
          res.json({
            status: 'fail',
            msg: req.body.dname
          })
        } else {
          res.json({
            status: 'success',
            msg: req.body.dname
          })
        }
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

// dept del interface
router.post('/dept/del', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // user permission judgment
    if (req.session.userinfo.uauth == 'admin') {
      // delete dept
      Dept.findOneAndDelete(req.body)
        .then(dept => {
          res.json({
            status: 'success',
            msg: req.body.dname
          })
        })
        .catch(err => {
          res.json({
            status: 'fail',
            msg: req.body.dname
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

// dept mod interface
router.post('/dept/mod', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // user permission judgment
    if (req.session.userinfo.uauth == 'admin') {
      // modify dept
      Dept.findOneAndUpdate({ dname: req.body.dname }, { $set: { ddesc: req.body.ddesc } }, { new: true })
        .then(dept => {
          res.json({
            status: 'success',
            msg: req.body.dname
          })
        })
        .catch(err => {
          res.json({
            status: 'fail',
            msg: req.body.dname
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

module.exports = router
