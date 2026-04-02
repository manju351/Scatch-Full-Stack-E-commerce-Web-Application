const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/generateToken");

const sendMail = require("../utils/sendMail");
const { welcomeEmail } = require("../utils/emailTemplates");

module.exports.registerUser = async (req, res) => {
   try {
      let { password, email, fullname } = req.body;

      let existingUser = await userModel.findOne({ email });
      if (existingUser) {
         req.flash("error", "Already registered, please login");
         return res.redirect('/');
      }

      const hash = await bcrypt.hash(password, 10);

      let user = await userModel.create({
         email,
         password: hash,
         fullname,
      });

      let token = generateToken(user);
      res.cookie("token", token);

      console.log("UserCreatedSuccessfully");

      res.redirect('/'); // send response immediately

     // ✅ Fire-and-forget email (IMPORTANT)
     setImmediate(() => {
     sendMail({
     to: user.email,
     subject: "Welcome to Scatch 🎉",
     html: `<h1>Welcome ${user.fullname}</h1>`
     }).catch(err => console.log(err));
      });

   } catch (err) {
      console.log(err);
      res.send("Something went wrong");
   }
};


          
module.exports.loginUser = async (req, res) => {
   let { email, password } = req.body;

   let user = await userModel.findOne({ email });
   if (!user) {
      req.flash("error", "Email or Password incorrect");
      return res.redirect('/');
   }

   bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
         let token = generateToken(user);
         res.cookie("token", token);

         if (user.role === "admin") {
            return res.redirect('/admin');
         } else {
            return res.redirect('/shop');
         }

      } else {
         req.flash("error", "Email or Password incorrect");
         return res.redirect("/");
      }
   });
};

module.exports.logout = (req, res) => {
   res.cookie("token", "");
   res.redirect('/');
};
