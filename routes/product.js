var express = require("express");
const axios = require("axios");
var router = express.Router();
const base_url = "https://osf-digital-backend-academy.herokuapp.com/api/";

const secretKey =
  "$2a$08$lML.B7qZIg21DSluOUPRKecTrsl0lQ0O/j5FXnQZXZGoB8pmSRHu6";
 
  router.get("/men", (req, res) => {
    var item = {};
    let url = `${base_url}/categories/parent/mens-clothing?secretKey=${secretKey}`;
    axios({
      method: "get",
      url,
    })
      .then(function (response) {
        item = JSON.parse(JSON.stringify(response.data));
        res.render("men", { items: item });
      })
      .catch(function (error) {
        console.log(error);
      });
  });
  router.get("/women", (req, res) => {
    var item = {};
    let url = `${base_url}/categories/parent/womens-clothing?secretKey=${secretKey}`;
    axios({
      method: "get",
      url,
    })
      .then(function (response) {
        item = JSON.parse(JSON.stringify(response.data));
        res.render("women", { items: item });
      })
      .catch(function (error) {
        console.log(error);
      });
  });
  router.get("/men/:id", (req, res) => {
    var page = +req.query.page + 1;
    var item = {};
    var currentUrl = req.url;
    let url = `${base_url}/products/product_search?page=${req.query.page}&primary_category_id=${req.params.id}&secretKey=${secretKey}`;
    axios({
      method: "get",
      url,
    })
      .then(function (response) {
        lastPage = req.query.page;
        item = JSON.parse(JSON.stringify(response.data));
        res.render("search", { items: item, page: page, url: currentUrl });
      })
      .catch(function (error) {
        var page = +req.query.page-1;
        res.redirect(`/product/men/${req.params.id}?page=${page}`);
      });
  });
  router.get("/women/:id", (req, res) => {
    var page = +req.query.page;
    var item = {};
    var currentUrl = req.url;
    let url = `${base_url}/products/product_search?page=${req.query.page}&primary_category_id=${req.params.id}&secretKey=${secretKey}`;
    axios({
      method: "get",
      url,
    })
      .then(function (response) {
        lastPage = req.query.page;
        item = JSON.parse(JSON.stringify(response.data));
        res.render("search", { items: item, page: page, url: currentUrl });
      })
      .catch(function (error) {
        var page = +req.query.page-1;
        res.redirect(`/product/women/${req.params.id}?page=${page}`);
      });
  });
  router.get("/id=:productId", (req, res) => {
    var item = {};
    let url = `${base_url}/products/product_search?id=${req.params.productId}&secretKey=${secretKey}`;
    axios({
      method: "get",
      url,
    })
      .then(function (response) {
        item = JSON.parse(JSON.stringify(response.data));
        res.render("details", { item: item });
        //res.send(item);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
module.exports=router