const { Location } = require("../../models/Location");
const Proposal = require("../../models/Proposal");
const uploadFile = require("../../utils/fileUpload");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const locations = await Location.find({
      district: user.managed_district.name
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Location.count({
      district: user.managed_district.name
    });
    res.render('district/location/index', {
      locations,
      perPage,
      user,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Thông tin chung'
      }
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
    if (typeof searchTerm !== 'string') throw new Error("Từ khóa không hợp lệ!")
    if (!searchTerm) return res.redirect('/district/location'); 
    const user = req.session.user;
    const locations = await Location.find({
      district: user.managed_district.name,
      $text: {
        $search: `\"${searchTerm}\"`
      }
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Location.count({
      district: user.managed_district.name,
      $text: {
        $search: `\"${searchTerm}\"`
      }
    });
    res.render('district/location/index', {
      locations,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Thông tin chung'
      }
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/district/location');
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const location = await Location.findOne({
      _id: req.params.id,
      district: user.managed_district.name
    });
    if (!location) throw new Error('Địa điểm không tồn tại!');
    return res.render('district/location/detail', {
      location,
      user,
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Thông tin chi tiết'
      }
    });
  } catch (err) {
    req.flash('error', 'Địa điểm không tồn tại!');
    return res.redirect('/district/location');
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const location = await Location.findOne({
      _id: req.params.id,
      district: user.managed_district.name
    });
    if (!location) throw new Error('Địa điểm không tồn tại!');
    location.availableType = Location.getAvailableType();
    location.availableMethod = Location.getAvailableMethod();
    return res.render('district/location/update_info', {
      location,
      user,
      pageName: 'location',
      header: {
        navRoot: 'Điểm đặt quảng cáo',
        navCurrent: 'Cập nhật thông tin'
      }
    });
  } catch (err) {
    req.flash('error', 'Địa điểm không tồn tại!');
    return res.redirect('/district/location');
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const location = await Location.findOne({
      _id: req.params.id,
      district: user.managed_district.name
    });
    if (!location) throw new Error('Địa điểm không tồn tại!');
    const { longitude, latitude, images, content, ...filtered } = req.body;
    if (!content || typeof content !== "string")
      throw new Error('Nội dung yêu cầu không hợp lệ!');
    const new_images = [];
    if (req.files) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/location/${location.id}`, file);
        new_images.push(url);
      }
      filtered.images = new_images;
    }
    const updated_location = {
      longitude: location.longitude,
      latitude: location.latitude,
      ...filtered,
    };
    const proposal = new Proposal({
      type: 'Điểm đặt quảng cáo',
      location: location.id,
      updated_location,
      content
    });
    await proposal.save();
    req.flash("success", "Gửi yêu cầu thay đổi điểm đặt quảng cáo thành công!");
    return res.redirect('/district/location');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/district/location');
  }
};
