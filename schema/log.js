// schema/log.js
// log schema file

const mongoose = require('mongoose')

// define log schema for log
const LogSchema = mongoose.Schema({
  ldev: String,
  ldep: String,
  lopt: String,
  lusr: String,
  ldat: String
}, { collection: 'log', versionKey: false })

// export log schema
const Log = module.exports = mongoose.model('log', LogSchema)
