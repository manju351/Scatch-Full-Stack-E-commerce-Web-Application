const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/generateToken");

const sendMail = require("../utils/sendMail");
const { welcomeEmail } = require("../utils/emailTemplates");

module.exports.registerUser = async (req, res) => {
   try {
      let { password, email, fullname } = req.body;

      let user = await userModel.findOne({ email });
      if (user) {
         req.flash("error", "you already have account, please login");
         return res.redirect('/');
      }

      bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.send(err.message);

            let user = await userModel.create({
               email,
               password: hash,
               fullname,
            });

            let token = generateToken(user);
            res.cookie("token", token);

            console.log("UserCreatedSuccessfully");

            try {
               await sendMail({
                  to: user.email,
                  subject: "Welcome to Scatch 🎉",
                  html: welcomeEmail(user.fullname)
               });
            } catch (mailErr) {
               console.log("Email failed:", mailErr.message);
            }

            req.flash("created", "Your Account has been created");
            res.redirect('/');
         });
      });

   } catch (err) {
      res.send(err.message);
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