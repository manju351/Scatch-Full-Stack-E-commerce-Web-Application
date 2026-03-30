const express=require('express');
const router=express.Router();
const isloggedin= require('../middlewares/isLoggedIn');
const productModel=require('../models/product-model');
const userModel= require('../models/user-model');
const orderModel = require('../models/order-model');
const BASE_URL = "http://10.14.12.216:3000/";
const sendMail = require("../utils/sendMail");
const { orderPlacedEmail } = require("../utils/emailTemplates");
function generateOrderId() {
    return "ORD-" + Date.now();
}
require('dotenv').config();
const Stripe = require("stripe");
const isLoggedIn = require('../middlewares/isLoggedIn');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
router.get('/',(req,res)=>{
    let error= req.flash("error");
    let created=req.flash("created");
    
    res.render("index",{error,created,loggedin:false});
})

router.post('/place-order', isloggedin, async (req, res) => {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart.product");

    let { name, phone, address, pincode } = req.body;

    // 🔥 Create line items
         let line_items = user.cart.map(item => ({
       price_data: {
       currency: "inr",
       product_data: {
       name: item.product.name,
      },
       unit_amount: (item.product.price - item.product.discount) * 100 // ✅ ONLY THIS
     },
    quantity: item.quantity
     }));
     const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: line_items,

     mode: 'payment',

     // ✅ ADD PLATFORM FEE HERE
     shipping_options: [
       {
         shipping_rate_data: {
           type: 'fixed_amount',
           fixed_amount: {
             amount: 2000, // ₹20
             currency: 'inr',
           },
           display_name: 'Platform Fee',
         },
       },
     ],

           success_url: `${BASE_URL}success?session_id={CHECKOUT_SESSION_ID}`,
           cancel_url: `${BASE_URL}/cancel`,

        // 🔥 store address temporarily
        metadata: {
            name,
            phone,
            address,
            pincode,
            userId: user._id.toString()
        }
    });

    res.redirect(session.url);
});

router.get('/success', isloggedin, async (req, res) => {

    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    const { name, phone, address, pincode, userId } = session.metadata;

    let user = await userModel
        .findById(userId)
        .populate("cart.product");

    function generateOrderId() {
        return "ORD-" + Date.now();
    }

    const orderId = generateOrderId();

    let products = user.cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
    }));

    let total = user.cart.reduce((acc, item) => {
        return acc + (item.product.price - item.product.discount) * item.quantity;
    }, 0);
      total+=20;
    await orderModel.create({
        orderId,
        user: user._id,
        products,
        total,
        status: "Pending",

        address: {
            name,
            phoneno: phone,
            location: address,
            pincode
        }
    });

    user.orders.push({
        orderId,
        items: user.cart,
        totalAmount: total,
        status: "Pending",
        date: new Date(),

        address: {
            name,
            phoneno: phone,
            location: address,
            pincode
        }
    });

    user.cart = [];
     
    await user.save();
    let order = await orderModel
        .findOne({orderId})
        .populate("products.productId")
     await sendMail({
         to: user.email,
         subject: "Order Confirmed 🎉",
         html: orderPlacedEmail(order)
});
    res.render("success");
});

router.get('/cancel', (req, res) => {
    res.send("❌ Payment Cancelled");
});

router.get('/orders', isloggedin, async (req, res) => {

    let user = await userModel.findOne({ email: req.user.email });

    let orders = await orderModel
        .find({ user: user._id })
        .populate("products.productId")
        .sort({ createdAt: -1 });

    res.render("orders", { orders });
});

router.get('/orders/:orderId', isloggedin, async (req, res) => {

    let order = await orderModel
        .findOne({ orderId: req.params.orderId })
        .populate("products.productId")
        .populate("user");

    if (!order) {
        return res.send("Order not found");
    }

    res.render("order-details", { order });
});
router.get('/checkout', isloggedin, async (req, res) => {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart.product");

    let bill = 0;
    let totalItems = 0;

    user.cart.forEach(item => {
        bill += (item.product.price - item.product.discount) * item.quantity;
        totalItems += item.quantity;
    });

    bill += 20;

    res.render("checkout", { user, bill, totalItems });
});

router.get('/product/:id', async (req, res) => {
    let product = await productModel.findById(req.params.id);
    res.render("product", { product });
});
router.get('/product/:id/image', async (req, res) => {
  let product = await productModel.findById(req.params.id);
  res.set("Content-Type", "image/jpeg");
  res.send(product.image);
});
router.get('/cart/remove/:id', isloggedin, async (req, res) => {

    let user = await userModel.findOne({ email: req.user.email });

    user.cart = user.cart.filter(item => 
        item.product.toString() !== req.params.id
    );

    await user.save();

    res.redirect('/cart');
});

router.get('/shop',isloggedin, async (req,res)=>{
    let products= await productModel.find();
    let added=req.flash("added");
    res.render("shop",{products,added});
})

router.get('/cart', isloggedin, async (req, res) => {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart.product");

    user.cart = user.cart.filter(item => item.product);
    await user.save();

    let bill = 0;

    user.cart.forEach(item => {
        bill += (item.product.price - item.product.discount) * item.quantity;
    });

    bill += 20;

    res.render("cart", { user, bill });
});

router.get('/cart/increase/:id', isloggedin, async (req, res) => {

    let user = await userModel.findOne({ email: req.user.email });

    let item = user.cart.find(i => 
        i.product.toString() === req.params.id
    );

    if (item) {
        item.quantity += 1;
    }

    await user.save();
    res.redirect('/cart');
});

router.get('/cart/decrease/:id', isloggedin, async (req, res) => {

    let user = await userModel.findOne({ email: req.user.email });

    let item = user.cart.find(i => 
        i.product.toString() === req.params.id
    );

    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            user.cart = user.cart.filter(i => 
                i.product.toString() !== req.params.id
            );
        }
    }

    await user.save();
    res.redirect('/cart');
});

router.get('/addtocart/:id', isloggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    let productId = req.params.id;

    let existingItem = user.cart.find(item => 
        item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cart.push({
            product: productId,
            quantity: 1
        });
    }

    await user.save();

    req.flash("added", "Added to cart");
    res.redirect('/shop');
});

router.get('/logout',isloggedin,async (req,res)=>{
    res.redirect('/');
})

module.exports = router;
