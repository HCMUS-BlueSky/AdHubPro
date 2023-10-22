const express = require('express');
const Location = require('../../models/Location');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({}).exec();
    return res.json(locations);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
