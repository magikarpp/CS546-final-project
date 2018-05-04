const data = require('../data');
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const router = express.Router();
const userData = data.users;

router.get("/", async (req, res) => {
  if(req.cookies["AuthCookie"] == undefined){
    res.redirect("/users/login");
  }else{
    res.redirect("/users/account");
  }
});

router.get("/login", (req, res) => {
  res.render("login.handlebars");
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let result = await userData.verifyUserPassword(username, password);

  if(result.status){
    res.cookie("AuthCookie", username);
    res.redirect("/users/account");
  }else{
    res.render("login.handlebars", {
      error: true,
      message: result.message
    });
  }
});

router.get("/account", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    let username = req.cookies["AuthCookie"];
    let userInfo = await userData.getUserByUsername(username);
    console.log(userInfo);

    res.render('account.handlebars', {
      username: userInfo.profile.username,
      bio: userInfo.profile.bio
    });
  } else{
    res.status(403).render("login.handlebars", {
      error: true,
      message: "Not logged in: Login using Username and Password"
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("AuthCookie");
  res.redirect("/users");
});

router.get("/signup", (req, res) => {
  res.render("signup.handlebars");
});

router.post("/signup", async (req, res) => {
  let username = req.body.username;
  let password = userData.createHashedPassword(req.body.password);
  let bio = req.body.bio;
  let newUser = await userData.addUser({username, password, bio});
  res.redirect("/users/login");
});

module.exports = router;
