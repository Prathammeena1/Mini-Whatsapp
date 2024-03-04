const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
  sender:String,
  reciever:String,
  message:String,
})

module.exports=mongoose.model("Message",messageSchema);