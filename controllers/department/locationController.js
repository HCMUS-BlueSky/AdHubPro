const { Ads } = require("../../models/Ads");
const { Location } = require("../../models/Location");
const Proposal = require("../../models/Proposal");
const Report = require("../../models/Report");
const Request = require("../../models/Request");
const uploadFile = require("../../utils/fileUpload");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const locations = await Location.find({})
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage);

    const count = await Location.count();
    res.render("department/location/index", {
      locations,
      perPage,
      user,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
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
    if (typeof searchTerm !== 'string')
      throw new Error('Từ khóa không hợp lệ!');
    if (!searchTerm) return res.redirect('/department/location');
    const user = req.session.user;
    const locations = await Location.find({
      $text: {
        $search: `\"${searchTerm}\"`
      }
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Location.count({
      $text: {
        $search: `\"${searchTerm}\"`
      }
    });
    res.render('department/location/index', {
      locations,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Thông tin chung'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/location');
  }
};


exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const location = await Location.findOne({
      _id: req.params.id,
    });
    if (!location) throw new Error('Địa điểm không tồn tại!');
    return res.render('department/location/detail', {
      location,
      user,
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Thông tin chi tiết'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', 'Địa điểm không tồn tại!');
    return res.redirect('/department/location');
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const location = await Location.findOne({
      _id: req.params.id,
    });
    if (!location) throw new Error('Địa điểm không tồn tại!');
    location.availableType = Location.getAvailableType();
    location.availableMethod = Location.getAvailableMethod();
    return res.render('department/location/update_info', {
      location,
      user,
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Cập nhật thông tin'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', 'Địa điểm không tồn tại!');
    return res.redirect('/department/location');
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
    });
    if (!location) throw new Error('Địa điểm không tồn tại!');
    const { longitude, latitude, images, ...filtered } = req.body;
    const new_images = [];
    if (req.files && req.files.length) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/location/${location.id}`, file);
        new_images.push(url);
      }
      filtered.images = new_images;
    }
    Object.assign(location, filtered)
    await location.save();
    req.flash('success', 'Cập nhật điểm đặt quảng cáo thành công!');
    return res.redirect('/department/location');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/location');
  }
};

exports.remove = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).exec();
    if (!location) throw new Error('Không tìm thế yêu cầu cấp phép!');
    await Ads.deleteMany({ location: location._id }).exec();
    await Report.deleteMany({ location: location._id }).exec();
    await Proposal.deleteMany({ location: location._id }).exec();
    await Request.deleteMany({ 'ads.location': location._id }).exec();
    await Location.findByIdAndDelete(req.params.id);
    req.flash('success', 'Xóa địa điểm thành công!');
    return res.redirect('/department/location');
  } catch (error) {
    req.flash('error', 'Xóa địa điểm không thành công!');
    return res.redirect('/department/location');
  }
};

exports.renderCreate = async (req, res) => {
  try {
    const user = req.session.user;
    availableType = Location.getAvailableType();
    availableMethod = Location.getAvailableMethod();
    return res.render('department/location/create', {
      availableType,
      availableMethod,
      user,
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Tạo địa điểm'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    console.log(err)
    req.flash('error', 'Lỗi hệ thống!');
    return res.redirect('/department/location');
  }
};

exports.create = async (req, res) => {
  try {
    // const { longitude, latitude, images, ...filtered } = req.body;
    // const new_images = [];
    // if (req.files && req.files.length) {
    //   for (let file of req.files) {
    //     const url = await uploadFile(`assets/location/${location.id}`, file);
    //     new_images.push(url);
    //   }
    //   filtered.images = new_images;
    // }
    // Object.assign(location, filtered);
    // await location.save();
    req.flash('success', 'Thêm điểm đặt quảng cáo thành công!');
    return res.redirect('/department/location');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/location');
  }
};