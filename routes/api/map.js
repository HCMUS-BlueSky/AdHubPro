const express = require("express");
const { Location } = require("../../models/Location");
const { Ads } = require("../../models/Ads");
const Enum = require('../../models/Enum');
const Report = require("../../models/Report");
const router = express.Router();
const upload = require('../../middleware/multer');

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

router.get("/report/ads/:ads_id", async (req, res) => {
  const adsID = req.params.ads_id;
  try {
    const reports = await Report.find({ ads: adsID }).exec();
    return res.json(reports);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/report/location/:location_id", async (req, res) => {
  const locationID = req.params.location_id;
  try {
    const reports = await Report.find({ location: locationID }).exec();
    return res.json(reports);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post('/report', upload.array('images', 5), async (req, res) => {
  try {
    const { type } = req.body;
    if (!type || typeof type !== 'string') throw new Error('Loại báo cáo không hợp lệ!');
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
      throw new Error('Dữ liệu truyền vào không hợp lệ');
    if (type !== 'Điểm đặt quảng cáo' && type !== 'Bảng quảng cáo')
      throw new Error('Loại báo cáo không hợp lệ!');
    const methodExisted = await Enum.exists({
      name: 'ReportMethod',
      values: method
    }).exec();
    if (!methodExisted) throw new Error('Hình thức báo cáo không hợp lệ!');

    const report = new Report({
      type,
      content,
      method,
      reporter: { name, email, phone }
    });

    const location = req.body.location;
    if (!location || typeof location !== 'string')
      throw new Error('Địa điểm không hợp lệ');
    const locationExisted = await Location.exists({
      _id: location
    }).exec();
    if (!locationExisted) throw new Error('Địa điểm không hợp lệ!');
    report.location = location;
    if (type === 'Bảng quảng cáo') {
      const ads = req.body.ads;
      if (!ads || typeof ads !== 'string') throw new Error('Bảng quảng cáo không hợp lệ!');
      const adsExisted = await Ads.exists({
        _id: ads
      }).exec();
      if (!adsExisted) throw new Error('Bảng quảng cáo không hợp lệ!');
      report.ads = ads;
    }
    if (req.files && req.files.length) {
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
});

module.exports = router;
