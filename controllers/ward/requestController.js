const { Location } = require("../../models/Location");
const { Ads } = require('../../models/Ads');
const Request = require("../../models/Request");
const uploadFile = require('../../utils/fileUpload');
const moment = require('moment');

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward
    })
      .distinct('_id')
      .exec();
    const request = await Request.find({
      "ads.location": { $in: managed_locations }
    })
      .populate('ads.location', 'address')
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = request.length;
    res.render("ward/request/index", {
      request,
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

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward
    })
      .distinct('_id')
      .exec();
    const request = await Request.findOne({
      _id: req.params.id,
      'ads.location': { $in: managed_locations }
    }).populate('ads.location', 'ward district address');
    res.render("ward/request/detail", {
      request,
      moment,
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chi tiết",
      },
    });
  } catch (error) {
    req.flash('error', "Yêu cầu cấp phép không tồn tại!");
    return res.redirect('/ward/request');
  }
};

exports.renderCreateNew = async (req, res) => {
  try {
    const user = req.session.user;
    const locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward
    }).exec();
    const availableAdsType = await Ads.getAvailableType();
    const availableLocationMethod = await Location.getAvailableMethod();
    res.render("ward/request/create", {
      locations,
      availableAdsType,
      availableLocationMethod,
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Tạo yêu cầu mới",
      },
    });
  } catch (error) {
    req.flash('error', err.message);
    return res.redirect('/ward/request');
  }
};

exports.createNew = async (req, res) => {
  try {
    const {
      location,
      type,
      size,
      ads_count,
      description,
      company_name,
      company_email,
      company_address,
      company_phone,
      effective,
      expiration
    } = req.body;
    if (!location || typeof location !== 'string') throw new Error('Địa điểm không hợp lệ');
    if (!type || typeof type !== 'string') throw new Error('Loại quảng cáo không hợp lệ');
    if (!size || typeof size !== 'string') throw new Error('Kích thước không hợp lệ');
    if (!ads_count || typeof ads_count !== 'string') throw new Error('Số lượng bảng không hợp lệ');
    if (!description || typeof description !== 'string') throw new Error('Nội dung quảng cáo không hợp lệ');
    if (!company_name || typeof company_name !== 'string') throw new Error('Tên công ty không hợp lệ');
    if (!company_email || typeof company_email !== 'string')
      throw new Error('Email công ty không hợp lệ');
    if (!company_address || typeof company_address !== 'string')
      throw new Error('Địa chỉ công ty không hợp lệ');
    if (!company_phone || typeof company_phone !== 'string')
      throw new Error('Số điện thoại công ty không hợp lệ');
    if (!effective || typeof effective !== 'string') throw new Error('Ngày bắt đầu hợp đồng không hợp lệ');
    if (!expiration || typeof expiration !== 'string') throw new Error('Ngày kết thúc hợp đồng không hợp lệ');
    const user = req.session.user;
    const exists = await Location.exists({
      _id: location,
      district: user.managed_district.name,
      ward: user.managed_ward
    }).exec();
    if (!exists) throw new Error('Địa điểm không hợp lệ'); 
    const request = new Request({
      ads: {
        location,
        type,
        size,
        effective,
        expiration
      },
      ads_count,
      description,
      company: {
        name: company_name,
        email: company_email,
        phone: company_phone,
        address: company_address,
      },
    });
    if (req.files) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/request/${request._id}`, file);
        request.ads.images.push(url);
      }
    }
    await request.save();
    req.flash("success", "Gửi yêu cầu cấp phép thành công!");
    return res.redirect('/ward/request');
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect('/ward/request');
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward
    })
      .distinct('_id')
      .exec();
    const request = await Request.findOne({
      _id: req.params.id,
      'ads.location': { $in: managed_locations }
    })
    if (!request) throw new Error("Không tìm thế yêu cầu cấp phép!")
    if (request.accepted) throw new Error("Không thể xóa yêu cầu đã được duyệt!")
    await Request.findByIdAndDelete(req.params.id);
    req.flash('success', 'Hủy yêu cầu cấp phép thành công!');
    return res.redirect('/ward/request');
  } catch (error) {
    req.flash('error', "Hủy yêu cầu cấp phép không thành công!");
    return res.redirect('/ward/request');
  }
};