const District = require("../models/District");

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
