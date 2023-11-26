const { Location } = require("../../models/Location");
const Proposal = require("../../models/Proposal");
const uploadFile = require("../../utils/fileUpload");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const locations = await Location.find({})
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Location.count();
    res.render("ward/location/index", {
      locations,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
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

    const locations = await Location.find({
      address: { $regex: searchTerm, $options: "i" },
    })
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    if (!locations) {
      return res.status(404).send("Location not found");
    }

    const count = locations.length;

    res.render("ward/location/index", {
      locations,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
        navCurrent: "Thông tin chung",
      },
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const location = await Location.findOne({ _id: req.params.id });
    if (!location) throw new Error("Location not found!");
    return res.render("ward/location/detail", {
      location,
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
        navCurrent: "Thông tin chi tiết",
      },
    });
  } catch (err) {
    req.flash('error', 'Địa điểm không tồn tại!');
    return res.redirect("/ward/location");
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const location = await Location.findOne({ _id: req.params.id });
    if (!location) throw new Error('Địa điểm không tồn tại!');
    location.availableType = Location.getAvailableType();
    location.availableMethod = Location.getAvailableMethod();
    return res.render("ward/location/update_info", {
      location,
      pageName: "location",
      header: {
        navRoot: "Điểm đặt quảng cáo",
        navCurrent: "Cập nhật thông tin",
      },
    });
  } catch (err) {
    req.flash('error', 'Địa điểm không tồn tại!');
    return res.redirect("/ward/location");
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const location = await Location.findOne({ _id: req.params.id });
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
    console.log(filtered);
    const proposal = new Proposal({
      type: "location",
      location: location.id,
      updated_location,
      content,
    });
    await proposal.save();
    req.flash("success", "Gửi yêu cầu thay đổi điểm đặt quảng cáo thành công!");
    return res.redirect("/ward/location");
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect("/ward/location");
  }
};
