const data = require('../data');
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const router = express.Router();
const campgroundData = data.campgrounds;

router.get("/", async (req, res) => {
  let campgroundList = await campgroundData.getAllCampgrounds();
  res.render("campground_list.handlebars",{campgrounds: campgroundList});
});

router.get("/new", (req, res) => {
  res.render("campground_new.handlebars");
});

router.get("/id/:id", async (req, res) => {
  let campground = await campgroundData.getCampById(req.params.id);
  res.render("campground_details.handlebars",{campground: campground});
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
      let newCampground = await campgroundData.addCampground(req.body, data);
      
      

      res.redirect("/campgrounds");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
