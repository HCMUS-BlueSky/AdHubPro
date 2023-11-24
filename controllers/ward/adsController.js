const Ads = require("../../models/Ads");
const moment = require("moment");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const ads = await Ads.find({})
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();

    const count = await Ads.count();
    res.render("ward/ads/index", {
      ads,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "ads",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const ads = await Ads.findOne({ _id: req.params.id })
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    res.render("ward/ads/detail", {
      ads,
      pageName: "ads",
      moment,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateInfo = (req, res) => {
  res.render("ward/ads/update_info");
};
