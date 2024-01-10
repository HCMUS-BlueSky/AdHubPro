const { Ads } = require("../../models/Ads");
const { Location } = require("../../models/Location");
const { generateRegexQuery } = require("regex-vietnamese");
const Proposal = require("../../models/Proposal");
const Request = require('../../models/Request');
const uploadFile = require("../../utils/fileUpload");
const moment = require("moment");
const Enum = require("../../models/Enum");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const ads = await Ads.find({ location: { $in: managed_locations } })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();

    const count = await Ads.count({ location: { $in: managed_locations } });
    res.render("ward/ads/index", {
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
    if (!searchTerm) return res.redirect("/ward/ads");
    const user = req.session.user;
    const locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
      $text: {
        $search: `\"${searchTerm}\"`,
      },
    })
      .distinct("_id")
      .exec();
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const rgx = generateRegexQuery(searchTerm);
    const ads = await Ads.find({
      $or: [
        {
          location: { $in: locations },
        },
        {
          location: { $in: managed_locations },
          type: { $regex: rgx },
        },
      ],
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();

    const count = await Ads.count({
      $or: [
        {
          location: { $in: locations },
        },
        {
          location: { $in: managed_locations },
          type: { $regex: rgx },
        },
      ],
    });
    return res.render("ward/ads/index", {
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
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/ward/ads");
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const ads = await Ads.findOne({
      _id: req.params.id,
      location: { $in: managed_locations },
    })
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    res.render("ward/ads/detail", {
      ads,
      user,
      pageName: "ads",
      moment,
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Thông tin chi tiết",
      },
    });
  } catch (error) {
    req.flash("error", "Bảng quảng cáo không tồn tại!");
    return res.redirect("/ward/ads");
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const ads = await Ads.findOne({
      _id: req.params.id,
      location: { $in: managed_locations },
    })
      .populate("location")
      .exec();
    if (!ads) throw new Error("Bảng quảng cáo không tồn tại!");
    availableType = await Enum.findOne({ name: "AdsType" }).exec();
    ads.availableType = availableType.values;
    return res.render("ward/ads/update_info", {
      ads,
      user,
      pageName: "ads",
      moment,
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Cập nhật thông tin",
      },
    });
  } catch (err) {
    req.flash("error", "Bảng quảng cáo không tồn tại!");
    return res.redirect("/ward/ads");
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const ads = await Ads.findOne({
      _id: req.params.id,
      location: { $in: managed_locations },
    });
    if (!ads) throw new Error("Bảng quảng cáo không tồn tại!");
    const { location, images, content, effective, expiration, ...filtered } =
      req.body;
    if (!content || typeof content !== "string")
      throw new Error("Nội dung yêu cầu không hợp lệ!");
    const new_images = [];
    if (req.files && req.files.length) {
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
      type: "Bảng quảng cáo",
      location: ads.location,
      ads: ads.id,
      updated_ads,
      content,
    });
    await proposal.save();
    req.flash("success", "Gửi yêu cầu thay đổi bảng quảng cáo thành công!");
    return res.redirect("/ward/ads");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/ward/ads");
  }
};

exports.renderCreateRequest = async (req, res) => {
  try {
    const user = req.session.user;
    const ads = await Ads.findOne({
      _id: req.params.id,
    })
      .populate("location")
      .exec();
    return res.render("ward/ads/create-request", {
      ads,
      user,
      pageName: "ads",
      moment,
      header: {
        navRoot: "Bảng quảng cáo",
        navCurrent: "Cấp phép quảng cáo",
      },
    });
  } catch (err) {
    req.flash("error", "Bảng quảng cáo không tồn tại!");
    return res.redirect("/ward/ads");
  }
};

exports.createRequest = async (req, res) => {
  try {
    const {
      location,
      description,
      company_name,
      company_email,
      company_address,
      company_phone,
      effective,
      expiration
    } = req.body;
    if (!location || typeof location !== 'string')
      throw new Error('Địa điểm không hợp lệ');
    if (!description || typeof description !== 'string')
      throw new Error('Nội dung quảng cáo không hợp lệ');
    if (!company_name || typeof company_name !== 'string')
      throw new Error('Tên công ty không hợp lệ');
    if (!company_email || typeof company_email !== 'string')
      throw new Error('Email công ty không hợp lệ');
    if (!company_address || typeof company_address !== 'string')
      throw new Error('Địa chỉ công ty không hợp lệ');
    if (!company_phone || typeof company_phone !== 'string')
      throw new Error('Số điện thoại công ty không hợp lệ');
    if (!effective || typeof effective !== 'string')
      throw new Error('Ngày bắt đầu hợp đồng không hợp lệ');
    if (!expiration || typeof expiration !== 'string')
      throw new Error('Ngày kết thúc hợp đồng không hợp lệ');
    const user = req.session.user;
    const existLocation = await Location.exists({
      district: user.managed_district.name,
      ward: user.managed_ward,
      _id: location
    }).exec();
    if (!existLocation) throw new Error('Địa điểm không hợp lệ');
    const ads = req.params.id
    const exists = await Ads.exists({
      _id: ads,
      location: location
    }).exec();
    if (!exists) throw new Error('Bảng quảng cáo không hợp lệ');

    const request = new Request({
      location,
      ads,
      description,
      effective,
      expiration,
      company: {
        name: company_name,
        email: company_email,
        phone: company_phone,
        address: company_address
      }
    });

    if (req.files && req.files.length) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/request/${request._id}`, file);
        request.images.push(url);
      }
    }
    await request.save();
    req.flash('success', 'Gửi yêu cầu cấp phép thành công!');
    return res.redirect('/ward/ads');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/ward/ads');
  }
}