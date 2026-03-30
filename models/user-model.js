const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    orders: [
      {
        orderId: {
           type:String,
        },
        items: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'product'
            },
            quantity: Number
          }
        ],
        status: {
            type: String,
            enum: ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
            default: "Pending"
             },
        timeline: [
          {
             status: String,
             date: {
             type: Date,
            default: Date.now
            }
          }
               ],

       isCancelled: {
           type: Boolean,
           default: false
           },
        totalAmount: Number,
        date: {
          type: Date,
          default: Date.now
        },
       address:{
         name:String,
         phoneno:Number,
         location:String,
         pincode:Number,
       }

      }
    ],
    role:{
      type:String,
      default:"user",
    },
    contact: Number,
    picture: String,
});

module.exports = mongoose.model("user", userSchema);