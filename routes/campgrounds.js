const data = require('../data');
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const router = express.Router();
const campgroundData = data.campgrounds;

router.get("/", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    let campgroundList = await campgroundData.getAllCampgrounds();
    res.render("campground_list.handlebars",{campgrounds: campgroundList});
  }else{
    res.render("user_login.handlebars", {
      error: true,
      message: "Not logged in: Login using Username and Password"
    });
  }
});

router.get("/new", (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    res.render("campground_new.handlebars");
  }else{
    res.render("user_login.handlebars", {
      error: true,
      message: "Not logged in: Login using Username and Password"
    });
  }
});

router.get("/id/:id", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    let campground = await campgroundData.getCampById(req.params.id);
    let isOwner = false;
    if(req.cookies["AuthCookie"] == campground.owner){
      isOwner = true;
    }
    res.render("campground_details.handlebars",{campground: campground, isOwner: isOwner});
  }else{
    res.render("user_login.handlebars", {
      error: true,
      message: "Not logged in: Login using Username and Password"
    });
  }
});

router.get("/edit/id/:id", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    let campground = await campgroundData.getCampById(req.params.id);
    res.render("campground_edit.handlebars",{campground: campground});
  }else{
    res.render("user_login.handlebars", {
      error: true,
      message: "Not logged in: Login using Username and Password"
    });
  }
});

router.get("/delete/:id", async (req, res) => {
  if(req.cookies["AuthCookie"] != undefined){
    await campgroundData.removeCampById(req.params.id);
    res.redirect("/campgrounds");
    //res.render("campground_edit.handlebars",{campground: campground});
  }else{
    res.render("user_login.handlebars", {
      error: true,
      message: "Not logged in: Login using Username and Password"
    });
  }
});


router.post("/new", async (req, res) => {
    try {
      let data = "";
      if(req.files.pic){
        data ='data:' + req.files.pic.mimetype + ';base64,' + req.files.pic.data.toString('base64');
        //console.log(data.slice(0,100));
      }
      else{
        console.log("Didn't upload a file..");
      }
      let newCampground = await campgroundData.addCampground(req.body, data, req.cookies["AuthCookie"]);



      res.redirect("/campgrounds");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/edit/info/:id", async (req, res) => {
  try {
    await campgroundData.updateCampById(req.params.id, req.body);

    res.redirect("/campgrounds/id/" + req.params.id);
} catch (e) {
  res.status(500).json({ error: e.message });
}
});

router.post("/review/:id", async (req, res) => {
  try {
    await campgroundData.addReviewById(req.params.id, req.body, req.cookies["AuthCookie"]);

    res.redirect("/campgrounds/id/" + req.params.id);
} catch (e) {
  res.status(500).json({ error: e.message });
}
});

module.exports = router;
