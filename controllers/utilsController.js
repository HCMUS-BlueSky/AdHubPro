const District = require("../models/District");
const Report = require("../models/Report");

exports.getDistricts = async (req, res) => {
  try {
    const districts = await District.find({}).select("name").exec();
    return res.json(districts);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getWards = async (req, res) => {
  try {
    const district_id = req.params.id;
    const wards = await District.findById(district_id)
      .select("name wards")
      .exec();
    return res.json(wards);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getReports = async (req, res) => {
  try {
    //filter by district and ward if provided
    const selectedDistrict = req.query.district;
    const selectedWard = req.query.ward;
    let filterReport = {};
    if (selectedWard == "Không") {
      filterReport = {
        district: selectedDistrict,
      };
    } else {
      filterReport = {
        ward: selectedWard,
        district: selectedDistrict,
      };
    }
    const locations = await Report.find(filterReport);
    const pendingReportsCount = await Report.count({
      status: "pending",
      ...filterReport,
    });
    const processingReportsCount = await Report.count({
      status: "processing",
      ...filterReport,
    });
    const doneReportsCount = await Report.count({
      status: "done",
      ...filterReport,
    });
    const data = [
      pendingReportsCount,
      processingReportsCount,
      doneReportsCount,
    ];
    return res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getReportsByMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const reportsCount = await Report.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
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
    return res.json(reportsCount);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
