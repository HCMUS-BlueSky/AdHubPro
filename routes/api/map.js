const express = require("express");
const { Location } = require("../../models/Location");
const { Ads } = require("../../models/Ads");
const router = express.Router();

router.get("/locations", async (req, res) => {
  try {
    const locations = await Location.find({}).exec();
    return res.json(locations);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/ads/:location_id", async (req, res) => {
  const locationID = req.params.location_id;
  try {
    const ads = await Ads.find({ location: locationID })
      .populate("location")
      .exec();
    return res.json(ads);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
