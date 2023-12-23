const Account = require("../../models/User");
const moment = require('moment');

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const accounts = await Account.find({});
    const count = await Account.count();
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
  const account = await Account.findOne({ _id: req.params.id }).populate(
    'managed_district',
    'name'
  );
  if (!account) throw new Error("Tài khoản không tồn tại!");
  try {
    res.render("department/account/detail", {
      user,
      account,
      moment,
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash('error', 'Tài khoản không tồn tại!');
    return res.redirect('/department/account');
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const account = await Account.findOne({ _id: req.params.id }).populate(
      'managed_district',
      'name'
    );
    if (!account) throw new Error('Tài khoản không tồn tại!');
    if (user._id != account._id && account.role === 'department_officer') throw new Error("Không thể sửa thông tin cán bộ sở khác!")
    res.render('department/account/update', {
      user,
      account,
      moment,
      pageName: 'account',
      header: {
        navRoot: 'Quản lí tài khoản',
        navCurrent: 'Cập nhật tài khoản'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/account');
  }
};

exports.updateInfo = async (req, res) => {
   try {
    const user_id = req.params.id;
    const current_user = req.session.user;
    const account = await Account.findById(user_id).exec();
    if (!account) throw new Error('Tài khoản không tồn tại!');
    if (current_user._id != account._id && account.role === 'department_officer') throw new Error("Không thể sửa thông tin cán bộ sở khác!")
    const { fullname, birthdate, phone, gender, identity_code, email, password } = req.body
    const updated_account = {}
    if (fullname && fullname.length && typeof fullname === "string") 
      updated_account.fullname = fullname;
    if (birthdate && birthdate.length && typeof birthdate === 'string')
      updated_account.birthdate = birthdate;
    if (phone && phone.length && typeof phone === 'string')
      updated_account.phone = phone;
    if (gender && gender.length && typeof gender === 'string') {
      if (gender === 'male') updated_account.gender = true;
      if (gender === 'female') updated_account.gender = false;
    }
    if (identity_code && identity_code.length && typeof identity_code === 'string')
      updated_account.identity_code = identity_code;

    if (email && email.length && typeof email === 'string') {
      const existed = await Account.exists({ email, _id: { $ne: user_id } });
      if (existed) throw new Error("Email đã được sử dụng!");
      updated_account.email = email;
    }
    if (password && password.length && typeof password === 'string') {
      if (password.length < 8) throw new Error("Mật khẩu quá ngắn, mật khẩu phải dài hơn 8 kí tự!");
      const hashedPassword = await bcrypt.hash(password, 10);
      updated_account.password = hashedPassword;
    }    
    Object.assign(account, updated_account);
    await account.save();
    req.flash('success', 'Cập nhật tài khoản thành công!');
    return res.redirect('/department/account');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/account');
  }
};

exports.renderCreate = async (req, res) => {
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

exports.create = async (req, res) => {
  try {
    const user = req.session.user;
    res.render('department/account/create', {
      user,
      pageName: 'account',
      header: {
        navRoot: 'Quản lí tài khoản',
        navCurrent: 'Tạo tài khoản'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


exports.renderAssign = async (req, res) => {
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

exports.assign = async (req, res) => {
  try {
    const user = req.session.user;
    res.render('department/account/create', {
      user,
      pageName: 'account',
      header: {
        navRoot: 'Quản lí tài khoản',
        navCurrent: 'Tạo tài khoản'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};