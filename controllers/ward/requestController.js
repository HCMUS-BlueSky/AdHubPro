const Request = require("../../models/Request");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const request = await Request.find({})
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Request.count();
    res.render("ward/request/index", {
      request,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const request = await Request.findOne({ _id: req.params.id });
    res.render("ward/request/detail", {
      request,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createNew = (req, res) => {
  res.render("ward/request/create");
};
