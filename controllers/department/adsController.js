const { Ads } = require('../../models/Ads');
const { Location } = require('../../models/Location');
const Proposal = require('../../models/Proposal');
const Report = require('../../models/Report');
const Enum = require('../../models/Enum');
const uploadFile = require('../../utils/fileUpload');
const moment = require('moment');

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
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .exec();
    const count = await Ads.count({});
    res.render('department/ads/index', {
      ads,
      user,
      perPage,
      current: page,
      moment,
      pages: Math.ceil(count / perPage),
      pageName: 'ads',
      header: {
        navRoot: 'Bảng quảng cáo',
        navCurrent: 'Thông tin chung'
      },
      layout: 'layouts/department'
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
    if (typeof searchTerm !== 'string')
      throw new Error('Từ khóa không hợp lệ!');
    if (!searchTerm) return res.redirect('/department/ads');
    const user = req.session.user;
    const locations = await Location.find({
      $text: {
        $search: `\"${searchTerm}\"`
      }
    })
      .distinct('_id')
      .exec();
    const rgx = generateRegexQuery(searchTerm);
    const ads = await Ads.find({
      $or: [
        {
          location: { $in: locations }
        },
        {
          type: { $regex: rgx }
        }
      ]
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .exec();

    const count = await Ads.count({
      $or: [
        {
          location: { $in: locations }
        },
        {
          type: { $regex: rgx }
        }
      ]
    });
    return res.render('department/ads/index', {
      ads,
      user,
      perPage,
      moment,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: 'ads',
      header: {
        navRoot: 'Bảng quảng cáo',
        navCurrent: 'Thông tin chung'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/ads');
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const ads = await Ads.findOne({
      _id: req.params.id
    })
      .populate({
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .exec();
    res.render('department/ads/detail', {
      ads,
      user,
      pageName: 'ads',
      moment,
      header: {
        navRoot: 'Bảng quảng cáo',
        navCurrent: 'Thông tin chi tiết'
      },
      layout: 'layouts/department'
    });
  } catch (error) {
    req.flash('error', 'Bảng quảng cáo không tồn tại!');
    return res.redirect('/department/ads');
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const locations = await Location.find({});
    const ads = await Ads.findOne({
      _id: req.params.id
    })
      .populate({
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .lean();
    if (!ads) throw new Error('Bảng quảng cáo không tồn tại!');
    availableType = await Enum.findOne({"name": "AdsType"}).exec();
    ads.availableType = availableType.values;
    return res.render('department/ads/update_info', {
      locations,
      ads,
      user,
      pageName: 'ads',
      moment,
      header: {
        navRoot: 'Bảng quảng cáo',
        navCurrent: 'Cập nhật thông tin'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', 'Bảng quảng cáo không tồn tại!');
    return res.redirect('/district/ads');
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const ads = await Ads.findOne({
      _id: req.params.id
    });
    if (!ads) throw new Error('Bảng quảng cáo không tồn tại!');
    const { _id, location, images, effective, expiration, ...filtered } =
      req.body;
    if (filtered.type && typeof filtered.type === 'string' && filtered.type.length > 0 ) {
      const typeExisted = await Enum.exists({
        name: 'AdsType',
        values: filtered.type
      }).exec(); 
      if (!typeExisted) throw new Error('Loại bảng quảng cáo không hợp lệ!');
    }
    const new_images = [];
    if (req.files && req.files.length) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/ads/${ads.id}`, file);
        new_images.push(url);
      }
      filtered.images = new_images;
    }
    Object.assign(ads, filtered);
    await ads.save();
    req.flash('success', 'Cập nhật bảng quảng cáo thành công!');
    return res.redirect('/department/ads');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/ads');
  }
};

exports.renderCreate = async (req, res) => {
  try {
    const user = req.session.user;
    const locations = await Location.find();
    const availableType = await Enum.findOne({ name: 'AdsType' }).exec();
    const availableAdsType = availableType.values;
    return res.render('department/ads/create', {
      availableAdsType,
      locations,
      user,
      pageName: 'ads',
      header: {
        navRoot: 'Bảng quảng cáo',
        navCurrent: 'Tạo bảng quảng cáo'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', 'Lỗi hệ thống!');
    return res.redirect('/department/ads');
  }
};

exports.create = async (req, res) => {
  try {
    const { location, type, size, effective, expiration } = req.body;
    if (!location || typeof location !== 'string')
      throw new Error('Địa điểm không hợp lệ');
    if (!type || typeof type !== 'string')
      throw new Error('Loại quảng cáo không hợp lệ');
    if (!size || typeof size !== 'string')
      throw new Error('Kích thước không hợp lệ');
    if (!effective || typeof effective !== 'string')
      throw new Error('Ngày bắt đầu hợp đồng không hợp lệ');
    if (!expiration || typeof expiration !== 'string')
      throw new Error('Ngày kết thúc hợp đồng không hợp lệ');
    const exists = await Location.exists({
      _id: location
    }).exec();
    if (!exists) throw new Error('Địa điểm không hợp lệ');
    const ads = new Ads({
      location,
      type,
      size,
      effective,
      expiration
    });
    if (req.files && req.files.length) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/ads/${ads._id}`, file);
        ads.images.push(url);
      }
    }
    await ads.save();
    await Location.findByIdAndUpdate(ads.location, {
      $inc: { ads_count: 1 },
      accepted: true
    });
    req.flash('success', 'Thêm bảng quảng cáo thành công!');
    return res.redirect('/department/ads');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/ads');
  }
};

exports.remove = async (req, res) => {
  try {
    const ads = await Ads.findById(req.params.id).exec();
    if (!ads) throw new Error('Không tìm thấy bảng quảng cáo!');

    await Report.deleteMany({ ads: ads._id }).exec();
    await Proposal.deleteMany({ ads: ads._id }).exec();
    await Ads.findByIdAndDelete(req.params.id).exec();
    const loc = await Location.findById(ads.location).exec();
    if (loc) {
      loc.ads_count -= 1;
      if (loc.ads_count < 1) {
        loc.accepted = false;
      }
      await loc.save();
    }
    req.flash('success', 'Xóa bảng quảng cáo thành công!');
    return res.redirect('/department/ads');
  } catch (error) {
    req.flash('error', 'Xóa bảng quảng cáo không thành công!');
    return res.redirect('/department/ads');
  }
};
