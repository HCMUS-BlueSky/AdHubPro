const Location = require("../../models/Location");

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
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const location = await Location.findOne({ _id: req.params.id });
    res.render("ward/location/detail", {
      location,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateInfo = (req, res) => {
  res.render("ward/location/update_info");
};
