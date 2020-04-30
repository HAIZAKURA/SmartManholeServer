// router/device.js
// device router file

const express = require('express')
const router = express.Router()

// import device schema
const Device = require('../schema/device')

// get device interface
router.post('/dev', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // user permission judgment
    if (req.session.userinfo.uauth == 'admin') {
      if (req.body.vdept == 'all') {
        // get all device list while admin request
        Device.find({}, { _id: 0 })
          .then(devlist => {
            res.json({
              status: 'success',
              dev: devlist
            })
          })
          .catch(err => {
            res.json({
              status: 'success',
              msg: req.body.vdept
            })
          })
      } else {
        // get a dept device list while admin request
        Device.find({ vdept: req.body.vdept }, { _id: 0 })
          .then(devlist => {
            res.json({
              status: 'success',
              dev: devlist
            })
          })
          .catch(err => {
            res.json({
              status: 'fail',
              msg: req.body.vdept
            })
          })
      }
    } else if (req.session.userinfo.uauth == 'company') {
      // get owned device list while company request
      Device.find({ vdept: req.session.userinfo.udept }, { _id: 0 })
        .then(devlist => {
          res.json({
            status: 'success',
            dev: devlist
          })
        })
        .catch(err => {
          res.json({
            status: 'fail',
            msg: req.session.userinfo.udept
          })
        })
    }
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// add device interface
router.post('/dev/add', (req, res) => {
  if (req.session.userinfo) {
    // add data
    let addData = { 'vidno': req.body.vidno, 'vname': req.body.vname, 'vposi': req.body.vposi, 'vdept': req.session.userinfo.udept }
    // create device
    Device.create(addData, (err, data) => {
      if (err) {
        res.json({
          status: 'fail',
          msg: req.body.vidno
        })
      } else {
        res.json({
          status: 'success',
          msg: req.body.vidno
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

// delete device interface
router.post('/dev/del', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // user permission judgment
    if (req.session.userinfo.uauth == 'admin') {
      // delete device while admin request
      Device.findOneAndDelete(req.body)
        .then(dev => {
          res.json({
            status: 'success',
            msg: req.body.vidno
          })
        })
        .catch(err => {
          res.json({
            status: 'fail',
            msg: req.body.vidno
          })
        })
    } else if (req.session.userinfo.uauth == 'company' || req.session.userinfo.uauth == 'user') {
      // delete device while company or user request
      Device.findOneAndDelete({ vidno: req.body.vidno, vdept: req.session.userinfo.udept })
        .then(dev => {
          res.json({
            status: 'success',
            msg: req.body.vidno
          })
        })
        .catch(err => {
          res.json({
            status: 'fail',
            msg: req.body.vidno
          })
        })
    }
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// modify device interface
router.post('/dev/mod', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // modify device name
    Device.findOneAndUpdate({ vidno: req.body.vidno, vdept: req.session.userinfo.udept }, { $set: { vname: req.body.vname } })
      .then(dev => {
        res.json({
          status: 'success',
          msg: req.body.vidno
        })
      })
      .catch(err => {
        res.json({
          status: 'fail',
          msg: req.body.vidno
        })
      })
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// update device status interface
router.post('/dev/up', (req, res) => {
  // user login judgment
  if (req.session.userinfo) {
    // update device status
    Device.findOneAndUpdate({ vidno: req.body.vidno, vdept: req.session.userinfo.udept }, { $set: { vstat: req.body.vstat } })
      .then(dev => {
        res.json({
          status: 'success',
          msg: req.body.vidno
        })
      })
      .catch(err => {
        res.json({
          status: 'fail',
          msg: req.body.vidno
        })
      })
  } else {
    res.json({
      status: 'error',
      msg: 'unauthorized'
    })
  }
})

// export device router
module.exports = router
