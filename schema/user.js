// schema/user.js
// user schema file

const mongoose = require('mongoose')

// define data schema for user
const UserSchema = mongoose.Schema({
  uname: { type: String, index: true, unique: true },
  upass: String,
  uauth: String,
  udept: String
}, { collection: 'user', versionKey: false })

// export user schema
const User = module.exports = mongoose.model('user', UserSchema)
