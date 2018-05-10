const data = require('../data');
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const router = express.Router();
const userData = data.users;

router.get("/", async (req, res) => {
  if(req.cookies["AuthCookie"] == undefined){
    res.redirect("/users/login");
  }else{
    res.redirect("/campgrounds");
  }
});

router.get("/login", (req, res) => {
  res.render("user_login.handlebars");
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let result = await userData.verifyUserPassword(username, password);

  if(result.status){
    res.cookie("AuthCookie", username);
    res.redirect("/campgrounds");
  }else{
    res.render("user_login.handlebars", {
      error: true,
      message: result.message
    });
  }
});

router.get("/account", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    let username = req.cookies["AuthCookie"];
    let userInfo = await userData.getUserByUsername(username);

    res.render('user_account.handlebars', {
      username: userInfo.profile.username,
      bio: userInfo.profile.bio,
      campgrounds: userInfo.campgrounds
    });
  } else{
    res.status(403).render("user_login.handlebars", {
      error: true,
      message: "Not logged in: Login using Username and Password"
    });
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("AuthCookie");
  res.redirect("/users");
});

router.get("/signup", (req, res) => {
  res.render("user_signup.handlebars");
});

router.post("/signup", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let bio = req.body.bio;

  let newUser = await userData.addUser({username, password, bio});
  if(newUser.status){
    res.redirect("/users/login");
  }else{
    res.render("user_signup.handlebars", {
      error: true,
      message: newUser.message
    });
  }
});

router.get("/edit", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    let username = req.cookies["AuthCookie"];
    let user = await userData.getUserByUsername(username);
    res.render("user_edit.handlebars", {user});
  }else{
    res.redirect("/users");
  }
});

router.post("/edit", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    let currrentUser = req.cookies["AuthCookie"];

    let user = await userData.getUserByUsername(currrentUser);

    let username = req.body.username;
    let bio = req.body.bio;

    let result = await userData.updateUser(user._id, username, bio);

    if(result.status){
      res.cookie("AuthCookie", username);
      res.redirect("/users/account");
    }else{
      res.render("user_edit.handlebars", {
        user,
        error: true,
        message: result.message
      });
    }
  }else{
    res.redirect("/users");
  }
});

router.get("/delete", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    let currrentUser = req.cookies["AuthCookie"];
    let user = await userData.getUserByUsername(currrentUser);

    let result = await userData.deleteUser(user._id);

    if(result.status){
      res.clearCookie("AuthCookie");
      res.render("user_login.handlebars", {
        error: true,
        message: result.message
      });
    }else{
      res.render("user_edit.handlebars", {
        user,
        error: true,
        message: result.message
      });
    }
  }else{
    res.redirect("/users");
  }
});

router.get("/seed", async (req, res) => {
    let userList = await userData.getAllUsers();
    if (userList.length == 0){
      await userData.addUser({username: "username", password: "password", bio: "bio"});
      res.redirect("/campgrounds/seed");
    }
    else{
      res.redirect("/users");
    }
});









module.exports = router;
