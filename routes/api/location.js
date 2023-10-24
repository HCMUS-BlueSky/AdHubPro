const express = require('express');
const Location = require('../../models/Location');
const Ads = require('../../models/Ads');
const upload = require('../../middleware/multer');
const uploadFile = require('../../utils/fileUpload');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({}).exec();
    return res.json(locations);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// function makeid(length) {
//   let result = '';
//   const characters =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// }

// function generateRandomDate(from, to) {
//   return new Date(
//     from.getTime() + Math.random() * (to.getTime() - from.getTime())
//   );
// }

// router.post('/', upload.array("images", 5) ,async (req, res) => {
//   try {
//     // console.log(req.files);
//     const urls = []
//     for(let file of req.files) {
//       const url = await uploadFile(`adhubpro/ads`, file);
//       urls.push(url);
//     }
//     console.log(urls);
//     const locations = await Location.find({}).exec();
//     for(let location of locations) {
//       const ads = new Ads({
//         location: location.id,
//         type: makeid(20),
//         size: makeid(8),
//         images: urls,
//         expiration: generateRandomDate(
//           new Date(2023, 11, 1),
//           new Date(2024, 11, 1)
//         )
//       });
//       console.log(ads)
//       await ads.save();
//     }
//     return res.send("SUCCESS")
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// });

module.exports = router;
