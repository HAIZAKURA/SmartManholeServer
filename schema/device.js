// schema/device.js
// device schema file

const mongoose = require('mongoose')

// define device schema for device
const DeviceSchema = mongoose.Schema({
  vidno: { type: String, index: true, unique: true },
  vname: String,
  vposi: String,
  vdept: String,
  vstat: String
}, { collection: 'device', versionKey: false })

// export device schema
const Device = module.exports = mongoose.model('device', DeviceSchema)
