const District = require('../models/District');

const getManagedWards = async (req, res, next) => {
  try {
    const user = req.session.user;
    const wards = await District.findById(user.managed_district).select('wards');
    res.locals.wards = wards.wards;
    return next();
  } catch (err) {
    return res.redirect(302, req?.session?.user?.workDir || '/');
  }
};

module.exports = getManagedWards;
