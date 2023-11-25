const { Ads } = require("../../models/Ads");
const { Location } = require("../../models/Location");
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
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Thông tin chung",
      },
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.search = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    let searchTerm = req.body.searchTerm;

    const location = await Location.findOne({
      address: { $regex: searchTerm, $options: "i" },
    });

    if (!location) {
      return res.status(404).send("Location not found");
    }

    const ads = await Ads.find({
      location: location._id,
    })
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();

    const count = ads.length;
    res.render("ward/ads/index", {
      ads,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "ads",
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Thông tin chung",
      },
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
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Thông tin chi tiết",
      },
    });
  } catch (error) {
    return res.redirect("/ward/ads");
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const ads = await Ads.findOne({ _id: req.params.id });
    if (!ads) throw new Error("Ads not found!");
    return res.render("ward/ads/update_info", { ads });
  } catch (err) {
    return res.redirect("/ward/ads");
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const location = await Location.findOne({ _id: req.params.id });
    if (!location) throw new Error("Location not found!");
    const { longitude, latitude, images, ...filtered } = req.body;
    const new_images = [];
    if (req.files) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/location/${location.id}`, file);
        new_images.push(url);
      }
      filtered.new_images = new_images;
    }
    const updated_location = await Location.findByIdAndUpdate(
      location.id,
      filtered,
      {
        runValidators: true,
        returnDocument: "after",
      }
    ).exec();
    return res.render("ward/location/update_info", {
      location: updated_location,
    });
  } catch (err) {
    return res.redirect("/ward/location");
  }
};
