const { Ads, adsSchema } = require("../../models/Ads");
const { Location } = require("../../models/Location");
const { generateRegexQuery } = require("regex-vietnamese");
const Proposal = require("../../models/Proposal");
const District = require("../../models/District");
const uploadFile = require("../../utils/fileUpload");
const moment = require("moment");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const ads = await Ads.find({})
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    const count = await Ads.count({});
    res.render("department/ads/index", {
      ads,
      user,
      perPage,
      current: page,
      moment,
      pages: Math.ceil(count / perPage),
      pageName: "ads",
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.search = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const searchTerm = req.query.searchTerm;
    if (typeof searchTerm !== "string")
      throw new Error("Từ khóa không hợp lệ!");
    if (!searchTerm) return res.redirect("department/ads");
    const user = req.session.user;
    const rgx = generateRegexQuery(searchTerm);
    const ads = await Ads.find()
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();

    const count = await Ads.count();
    return res.render("department/ads/index", {
      ads,
      user,
      perPage,
      moment,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "ads",
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("department/ads");
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const ads = await Ads.findOne({
      _id: req.params.id,
    })
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    res.render("department/ads/detail", {
      ads,
      user,
      pageName: "ads",
      moment,
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (error) {
    req.flash("error", "Bảng quảng cáo không tồn tại!");
    return res.redirect("department/ads");
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const ads = await Ads.findOne({
      _id: req.params.id,
    })
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    if (!ads) throw new Error("Bảng quảng cáo không tồn tại!");
    ads.availableType = Ads.getAvailableType();
    return res.render("department/ads/update_info", {
      ads,
      user,
      pageName: "ads",
      moment,
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Cập nhật thông tin",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash("error", "Bảng quảng cáo không tồn tại!");
    return res.redirect("/district/ads");
  }
};
