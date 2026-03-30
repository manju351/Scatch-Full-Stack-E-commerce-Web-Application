const express = require('express');
const router = express.Router();
const upload=require('../config/multer-config');

const isLoggedIn = require('../middlewares/isLoggedIn');
const isAdmin = require('../middlewares/isAdmin');
const orderModel=require('../models/order-model')
const userModel = require('../models/user-model');
const productModel = require('../models/product-model');
router.use(isLoggedIn);
router.use(isAdmin);

router.get('/',async (req, res) => {

    const totalProducts = await productModel.countDocuments();
    const users = await userModel.find();

    let totalOrders = 0;
    let totalRevenue = 0;
    let recentOrders = [];

    users.forEach(user => {
        totalOrders += user.orders.length;

        user.orders.forEach(order => {
            totalRevenue += order.totalAmount || 0;

            recentOrders.push({
                userEmail: user.email,
                totalAmount: order.totalAmount,
                date: order.date
            });
        });
    });

    recentOrders = recentOrders.slice(-5).reverse();

    res.render("admin", {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalUsers: users.length,
        recentOrders
    });
});

router.get('/products',async (req, res) => {
    let products = await productModel.find();
    let success= req.flash("success");
    res.render('admin/products', { products ,success});
});
router.get('/products/new',async(req,res)=>{
    let success=req.flash("success");
    res.render('admin/add-product',{success});
})
router.post("/create",upload.single('image'),async (req,res)=>{
  try {  let {name,price,discount,bgcolor,panelcolor,textcolor,rating,stock,description} = req.body;
    let product = await productModel.create({
  image: req.file.buffer,
  name,
  price: Number(price),
  discount: Number(discount),
  bgcolor,
  panelcolor,
  textcolor,
  rating: Number(rating) || 0,
  stock: Number(stock) || 0,
  description: description || "No description available"
});
      req.flash("success","Product has been created successfully");
      res.redirect('/admin/products');
    }
    catch(err){
        res.send(err.message);
    }
});
router.get('/products/delete/:id',async (req, res) => {
    await productModel.findByIdAndDelete(req.params.id);
    req.flash("success","Product has been deleted");
    res.redirect('/admin/products');
});
router.get('/products/edit/:id', async (req, res) => {
    let product = await productModel.findById(req.params.id);
    res.render('admin/edit-product', { product });
});
router.post('/products/edit/:id',async (req, res) => {
    let { name, price, discount, stock, description } = req.body;

    await productModel.findByIdAndUpdate(req.params.id, {
        name,
        price,
        discount,
        stock,
        description
    });
    req.flash("success","Product has been updated");
    res.redirect('/admin/products');
});
router.get('/orders', isAdmin, async (req, res) => {
    let orders = await orderModel
        .find()
        .populate("user")
        .sort({ createdAt: -1 });

    res.render("admin/orders", { orders });
});


router.get('/orders/:orderId', isAdmin, async (req, res) => {

    let order = await orderModel
        .findOne({ orderId: req.params.orderId })
        .populate("products.productId");

    res.render("admin/order-details", { order });
});


router.post('/orders/update-status/:orderId', async (req, res) => {

    const { status } = req.body;

    const sendMail = require("../utils/sendMail");
    const { orderStatusEmail } = require("../utils/emailTemplates");

    let order = await orderModel
        .findOne({ orderId: req.params.orderId })
        .populate("user")
        .populate("products.productId");

    if (!order) {
        return res.send("Order not found");
    }

    if (order.status !== status) {

        order.status = status;

        order.timeline.push({
            status,
            date: new Date()
        });

        await order.save();

        try {
            await sendMail({
                to: order.user.email,
                subject: `Order ${status} 📦`,
                html: orderStatusEmail(order)
            });
        } catch (err) {
            console.log("Email failed:", err.message);
        }
    }

    res.redirect('/admin/orders/' + req.params.orderId);
});
module.exports = router;