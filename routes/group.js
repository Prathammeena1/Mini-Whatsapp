const mongoose = require('mongoose')

const groupSchema = mongoose.Schema({
  name:String,
  admin:{
    type:mongoose.Schema.Types.ObjectId,ref:'Users'
  },
  members:[{
    type:mongoose.Schema.Types.ObjectId,ref:'Users'
  }],
  profileImage:{
    type:String,
    default:"https://imgs.search.brave.com/GHPH9zd-nQbP6gOqyU8W-z-vsojwu7JHoPeVZroObt4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYXJ0cy5jb20v/ZmlsZXMvMTAvRGVm/YXVsdC1Qcm9maWxl/LVBpY3R1cmUtUE5H/LVBob3RvLnBuZw"
  },
})

module.exports=mongoose.model("Groups",groupSchema);