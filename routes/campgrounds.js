const data = require('../data');
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const router = express.Router();
const campgroundData = data.campgrounds;

router.get("/", (req, res) => {
  res.render("campground_list.handlebars");
});

router.get("/new", (req, res) => {
  res.render("campground_new.handlebars");
});

router.post("/new", async (req, res) => {
    try {
      let newCampground = await campgroundData.addCampground(req.body);

      res.json(newCampground);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
