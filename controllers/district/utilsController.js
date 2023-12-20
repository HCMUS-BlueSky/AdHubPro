const District = require('../../models/District');

exports.wards = async (req, res) => {
  try {
    const user = req.session.user;
    const wards = await District.findById(user.managed_district).select('wards');
    return res.json(wards?.wards);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};