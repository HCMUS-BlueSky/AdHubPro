const Request = require("../../models/Request");
const mongoose = require("mongoose");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const Request = await Request.aggregate([{ $sort: { updatedAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Request.count();
    res.render("ward/request/index", {
      requests,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = (req, res) => {
  res.render("ward/request/detail");
};

exports.updateInfo = (req, res) => {
  res.render("ward/request/create");
};
