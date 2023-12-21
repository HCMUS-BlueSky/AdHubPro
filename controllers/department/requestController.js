const Request = require("../../models/Request");
const moment = require("moment");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const requests = await Request.find({})
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Request.count();
    res.render("department/request/index", {
      user,
      requests,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chung",
      },
      moment,
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const request = await Request.findOne({ _id: req.params.id });
    res.render("department/request/detail", {
      request,
      user,
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
      moment,
    });
  } catch (error) {
    console.log(error);
  }
};
