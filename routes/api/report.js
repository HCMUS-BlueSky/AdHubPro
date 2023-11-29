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
    const { name, email, phone, content, method } = req.body;
    if (
      !name ||
      !content ||
      !email ||
      !phone ||
      !method ||
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof content !== 'string' ||
      typeof phone !== 'string' ||
      typeof method !== 'string'
    )
      throw new Error('Invalid fields');
    if (type !== 'Điểm đặt quảng cáo' && type !== 'Bảng quảng cáo') throw new Error('Invalid type');
    const report = new Report({type, content, method, reporter: {name, email, phone}});
    const location = req.body.location;
    if (!location || typeof location !== 'string') throw new Error('Invalid location');
    report.location = location;
    if (type === 'Bảng quảng cáo') {
      const ads = req.body.ads;
      if (!ads || typeof ads !== 'string') throw new Error('Invalid ads');
      report.ads = ads;
    }
    if (req.files) {
      for (let file of req.files) {
        const url = await uploadFile(`reports/locations/${location}`, file);
        report.images.push(url);
      }
    }
    await report.save();
    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(err.message);
  }
})

module.exports = router;