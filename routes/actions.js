var express = require("express");
const axios = require("axios");
var router = express.Router();
const base_url = "https://osf-digital-backend-academy.herokuapp.com/api/";

const secretKey =
  "$2a$08$lML.B7qZIg21DSluOUPRKecTrsl0lQ0O/j5FXnQZXZGoB8pmSRHu6";

router.use(function(req,res,next){
  next();
})
router.get("/", (req, res) => {
  var user = req.cookies["loggedIn"];
  if (user) {
    let url = `${base_url}/cart?secretKey=${secretKey}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        var quantity = [];
        var urlArray = [];
        var variantId = [];
        for (var i = 0; i < response.data.items.length; i++) {
          urlArray.push(
            `${base_url}/products/product_search?id=${response.data.items[i].productId}&secretKey=${secretKey}`
          );
          quantity[i] = response.data.items[i].quantity;
          variantId[i] = response.data.items[i].variant.product_id;
        }
        var item = [];
        axios.all(urlArray.map((l) => axios.get(l))).then(
          axios.spread(function (...response) {
            for (var i in response) {
              var object = new Object();
              object.data = response[i].data;
              object.quantity = quantity[i];
              object.variant = variantId[i];
              item.push(object);
            }

           res.render("cart", { item: item || [] });

            //res.send(item)
          })
        );
      })
      .catch((error) => {
        res.render("cart", { item:[],error: error.response.data.error });
      });
  } else {
    res.render("login", { error: "You need to login to view you cart" });
  }
});
router.post("/buy", (req, res) => {
  var user = req.cookies["loggedIn"];
  if (!user) {
    res.render("login", { error: "You need to login first" });
  } else {
    var data = new Object();
    let url;
    data = req.body;
    if (req.body.button === "Cart") {
      url = `${base_url}/cart/addItem`;
    } else {
      url = `${base_url}/wishlist/addItem`;
    }
    axios
      .post(
        url,
        {
          secretKey: secretKey,
          productId: req.body.id,
          variantId: req.body.size,
          quantity: req.body.quantity,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((response) => {
        res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
router.get("/wishlist", (req, res) => {
  var user = req.cookies["loggedIn"];
  if (user) {
    let url = `${base_url}/wishlist?secretKey=${secretKey}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        var quantity = [];
        var urlArray = [];
        var variantId = [];
        for (var i = 0; i < response.data.items.length; i++) {
          urlArray.push(
            `${base_url}/products/product_search?id=${response.data.items[i].productId}&secretKey=${secretKey}`
          );
          quantity[i] = response.data.items[i].quantity;
          variantId[i] = response.data.items[i].variant.product_id;
        }
        var item = [];
        axios.all(urlArray.map((l) => axios.get(l))).then(
          axios.spread(function (...response) {
            for (var i in response) {
              var object = new Object();
              object.data = response[i].data;
              object.quantity = quantity[i];
              object.variant = variantId[i];
              item.push(object);
            }
            res.render("cart", { item: item || [] });
           // res.send(item)
          })
        );
      })
      .catch((error) => {
        res.render("cart", {item:[],error: "Your wishlist is empty" });
      });
  } else {
    res.render("login", { error: "You need to login to view you wishlist" });
  }
});
router.post("/updateQuantity", (req, res) => {
  var data = req.body;
  var user = req.cookies["loggedIn"];
  if (req.body.action === "+") {
    data.quantity++;
    let url = `${base_url}/cart/changeItemQuantity`;
    axios.post(
        url,
        {
          secretKey: secretKey,
          productId: data.id,
          variantId: data.variantId,
          quantity: data.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        
        res.redirect("/cart");
      })
      .catch((error) => {
        console.log(error);
      });
  } 
  else if(req.body.action==='-') {
    data.quantity--;
    if (data.quantity > 0) {
      let url = `${base_url}/cart/changeItemQuantity`;
      axios
        .post(
          url,
          {
            secretKey: secretKey,
            productId: data.id,
            variantId: data.variantId,
            quantity: data.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => {
          
          res.redirect("/cart");
        })
        .catch((error) => {
          console.log(error);
        });
      }
  }  
});
router.delete('/delete',(req,res)=>{
  console.log(req.body)
})
module.exports = router;
