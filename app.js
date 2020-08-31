const express = require("express");
const axios = require("axios");
const https = require("https");
const path = require("path");
const cookie = require("cookie-parser");
const action=require('./routes/actions')
const product=require('./routes/product')
const user=require('./routes/user')
const app = express();
const PORT=process.env.PORT||3000
const { SSL_OP_PKCS1_CHECK_1 } = require("constants");
const { response } = require("express");
var lastPage;
app.use(express.static(path.join(__dirname, "public")));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookie());

var element;
const base_url = "https://osf-digital-backend-academy.herokuapp.com/api/";
const secretKey =
  "$2a$08$lML.B7qZIg21DSluOUPRKecTrsl0lQ0O/j5FXnQZXZGoB8pmSRHu6";
app.set("view engine", "pug");
app.use(express.json())
app.use('/cart',action)
app.use('/product',product)
app.use('/user',user)
app.get("/", (req, res) => {
  let url = `${base_url}/categories?secretKey=${secretKey}`;
  axios({
    method: "get",
    url,
  })
    .then(function (response) {
      item = JSON.parse(JSON.stringify(response.data));
      res.render("index", { items: item });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.listen(PORT, () => {
  console.log("Your app is running");
});

