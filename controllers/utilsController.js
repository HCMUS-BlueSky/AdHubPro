const { Ads } = require("../models/Ads");
const District = require("../models/District");
const { Location } = require("../models/Location");
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
    const pendingReportsCount = await Report.find({
      status: "pending",
    }).count();
    const processinggReportsCount = await Report.find({
      status: "processing",
    }).count();
    const doneReportsCount = await Report.find({
      status: "done",
    }).count();
    const data = [
      pendingReportsCount,
      processinggReportsCount,
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

exports.getAdsByLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
    });
    const ads = await Ads.find({ location: location }).exec();
    return res.json(ads);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
