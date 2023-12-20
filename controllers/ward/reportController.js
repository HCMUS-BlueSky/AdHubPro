const Report = require("../../models/Report");
const { Location } = require("../../models/Location");
const { generateRegexQuery } = require('regex-vietnamese');
const moment = require("moment");
const {
  sendEmail,
  genProcessingTemplate,
  genFinishedTemplate,
} = require("../../utils/sendEmail");
const DOMPurify = require("isomorphic-dompurify");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const reports = await Report.find({ location: { $in: managed_locations } })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .exec();
    const count = reports.length;
    res.render("ward/report/index", {
      reports,
      user,
      perPage,
      moment,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "report",
      header: {
        navRoot: "Báo cáo",
        navCurrent: "Thông tin chung",
      },
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
    if (typeof searchTerm !== "string")
      throw new Error("Từ khóa không hợp lệ!");
    if (!searchTerm) return res.redirect("/ward/report");
    const user = req.session.user;
    const locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
      $text: {
        $search: `\"${searchTerm}\"`
      }
    })
      .distinct('_id')
      .exec();
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward
    })
      .distinct('_id')
      .exec();

    const rgx = generateRegexQuery(searchTerm);
    const reports = await Report.find({
      $or: [
        {
          location: { $in: locations }
        },
        {
          location: { $in: managed_locations },
          type: { $regex: rgx }
        },
        {
          location: { $in: managed_locations },
          'reporter.name': { $regex: rgx }
        }
      ]
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .exec();

    const count = reports.length;
    res.render("ward/report/index", {
      reports,
      moment,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "report",
      header: {
        navRoot: "Báo cáo",
        navCurrent: "Thông tin chung",
      },
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/ward/report");
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const report = await Report.findOne({
      _id: req.params.id,
      location: { $in: managed_locations },
    })
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    if (!report) throw new Error("Báo cáo không tồn tại!");
    report.content = DOMPurify.sanitize(report.content);
    res.render("ward/report/detail", {
      report,
      user,
      pageName: "report",
      header: {
        navRoot: "Báo cáo",
        navCurrent: "Thông tin chi tiết",
      },
    });
  } catch (err) {
    req.flash("error", "Báo cáo không tồn tại!");
    return res.redirect("/ward/report");
  }
};

exports.renderProcessReport = async (req, res) => {
  try {
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const report = await Report.findOne({
      _id: req.params.id,
      location: { $in: managed_locations },
    }).exec();
    if (!report) throw new Error("Báo cáo không tồn tại!");
    res.render("ward/report/process", {
      report,
      user,
      pageName: "report",
      header: {
        navRoot: "Báo cáo",
        navCurrent: "Xử lí báo cáo",
      },
    });
  } catch (err) {
    req.flash("error", "Báo cáo không tồn tại!");
    return res.redirect("/ward/report");
  }
};

exports.processReport = async (req, res) => {
  try {
    const { status, response } = req.body;
    if (
      !status ||
      !response ||
      typeof status !== "string" ||
      typeof status !== "string"
    )
      throw new Error("Dữ liệu truyền vào không hợp lệ!");
    const user = req.session.user;
    const managed_locations = await Location.find({
      district: user.managed_district.name,
      ward: user.managed_ward,
    })
      .distinct("_id")
      .exec();
    const report = await Report.findOne({
      _id: req.params.id,
      location: { $in: managed_locations },
    })
      .populate("location")
      .exec();
    if (!report) throw new Error("Báo cáo không tồn tại!");
    if (status !== "processing" && status !== "done")
      throw new Error("Trạng thái không hợp lệ!");

    if (status === report.status) throw new Error("Trạng thái mới không được giống trạng thái cũ!");
    await Report.findByIdAndUpdate(
      report.id,
      { status, response }
    ).exec();
    report.response = response;
    report.status = status;
    if (status === "processing") {
      await sendEmail(
        report.reporter.email,
        "Báo cáo của bạn đang được xử lí",
        genProcessingTemplate(report)
      );
    } else {
      await sendEmail(
        report.reporter.email,
        "Báo cáo của bạn đã xử lí xong",
        genFinishedTemplate(report)
      );
    }
    req.flash("success", "Cập nhật trạng thái báo cáo thành công!");
    return res.redirect(`/ward/report`);
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/ward/report");
  }
};
