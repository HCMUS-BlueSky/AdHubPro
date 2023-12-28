const Enum = require("../../models/Enum");

exports.view = async (req, res) => {
  try {
    const user = req.session.user;
    const methods = await Enum.find({});
    res.render("department/method", {
      user,
      methods,
      pageName: "method",
      header: {
        navRoot: "Quản lí hình thức",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const method = await Enum.findOne({ _id: req.params.id });
    res.render("department/method/detail", {
      user,
      method,
      pageName: "method",
      header: {
        navRoot: "Quản lí hình thức",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
