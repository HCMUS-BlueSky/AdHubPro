const Enum = require("../../models/Enum");

exports.view = async (req, res) => {
  try {
    const user = req.session.user;
    const methods = await Enum.find({});
    function translateMethod(name) {
      switch (name) {
        case "LocationType":
          return "Phân loại";
        case "LocationMethod":
          return "Hình thức";
        case "AdsType":
          return "Loại bảng quảng cáo";
        case "ReportMethod":
          return "Hình thức báo cáo";
        default:
          return name;
      }
    }
    res.render("department/method", {
      user,
      methods,
      pageName: "method",
      header: {
        navRoot: "Quản lí hình thức",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
      translateMethod,
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

exports.add = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string")
      throw new Error("Dữ liệu không hợp lệ!");
    await Enum.findByIdAndUpdate(req.params.id, {
      $push: { values: value },
    });
    req.flash("success", "Thêm hình thức thành công!");
    return res.redirect("/department/method");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/department/method");
  }
};

exports.remove = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string")
      throw new Error("Dữ liệu không hợp lệ!");
    await Enum.findByIdAndUpdate(req.params.id, {
      $pull: { values: value },
    });
    req.flash("success", "Xóa hình thức thành công!");
    return res.redirect("/department/method");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/department/method");
  }
};
