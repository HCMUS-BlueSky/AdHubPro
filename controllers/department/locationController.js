const { Ads } = require("../../models/Ads");
const { Location } = require("../../models/Location");
const Proposal = require("../../models/Proposal");
const Report = require("../../models/Report");
const Request = require("../../models/Request");
const District = require("../../models/District");
const Enum = require('../../models/Enum');
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
    if (typeof searchTerm !== "string")
      throw new Error("Từ khóa không hợp lệ!");
    if (!searchTerm) return res.redirect("/department/location");
    const user = req.session.user;
    const locations = await Location.find({
      $text: {
        $search: `\"${searchTerm}\"`,
      },
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Location.count({
      $text: {
        $search: `\"${searchTerm}\"`,
      },
    });
    res.render("department/location/index", {
      locations,
      user,
      perPage,
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
    req.flash("error", err.message);
    return res.redirect("/department/location");
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const location = await Location.findOne({
      _id: req.params.id,
    });
    if (!location) throw new Error("Địa điểm không tồn tại!");
    return res.render("department/location/detail", {
      location,
      user,
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash("error", "Địa điểm không tồn tại!");
    return res.redirect("/department/location");
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const location = await Location.findOne({
      _id: req.params.id,
    });
    if (!location) throw new Error("Địa điểm không tồn tại!");
    const availableType = await Enum.findOne({ name: 'LocationType' }).exec();
    const availableMethod = await Enum.findOne({ name: 'LocationMethod' }).exec();

    location.availableType = availableType.values;
    location.availableMethod = availableMethod.values;
    return res.render("department/location/update_info", {
      location,
      user,
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
        navCurrent: "Cập nhật thông tin",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash("error", "Địa điểm không tồn tại!");
    return res.redirect("/department/location");
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
    });
    if (!location) throw new Error("Địa điểm không tồn tại!");
    const { _id, longitude, latitude, images, ...filtered } = req.body;
    const new_images = [];

    if (filtered.type && typeof filtered.type === 'string' && filtered.type.length > 0 ) {
      const typeExisted = await Enum.exists({
        name: 'LocationType',
        values: filtered.type
      }).exec(); 
      if (!typeExisted) throw new Error('Loại địa điểm không hợp lệ!');
    }
    if (filtered.method && typeof filtered.method === 'string' && filtered.method.length > 0 ) {
      const methodExisted = await Enum.exists({
        name: 'LocationMethod',
        values: filtered.method
      }).exec(); 
      if (!methodExisted) throw new Error('Hình thức quảng cáo không hợp lệ!');
    }
    if (req.files && req.files.length) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/location/${location.id}`, file);
        new_images.push(url);
      }
      filtered.images = new_images;
    }
    Object.assign(location, filtered);
    await location.save();
    req.flash("success", "Cập nhật điểm đặt quảng cáo thành công!");
    return res.redirect("/department/location");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/department/location");
  }
};

exports.remove = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).exec();
    if (!location) throw new Error("Không tìm thấy địa điểm!");
    await Ads.deleteMany({ location: location._id }).exec();
    await Report.deleteMany({ location: location._id }).exec();
    await Proposal.deleteMany({ location: location._id }).exec();
    await Request.deleteMany({ "ads.location": location._id }).exec();
    await Location.findByIdAndDelete(req.params.id);
    req.flash("success", "Xóa địa điểm thành công!");
    return res.redirect("/department/location");
  } catch (error) {
    req.flash("error", "Xóa địa điểm không thành công!");
    return res.redirect("/department/location");
  }
};

exports.renderCreate = async (req, res) => {
  try {
    const user = req.session.user;
    const availableType = await Enum.findOne({ name: 'LocationType' }).exec();
    const availableMethod = await Enum.findOne({ name: 'LocationMethod' }).exec();
    const districts = await District.find({});
    return res.render('department/location/create', {
      districts,
      availableType: availableType.values,
      availableMethod: availableMethod.values,
      user,
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Tạo địa điểm'
      },
      layout: 'layouts/create'
    });
  } catch (err) {
    req.flash("error", "Lỗi hệ thống!");
    return res.redirect("/department/location");
  }
};

exports.create = async (req, res) => {
  try {
    const {
      longitude,
      latitude,
      district,
      ward,
      address,
      type,
      method
    } = req.body;
    if (!longitude && typeof longitude !== 'string') 
      throw new Error("Kinh độ không hợp lệ!")
    if (!latitude && typeof latitude !== 'string')
      throw new Error('Vĩ độ không hợp lệ!');
    if (!district && typeof district !== 'string')
      throw new Error('Quận không hợp lệ!');
    if (!ward && typeof ward !== 'string')
      throw new Error('Phường không hợp lệ!');
    if (!address && typeof address !== 'string')
      throw new Error('Địa chỉ không hợp lệ!');
    if (!type && typeof type !== 'string')
      throw new Error('Loại vị trí không hợp lệ!');
    if (!method && typeof method !== 'string')
      throw new Error('Hình thức quảng cáo không hợp lệ!');

    const districtDoc = await District.findById(district).exec();
    if (!districtDoc) 
    throw new Error('Quận không hợp lệ!');
    if (!districtDoc?.wards.includes(ward))
      throw new Error('Phường không hợp lệ!');
    const new_location = new Location({
      longitude,
      latitude,
      district: districtDoc.name,
      ward,
      address,
      type,
      method
    });
    const new_images = [];
    if (req.files && req.files.length) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/location/${new_location.id}`, file);
        new_images.push(url);
      }
      new_location.images = new_images;
    }
    await new_location.save();
    req.flash("success", "Thêm điểm đặt quảng cáo thành công!");
    return res.redirect("/department/location");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/department/location");
  }
};
