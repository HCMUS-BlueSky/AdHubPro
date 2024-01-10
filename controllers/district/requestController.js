const { Location } = require("../../models/Location");
const { Ads } = require("../../models/Ads");
const { generateRegexQuery } = require("regex-vietnamese");
const Request = require("../../models/Request");
const uploadFile = require("../../utils/fileUpload");
const moment = require("moment");
const District = require("../../models/District");
const Enum = require('../../models/Enum');

exports.view = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
    })
      .distinct("_id")
      .exec();
    const request = await Request.find({
      location: { $in: managed_locations }
    })
      .populate('location', 'address')
      .populate('ads', 'type')
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const district = await District.findOne({
      name: user.managed_district.name,
    });
    const count = await Request.count({
      location: { $in: managed_locations }
    });
    res.render("district/request/index", {
      district,
      request,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chung",
      },
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.filter = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const selectedWards = req.body.select;
    const user = req.session.user;
    const district = await District.findOne({
      name: user.managed_district.name,
    });
    const managed_locations = await Location.find({
      ward: { $in: selectedWards },
      district: user.managed_district.name,
    })
      .distinct("_id")
      .exec();
    const request = await Request.find({
      location: { $in: managed_locations }
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate('location', 'address')
      .populate('ads', 'type')
      .exec();
    const count = await Request.count({
      location: { $in: managed_locations },
    });
    res.render("district/request/index", {
      district,
      request,
      user,
      perPage,
      current: page,
      moment,
      pages: Math.ceil(count / perPage),
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chung",
      },
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/district/location");
  }
};

exports.search = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const searchTerm = req.query.searchTerm;
    if (typeof searchTerm !== "string")
      throw new Error("Từ khóa không hợp lệ!");
    if (!searchTerm) return res.redirect("/district/request");
    const user = req.session.user;
    const locations = await Location.find({
      district: user.managed_district.name,
      $text: {
        $search: `\"${searchTerm}\"`,
      },
    })
      .distinct("_id")
      .exec();
    const managed_locations = await Location.find({
      district: user.managed_district.name,
    })
      .distinct("_id")
      .exec();
    const rgx = generateRegexQuery(searchTerm);
    const request = await Request.find({
      $or: [
        {
          location: { $in: locations }
        },
        {
          location: { $in: managed_locations },
          'company.name': { $regex: rgx }
        }
      ]
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate('location', 'address')
      .populate('ads', 'type')
      .exec();
    const district = await District.findOne({
      name: user.managed_district.name,
    });
    const count = await Request.count({
      $or: [
        {
          location: { $in: locations }
        },
        {
          location: { $in: managed_locations },
          'company.name': { $regex: rgx }
        }
      ]
    });
    res.render("district/request/index", {
      request,
      user,
      perPage,
      district,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chung",
      },
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/district/request");
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
    })
      .distinct("_id")
      .exec();
    const request = await Request.findOne({
      _id: req.params.id,
      location: { $in: managed_locations }
    })
      .populate('location', 'ward district address')
      .populate('ads', 'type size');
    res.render("district/request/detail", {
      request,
      user,
      moment,
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chi tiết",
      },
    });
  } catch (error) {
    req.flash("error", "Yêu cầu cấp phép không tồn tại!");
    return res.redirect("/district/request");
  }
};

exports.renderCreateNew = async (req, res) => {
  try {
    const user = req.session.user;
    const locations = await Location.find({
      district: user.managed_district.name,
      accepted: true
    }).exec();
    const availableType = await Enum.findOne({ name: 'AdsType' }).exec();
    const availableAdsType = availableType.values;
    res.render("district/request/create", {
      locations,
      user,
      availableAdsType,
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Tạo yêu cầu mới",
      },
    });
  } catch (error) {
    req.flash("error", err.message);
    return res.redirect("/district/request");
  }
};

exports.createNew = async (req, res) => {
  try {
    const {
      location,
      ads,
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
    if (!ads || typeof ads !== 'string') 
      throw new Error('Bảng quảng cáo không hợp lệ');
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
      _id: location
    }).exec();
    if (!existLocation) throw new Error('Địa điểm không hợp lệ');
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
    return res.redirect('/district/request');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/district/request');
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
    })
      .distinct("_id")
      .exec();
    const request = await Request.findOne({
      _id: req.params.id,
      location: { $in: managed_locations },
    });
    if (!request) throw new Error("Không tìm thấy yêu cầu cấp phép!");
    if (request.status != "pending")
      throw new Error("Không thể xóa yêu cầu đã được xử lí!");
    await Request.findByIdAndDelete(req.params.id);
    req.flash("success", "Hủy yêu cầu cấp phép thành công!");
    return res.redirect("/district/request");
  } catch (error) {
    req.flash("error", "Hủy yêu cầu cấp phép không thành công!");
    return res.redirect("/district/request");
  }
};
