var express = require("express");
const axios = require("axios");
var router = express.Router();
const base_url = "https://osf-digital-backend-academy.herokuapp.com/api/";
let validate=require('./validate');
const e = require("express");
const secretKey =
  "$2a$08$lML.B7qZIg21DSluOUPRKecTrsl0lQ0O/j5FXnQZXZGoB8pmSRHu6";
  router.get("/login", (req, res) => {
    res.render("login");
  });
  router.post("/accountlogin", (req, res) => {
    if(validate.validate(req.body.email)){
    var data = {};
    data.secretKey =
      "$2a$08$lML.B7qZIg21DSluOUPRKecTrsl0lQ0O/j5FXnQZXZGoB8pmSRHu6";
    data.email = req.body.email;
    data.password = req.body.password;
    axios
      .post(`${base_url}/auth/signin`, {
        secretKey: "$2a$08$lML.B7qZIg21DSluOUPRKecTrsl0lQ0O/j5FXnQZXZGoB8pmSRHu6",
        email: data.email,
        password: data.password,
      })
      .then(function (response) {
        res.cookie("loggedIn", response.data);
        res.redirect("/");
      })
      .catch((error) => {
        res.render("login", { error: error.response.data.error });
      });
    }
    else
      {
        res.render("login", { error:'Invalid email format'});

      }
  });
  router.get("/register", (req, res) => {
    res.render("signup");
  });
  router.post("/createaccount", (req, res) => {
    var data = {};
    if(validate.validate(req.body.email) && req.body.password.length>6){
    data.secretKey =
      "$2a$08$lML.B7qZIg21DSluOUPRKecTrsl0lQ0O/j5FXnQZXZGoB8pmSRHu6";
    data.name = req.body.name;
    data.email = req.body.email;
    data.password = req.body.password;
    axios
      .post(`${base_url}/auth/signup`, {
        secretKey: "$2a$08$lML.B7qZIg21DSluOUPRKecTrsl0lQ0O/j5FXnQZXZGoB8pmSRHu6",
        name: data.name,
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        res.cookie("loggedIn", response.data), 
        res.redirect("/");
      })
      .catch((error) => {
        res.render("signUp", { error: error.response.data.error });
      });
    }
    else if(validate.validate(req.body.email)===false)
        res.render("signUp", { error:"Invalid mail" });
    else  
      res.render("signUp", { error:"Password too short" });

   });
  router.get("/logout", (req, res) => {
    res.clearCookie("loggedIn");
    res.redirect("/");
  });
module.exports=router