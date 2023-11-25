const { Ads } = require("../../models/Ads");
const { Location } = require("../../models/Location");
const Proposal = require("../../models/Proposal");
const uploadFile = require("../../utils/fileUpload");
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
      moment,
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
    req.flash('error', 'Bảng quảng cáo không tồn tại!');
    return res.redirect("/ward/ads");
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const ads = await Ads.findOne({ _id: req.params.id }).populate("location").exec();
    if (!ads) throw new Error('Bảng quảng cáo không tồn tại!');
    return res.render("ward/ads/update_info", {
      ads,
      pageName: "ads",
      moment,
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Cập nhật thông tin",
      },
    });
  } catch (err) {
    req.flash('error', 'Bảng quảng cáo không tồn tại!');
    return res.redirect("/ward/ads");
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const ads = await Ads.findOne({ _id: req.params.id });
    if (!ads) throw new Error("Bảng quảng cáo không tồn tại!");
    const { location, images, content, effective, expiration, ...filtered } =
      req.body;
    if (!content || typeof content !== "string")
      throw new Error("Nội dung yêu cầu không hợp lệ!");
    const new_images = [];
    if (req.files) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/ads/${ads.id}`, file);
        new_images.push(url);
      }
      filtered.images = new_images;
    }
    const updated_ads = {
      location: ads.location,
      ...filtered,
    };
    const proposal = new Proposal({
      type: "ads",
      ads: ads.id,
      updated_ads,
      content,
    });
    await proposal.save();
    req.flash("success", "Gửi yêu cầu thay đổi bảng quảng cáo thành công!");
    return res.redirect("/ward/ads");
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect("/ward/ads");
  }
};
