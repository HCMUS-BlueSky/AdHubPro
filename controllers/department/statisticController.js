const Report = require("../../models/Report");
const { Location } = require("../../models/Location");
const { generateRegexQuery } = require("regex-vietnamese");
const District = require("../../models/District");
const moment = require("moment");

exports.view = async (req, res) => {
  const selectedDistrict = "5";
  const selectedWard = "Không";
  try {
    const selected_locations = await Location.find({
      district: "5",
    })
      .distinct("_id")
      .exec();
    const pendingReportsCount = await Report.find({
      status: "pending",
      location: { $in: selected_locations },
    }).count();
    const processinggReportsCount = await Report.find({
      status: "processing",
      location: { $in: selected_locations },
    }).count();
    const doneReportsCount = await Report.find({
      status: "done",
      location: { $in: selected_locations },
    }).count();
    const reportsCount = [
      pendingReportsCount,
      processinggReportsCount,
      doneReportsCount,
    ];
    const currentYear = new Date().getFullYear() - 1;
    const reportsMonthlyCount = await Report.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
          location: { $in: selected_locations },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
          },
          count: { $sum: 1 },
        },
      },
    ]).exec();
    const monthlyCountsArray = Array.from({ length: 12 }, (_, index) => {
      const monthData = reportsMonthlyCount.find(
        (item) => item._id.month === index + 1
      );
      return monthData ? monthData.count : 0;
    });
    const user = req.session.user;
    const districts = await District.find({});
    res.render("department/statistic/index", {
      selectedDistrict,
      selectedWard,
      reportsCount,
      monthlyCountsArray,
      districts,
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

exports.filter = async (req, res) => {
  try {
    const selectedDistrict = req.query.district_select;
    const selectedWard = req.query.ward_select;
    const districtDoc = await District.findById(selectedDistrict).exec();
    let filterLocation = {};
    if (selectedWard == "Không") {
      filterLocation = {
        district: districtDoc.name,
      };
    } else {
      filterLocation = {
        ward: selectedWard,
        district: districtDoc.name,
      };
    }
    const selected_locations = await Location.find(filterLocation)
      .distinct("_id")
      .exec();
    const pendingReportsCount = await Report.find({
      status: "pending",
      location: { $in: selected_locations },
    }).count();
    const processinggReportsCount = await Report.find({
      status: "processing",
      location: { $in: selected_locations },
    }).count();
    const doneReportsCount = await Report.find({
      status: "done",
      location: { $in: selected_locations },
    }).count();
    const reportsCount = [
      pendingReportsCount,
      processinggReportsCount,
      doneReportsCount,
    ];
    const currentYear = new Date().getFullYear() - 1;
    const reportsMonthlyCount = await Report.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
          location: { $in: selected_locations },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$created_at" },
            year: { $year: "$created_at" },
          },
          count: { $sum: 1 },
        },
      },
    ]).exec();
    const monthlyCountsArray = Array.from({ length: 12 }, (_, index) => {
      const monthData = reportsMonthlyCount.find(
        (item) => item._id.month === index + 1
      );
      return monthData ? monthData.count : 0;
    });
    const user = req.session.user;
    const districts = await District.find({});
    res.render("department/statistic/index", {
      selectedDistrict: districtDoc.name,
      selectedWard,
      reportsCount,
      monthlyCountsArray,
      districts,
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
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    const districts = await District.find({});
    const count = await Report.count();
    return res.render("department/statistic/overview", {
      reports,
      moment,
      perPage,
      districts,
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
    if (typeof searchTerm !== "string")
      throw new Error("Từ khóa không hợp lệ!");
    if (!searchTerm) return res.redirect("/department/statistic/overview");
    const user = req.session.user;
    const locations = await Location.find({
      $text: {
        $search: `\"${searchTerm}\"`,
      },
    })
      .distinct("_id")
      .exec();
    const rgx = generateRegexQuery(searchTerm);
    const reports = await Report.find({
      $or: [
        {
          location: { $in: locations },
        },
        {
          type: { $regex: rgx },
        },
        {
          "reporter.name": { $regex: rgx },
        },
      ],
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();

    const count = await Report.count({
      $or: [
        {
          location: { $in: locations },
        },
        {
          type: { $regex: rgx },
        },
        {
          "reporter.name": { $regex: rgx },
        },
      ],
    });
    res.render("department/statistic/overview", {
      reports,
      moment,
      user,
      perPage,
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
    req.flash("error", err.message);
    return res.redirect("/department/statistic/overview");
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
