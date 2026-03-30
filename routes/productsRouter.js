const express=require('express');
const router = express.Router();
const upload=require('../config/multer-config');
const productModel= require('../models/product-model');

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
      res.redirect('/owners/admin');
    }
    catch(err){
        res.send(err.message);
    }
});

module.exports= router;