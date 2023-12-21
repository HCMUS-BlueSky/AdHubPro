const { Location } = require("../../models/Location");
const Proposal = require("../../models/Proposal");
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
    const searchTerm = req.body.searchTerm;
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
    const location = await Location.findOne({ _id: req.params.id });
    if (!location) throw new Error("Location not found!");
    return res.render("department/location/detail", {
      user,
      location,
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.redirect("/department/location");
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const location = await Location.findOne({ _id: req.params.id });
    if (!location) throw new Error("Location not found!");
    return res.render("department/location/update_info", {
      user,
      location,
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
        navCurrent: "Thông tin chi tiết",
      },
    });
  } catch (err) {
    return res.redirect("/department/location");
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const location = await Location.findOne({ _id: req.params.id });
    if (!location) throw new Error("Location not found!");
    const { longitude, latitude, images, content, ...filtered } = req.body;
    if (!content || typeof content !== "string")
      throw new Error("Invalid content");
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
      type: "location",
      location: location.id,
      updated_location,
      content,
    });
    await proposal.save();
    return res.redirect("/department/location");
  } catch (err) {
    return res.redirect("/department/location");
  }
};
