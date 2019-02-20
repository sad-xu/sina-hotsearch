const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  openid: {
    type: String,
    required: true,
    unique: true
  },
  essayflag: {  // 是否触发过隐藏条件
    type: Boolean,
    default: false
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
