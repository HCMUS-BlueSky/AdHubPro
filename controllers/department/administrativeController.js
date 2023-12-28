const District = require("../../models/District");

exports.view = async (req, res) => {
  try {
    const user = req.session.user;
    const districts = await District.find({}).exec();
    res.render("department/administrative", {
      user,
      districts,
      pageName: "administrative",
      header: {
        navRoot: "Quản lí đơn vị hành chính",
        navCurrent: "Thông tin quận",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
