const data = require('../data');
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const router = express.Router();
const campgroundData = data.campgrounds;

router.get("/", async (req, res) => {
  let campgroundList = await campgroundData.getAllCampgrounds();
  res.render("campground_list.handlebars",{campgrounds: campgroundList});
});

router.get("/:id", async (req, res) => {
  let campground = await campgroundData.getCampById(req.params.id);
  res.render("campground_details.handlebars",{campground: campground});
});

router.get("/new", (req, res) => {
  res.render("campground_new.handlebars");
});

router.post("/new", async (req, res) => {
    try {
      let newCampground = await campgroundData.addCampground(req.body);

      res.redirect("/campgrounds");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
