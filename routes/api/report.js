const express = require('express');
const Report = require('../../models/Report');
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

router.get('/ads', async (req, res) => {
  try {
    const reports = await Report.find({type: "ads"}).exec();
    return res.json(reports);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get('/locations', async (req, res) => {
  try {
    const reports = await Report.find({ type: 'location'}).exec();
    return res.json(reports);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post('/', upload.array("images", 5), async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) throw new Error("Missing report type!");
    const { name, email, phone, content } = req.body;
    if (
      !name ||
      !content ||
      !email ||
      !phone ||
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof content !== 'string' ||
      typeof phone !== 'string'
    )
      throw new Error('Invalid fields');

    const report = new Report({type, content, reporter: {name, email, phone}});
    if (type === "ads") {
      const ads = req.body.ads;
      if (!ads || typeof ads !== "string") throw new Error("Invalid ads");
      report.ads = ads;
      for (let file of req.files) {
        const url = await uploadFile(`adhubpro/reports/ads/${ads}`);
        report.images.push(url);
      }
    }
    else if (type === "location") {
      const location = req.body.location;
      if (!location || typeof location !== 'string') throw new Error('Invalid location');
      report.location = location;
      for (let file of req.files) {
        const url = await uploadFile(`adhubpro/reports/locations/${location}`);
        report.images.push(url);
      }
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