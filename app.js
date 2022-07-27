//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//const _ = require("lodash");
//const client = require("mailchimp-marketing");
const https = require("https");
//const request = require("request");
const mongoose = require ("mongoose");
const encrypt = require('mongoose-encryption');

//console.log(process.env.API_KEY);


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema   = new mongoose.Schema ({

    email:String,
    password:String

});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ['password']});

const User = mongoose.model("user",userSchema);

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home")
});


app.get("/login",function(req,res){
  res.render("login")
});

app.get("/register",function(req,res){
  res.render("register")
})


app.post("/register",function(req,res){
  var username = req.body.username;
  var password = req.body.password

 const newUser = new User ({
   email:username,
   password:password
 });
 newUser.save(function(err){
   if (err){
     console.log(err);
   } else{
     res.render("secrets");
   }
 })

})

app.post("/login",function(req,res){
  var username = req.body.username;
  var password = req.body.password
User.findOne({email:username},function(err,foundUser){
  if (err){
    console.log(err);
  }else {
    if (foundUser){
      if (foundUser.password === password) {
        res.render("secrets")
      } else {
        res.render ("goback");
      }
    }
  }
})

})









app.listen(3000,function(){
  console.log("Server is running on Port 3000");
})
