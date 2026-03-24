const express=require('express');
const router=express.Router();
const isloggedin= require('../middlewares/isLoggedIn');
const productModel=require('../models/product-model');
const userModel= require('../models/user-model');

router.get('/',(req,res)=>{
    let error= req.flash("error");
    let created=req.flash("created");
    res.render("index",{error,created,loggedin:false});
})

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
router.get('/cart/remove/:id', isloggedin, async (req, res) => {

    let user = await userModel.findOne({ email: req.user.email });

    // remove item from cart
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

router.get('/checkout', isloggedin, async (req, res) => {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart.product");

    let bill = 0;

    user.cart.forEach(item => {
        bill += (item.product.price - item.product.discount) * item.quantity;
    });

    bill += 20;

    res.render("checkout", { user, bill });
});

router.get('/cart', isloggedin, async (req, res) => {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart.product");

    // 🔥 REMOVE BROKEN ITEMS (VERY IMPORTANT)
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
            // 🔥 OPTIONAL (better UX): remove item if quantity = 1
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

    // 🔍 Check if product already exists in cart
    let existingItem = user.cart.find(item => 
        item.product.toString() === productId
    );

    if (existingItem) {
        // ✅ Increase quantity
        existingItem.quantity += 1;
    } else {
        // ✅ Add new product with quantity
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
