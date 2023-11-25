const Report = require('../../models/Report');
const moment = require('moment');
const {
  sendEmail,
  genProcessingTemplate,
  genFinishedTemplate
} = require('../../utils/sendEmail');

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const reports = await Report.find({})
      .sort({ updatedAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .exec();
    const count = await Report.count();
    res.render('ward/report/index', {
      reports,
      perPage,
      moment,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: 'report',
      header: {
        navRoot: 'Báo cáo',
        navCurrent: 'Thông tin chung'
      }
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id })
      .populate({
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .exec();
    res.render('ward/report/detail', {
      report,
      pageName: 'report',
      header: {
        navRoot: 'Báo cáo',
        navCurrent: 'Thông tin chi tiết'
      }
    });
  } catch (err) {
    return res.redirect('/ward/report');
  }
};

exports.renderProcessReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id }).exec();
    if (!report) throw new Error('No report found!');
    res.render('ward/report/process', {
      report,
      pageName: 'report',
      header: {
        navRoot: 'Báo cáo',
        navCurrent: 'Xử lí báo cáo'
      }
    });
  } catch (err) {
    return res.redirect('/ward/report');
  }
};

exports.processReport = async (req, res) => {
  try {
    const { status, response } = req.body;
    if (
      !status ||
      !response ||
      typeof status !== 'string' ||
      typeof status !== 'string'
    )
      throw new Error('Invalid values!');
    const report = await Report.findOne({ _id: req.params.id })
      .populate('location')
      .exec();
    if (!report) throw new Error('No report found!');
    if (status !== 'processing' && status !== 'done')
      throw new Error('Invalid status!');
    await Report.findByIdAndUpdate(
      report.id,
      { status, response },
      { returnDocument: 'after' }
    ).exec();
    report.response = response;
    report.status = status;
    if (status === 'processing') {
      await sendEmail(
        report.reporter.email,
        'Báo cáo của bạn đang được xử lí',
        genProcessingTemplate(report)
      );
    } else {
      await sendEmail(
        report.reporter.email,
        'Báo cáo của bạn đã xử lí xong',
        genFinishedTemplate(report)
      );
    }
    return res.redirect(`/ward/report/view/${report.id}`);
  } catch (err) {
    return res.redirect('/ward/report');
  }
};
