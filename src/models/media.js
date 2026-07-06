const mongoose=require("mongoose");
const mediaSchema= new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true 
  },
  fileSize: {
    type: Number, 
    required: true
  },
  s3Key: {
    type: String,
    required: true
  },
  thumbnailKey: {
    type: String,
    default: null 
  }, 
  UploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},
 { timestamps: true });


module.exports =  mongoose.model("Media",mediaSchema);