import mongoose from "mongoose";

const catagorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true
    }
})

 const Catagory = mongoose.model("Catagory", catagorySchema)

 export default Catagory