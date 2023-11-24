const Location = require("../../models/Location");
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
    });
  } catch (err) {
    return res.redirect("/ward/location");
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const location = await Location.findOne({ _id: req.params.id });
    if (!location) throw new Error("Location not found!");
    return res.render("ward/location/update_info", { location });
  } catch (err) {
    return res.redirect("/ward/location");
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const location = await Location.findOne({ _id: req.params.id });
    if (!location) throw new Error("Location not found!");
    const { longitude, latitude, images, ...filtered } = req.body;
    const new_images = [];
    if (req.files) {
      for (let file of req.files) {
        const url = await uploadFile(`assets/location/${location.id}`, file);
        new_images.push(url);
      }
      filtered.new_images = new_images;
    }
    const updated_location = await Location.findByIdAndUpdate(
      location.id,
      filtered,
      {
        runValidators: true,
        returnDocument: "after",
      }
    ).exec();
    return res.render("ward/location/update_info", {
      location: updated_location,
    });
  } catch (err) {
    return res.redirect("/ward/location");
  }
};
