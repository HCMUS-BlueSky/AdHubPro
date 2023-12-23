const Proposal = require("../../models/Proposal");

exports.view = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const user = req.session.user;
    const proposal = await Proposal.find({})
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    const count = await Proposal.count();
    res.render("department/proposal/index", {
      proposal,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "proposal",
      header: {
        navRoot: "Yêu cầu chỉnh sửa",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const proposal = await Proposal.findOne({
      _id: req.params.id,
    }).populate({
      path: "location",
      select: ["address", "ward", "district", "method"],
    });
    res.render("department/proposal/detail", {
      proposal,
      user,
      pageName: "proposal",
      header: {
        navRoot: "Yêu cầu chỉnh sửa",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (error) {
    req.flash("error", "Yêu cầu chỉnh sửa không tồn tại!");
    return res.redirect("/department/proposal");
  }
};
