const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },

  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user",
  required: true
},

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
       },
       quantity: Number
       }
      ],
    total: Number,

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

  orderDate: {
    type: Date,
    default: Date.now
  },
  address:{
    name:String,
    phoneno:Number,
    location:String,
    pincode:Number,
  },

}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);