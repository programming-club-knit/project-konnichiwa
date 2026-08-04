const mongoose=require("mongoose");
const memberProfileSchema=new mongoose.Schema({
      name:{
        type:String,
        required:true
    },
      role:{
        type:String,
        required:true
    },
      imageUrl:{
        type:String,
        required:true
    }
})

module.exports = mongoose.models.memberProfile || mongoose.model("memberProfile", memberProfileSchema);