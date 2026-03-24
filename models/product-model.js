const mongoose=require('mongoose');

const postSchema= mongoose.Schema({
    image:Buffer,
    name:String,
    price:Number,
    discount:{
        type:Number,
        default:0,
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    description: String,
    stock: {
     type: Number,
     default: 10
     },
    rating: {
     type: Number,
     default: 4
    },
})

module.exports= mongoose.model("product",postSchema);