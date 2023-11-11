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

// router.post('/test' ,async (req, res) => {
//   try {
//     // console.log(req.files);
//     // const urls = []
//     // for(let file of req.files) {
//     //   const url = await uploadFile(`adhubpro/ads`, file);
//     //   urls.push(url);
//     // }
//     // console.log(urls);
//     const ads = await Ads.find({}).exec();
//     const types = [
//       'Trụ bảng hiflex',
//       'Trụ màn hình điện tử LED',
//       'Trụ hộp đèn',
//       'Bảng hiflex ốp tường',
//       'Màn hình điện tử ốp tường',
//       'Trụ treo băng rôn dọc',
//       'Trụ treo băng rôn ngang',
//       'Trụ/Cụm pano',
//       'Cổng chào',
//       'Trung tâm thương mại'
//     ];
//     for(let ad of ads) {
//       const type = types[Math.floor(Math.random() * types.length)];
//       const size = '2.5m x 10m';
//       await Ads.findByIdAndUpdate(ad.id, {type, size}).exec();
//     }
//     return res.send("SUCCESS")
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// });

module.exports = router;