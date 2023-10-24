const express = require('express');
const Location = require('../../models/Location');
const Ads = require('../../models/Ads');
const upload = require('../../middleware/multer');
const uploadFile = require('../../utils/fileUpload');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const ads = await Ads.find({}).exec();
    return res.json(ads);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get('/get-detail', async (req, res) => {
  try {
    const ads = await Ads.find({}).populate('location').exec();
    return res.json(ads);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get('/get-detail/:location_id', async (req, res) => {
  const locationID = req.params.location_id;
  try {
    const ads = await Ads.find({ location: locationID })
      .populate('location')
      .exec();
    return res.json(ads);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;