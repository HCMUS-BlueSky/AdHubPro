const Report = require("../../models/Report");
const { Location } = require('../../models/Location');
const { generateRegexQuery } = require('regex-vietnamese');
const moment = require('moment');

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

exports.search = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const searchTerm = req.query.searchTerm;
    if (typeof searchTerm !== 'string')
      throw new Error('Từ khóa không hợp lệ!');
    if (!searchTerm) return res.redirect('/department/statistic/overview');
    const user = req.session.user;
    const locations = await Location.find({
      $text: {
        $search: `\"${searchTerm}\"`
      }
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
          type: { $regex: rgx }
        },
        {
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

    const count = await Report.count({
      $or: [
        {
          location: { $in: locations }
        },
        {
          type: { $regex: rgx }
        },
        {
          'reporter.name': { $regex: rgx }
        }
      ]
    });
    res.render('department/statistic/overview', {
      reports,
      moment,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: 'statistic',
      header: {
        navRoot: 'Thống kê',
        navCurrent: 'Thông tin chung'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/statistic/overview');
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
