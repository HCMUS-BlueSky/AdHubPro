const Account = require("../../models/User");

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const accounts = await Account.find({});
    const count = accounts.length;
    res.render("department/account/index", {
      user,
      accounts,
      perPage,
      user,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
exports.getDetail = async (req, res) => {
  const user = req.session.user;
  const account = await Account.findOne({ _id: req.params.id });
  if (!account) throw new Error("Account not found!");
  try {
    res.render("department/account/detail", {
      user,
      account,
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    res.render("department/account/update", {
      user,
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Cập nhật tài khoản",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const user = req.session.user;
    res.render("department/account/create", {
      user,
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Tạo tài khoản",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.assign = async (req, res) => {
  try {
    const user = req.session.user;
    res.render("department/account/assign", {
      user,
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Phân công khu vực quản lý",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
