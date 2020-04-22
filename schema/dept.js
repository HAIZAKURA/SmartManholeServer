// schema/dept.js
// dept schema file

const mongoose = require('mongoose')

// define data schema for dept
const DeptSchema = mongoose.Schema({
  dname: { type: String, index: true, unique: true },
  ddesc: String
}, { collection: 'dept', versionKey: false })

// export user schema
const Dept = module.exports = mongoose.model('dept', DeptSchema)
