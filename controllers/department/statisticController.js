const Report = require("../../models/Report");
const moment = require("moment");

exports.view = async (req, res) => {
  try {
    const user = req.session.user;
    res.render("department/statistic/index", {
      user,
      pageName: "statistic",
      header: {
        navRoot: "Thống kê",
        navCurrent: "Tổng quan",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.overview = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const reports = await Report.find({})
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    const count = await Report.count();
    return res.render("department/statistic/overview", {
      reports,
      moment,
      perPage,
      user,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "statistic",
      header: {
        navRoot: "Thống kê",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.redirect("/department/statistic");
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const report = await Report.findOne({ _id: req.params.id })
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    res.render("department/statistic/detail", {
      report,
      user,
      pageName: "statistic",
      header: {
        navRoot: "Thống kê",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
      moment,
    });
  } catch (error) {
    console.log(error);
  }
};
