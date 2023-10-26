const express = require('express');
const Report = require('../../models/Ads');
const upload = require('../../middleware/multer');
const uploadFile = require('../../utils/fileUpload');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find({}).exec();
    return res.json(reports);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) throw new Error("Missing report type!");
    const { name, email, phone } = req.body;
    if (!name || !email || !phone || typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') 
      throw new Error("Invalid fields");

    const report = new Report({type, reporter: {name, email, phone}});
    if (type === "ads") {
      const ads = req.body.ads;
      if (!ads || typeof ads !== "string") throw new Error("Invalid ads");
      report.ads = ads;
    }
    else if (type === "location") {
      const location = req.body.location;
      if (!location || typeof location !== 'string') throw new Error('Invalid ads');
      report.location = location;
    }
    else {
      throw new Error("Something went wrong!")
    }
    await report.save();
  } catch (err) {
    return res.status(400).send(err.message);
  }
})

module.exports = router;