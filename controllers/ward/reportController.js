const Report = require('../../models/Report');

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const reports = await Report.find({})
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate('location', 'address')
      .exec();
    const count = await Report.count();
    res.render('ward/report/index', {
      reports,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage)
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id }).populate('location', 'address ward district').exec();
    res.render('ward/report/detail', {
      report
    });
  } catch (error) {
    console.log(error);
  }
};

exports.processReport = async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id }).populate('location', 'address ward district').exec();
  res.render('ward/report/process', {
    report
  });
};