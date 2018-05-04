const data = require('../data');
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const router = express.Router();
const campgroundData = data.campgrounds;

router.post("/", async (req, res) => {
    try {
      //console.log("Got to the POST route!");
      let newCampground = await campgroundData.addCampground(req.body);

      res.json(newCampground);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;