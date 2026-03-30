require("dotenv").config();
const express=require('express');
const app=express();
const cookieParser= require('cookie-parser');
const path=require('path');
const adminRouter= require("./routes/adminRouter");
const usersRouter= require('./routes/usersRouter');
const productsRouter= require('./routes/productsRouter');
const indexRouter=require('./routes/index');
const db=require('./config/mongoose-connection');
const expressSession=require('express-session');
const flash= require('connect-flash');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public'))); 
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
    })
);
app.use(flash());
app.set('view engine','ejs');

app.use('/admin',adminRouter);
app.use("/users",usersRouter);
app.use("/products",productsRouter);
app.use("/",indexRouter);
app.listen(3000, '0.0.0.0', () => {
  console.log("Server running");
});