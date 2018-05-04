const data = require('../data');
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const router = express.Router();
//Move to separate route file for users:
const userData = data.users;

router.post("/", async (req, res) => {
    try {
      console.log("Got to the POST route!");
      let newUser = await userData.addUser(req.body);

      res.json(newUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

// const constructorMethod = (app) => {
//     app.get("/", (req, res) => {
//       if(req.cookies["AuthCookie"] == undefined){
//         res.redirect("/login");
//       }else{
//         res.redirect("/account");
//       }
//     })

//     app.get("/signup", (req, res) => {
//       res.render("signup.handlebars");
//     })

//     app.get("/login", (req, res) => {
//       res.render("login.handlebars");
//     })

//     app.post("/login", (req, res) => {
//       let username = req.body.username;
//       let password = req.body.password;
//       let result = users.verifyUserPassword(username, password);

//       if(result.status){
//         res.cookie("AuthCookie", username);
//         res.redirect("/account");
//       }else{
//         res.render("login.handlebars", {
//           error: true,
//           message: result.message
//         });
//       }
//     })

//     app.get("/account", (req, res) => {
//       if(req.cookies["AuthCookie"] != undefined){
//         let username = req.cookies["AuthCookie"];
//         let userInfo = users.getUserByUsername(username);

//         res.render('account.handlebars', {
//           username: username,
//           firstName: userInfo.firstName,
//           lastName: userInfo.lastName,
//           profession: userInfo.profession,
//           bio: userInfo.bio
//         });
//       } else{
//         res.status(403).render("login.handlebars", {
//           error: true,
//           message: "Not logged in: Login using Username and Password"
//         });
//       }
//     })

//     app.get("/logout", (req, res) => {
//       res.clearCookie("AuthCookie");
//       res.redirect("/");
//     })
// };

// module.exports = constructorMethod;
