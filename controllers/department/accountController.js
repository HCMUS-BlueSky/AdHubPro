const Account = require("../../models/User");
const moment = require("moment");
const District = require("../../models/District");
const bcrypt = require('bcrypt');

exports.view = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const user = req.session.user;
    const accounts = await Account.find({})
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage);
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
  try {
    const user = req.session.user;
    const account = await Account.findOne({ _id: req.params.id }).populate(
      'managed_district',
      'name'
    );
    if (!account) throw new Error('Tài khoản không tồn tại!');
    res.render('department/account/detail', {
      user,
      account,
      moment,
      pageName: 'account',
      header: {
        navRoot: 'Quản lí tài khoản',
        navCurrent: 'Thông tin chi tiết'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', 'Tài khoản không tồn tại!');
    return res.redirect('/department/account');
  }
};

exports.search = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const searchTerm = req.query.searchTerm;
    if (typeof searchTerm !== 'string')
      throw new Error('Từ khóa không hợp lệ!');
    if (!searchTerm) return res.redirect('/department/account');
    const user = req.session.user;
    const accounts = await Account.find({
      $text: {
        $search: `\"${searchTerm}\"`
      }
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Account.count({
      $text: {
        $search: `\"${searchTerm}\"`
      }
    });
    res.render('department/account/index', {
      user,
      accounts,
      perPage,
      user,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: 'account',
      header: {
        navRoot: 'Quản lí tài khoản',
        navCurrent: 'Thông tin chung'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/account');
  }
};

exports.renderUpdateInfo = async (req, res) => {
  try {
    const user = req.session.user;
    const account = await Account.findOne({ _id: req.params.id }).populate(
      "managed_district",
      "name"
    );
    if (!account) throw new Error("Tài khoản không tồn tại!");
    if (user._id != account._id && account.role === "department_officer")
      throw new Error("Không thể sửa thông tin cán bộ sở khác!");
    res.render("department/account/update", {
      user,
      account,
      moment,
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Cập nhật tài khoản",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/department/account");
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const user_id = req.params.id;
    const current_user = req.session.user;
    const account = await Account.findById(user_id).exec();
    if (!account) throw new Error("Tài khoản không tồn tại!");
    if (
      current_user._id != account._id &&
      account.role === "department_officer"
    )
      throw new Error("Không thể sửa thông tin cán bộ sở khác!");
    const {
      fullname,
      birthdate,
      phone,
      gender,
      identity_code,
      email,
      password,
    } = req.body;
    const updated_account = {};
    if (fullname && fullname.length && typeof fullname === "string")
      updated_account.fullname = fullname;
    if (birthdate && birthdate.length && typeof birthdate === "string")
      updated_account.birthdate = birthdate;
    if (phone && phone.length && typeof phone === "string")
      updated_account.phone = phone;
    if (gender && gender.length && typeof gender === "string") {
      if (gender === "male") updated_account.gender = true;
      if (gender === "female") updated_account.gender = false;
    }
    if (
      identity_code &&
      identity_code.length &&
      typeof identity_code === "string"
    )
      updated_account.identity_code = identity_code;

    if (email && email.length && typeof email === "string") {
      const existed = await Account.exists({ email, _id: { $ne: user_id } });
      if (existed) throw new Error("Email đã được sử dụng!");
      updated_account.email = email;
    }
    if (password && password.length && typeof password === "string") {
      if (password.length < 8)
        throw new Error("Mật khẩu quá ngắn, mật khẩu phải dài hơn 8 kí tự!");
      const hashedPassword = await bcrypt.hash(password, 10);
      updated_account.password = hashedPassword;
    }
    Object.assign(account, updated_account);
    await account.save();
    req.flash("success", "Cập nhật tài khoản thành công!");
    return res.redirect("/department/account");
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/department/account");
  }
};

exports.renderCreate = async (req, res) => {
  try {
    const user = req.session.user;
    const districts = await District.find({});
    res.render("department/account/create", {
      districts,
      user,
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Tạo tài khoản",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash('error', 'Lỗi hệ thống');
    return res.redirect('/department/account');
  }
};

exports.create = async (req, res) => {
  try {
    const {
      fullname,
      birthdate,
      gender,
      phone,
      identity_code,
      email,
      password,
      role,
      managed_district,
      managed_ward
    } = req.body;
    if (!fullname || typeof fullname !== 'string') 
      throw new Error("Họ tên không hợp lệ!");
    if (!birthdate || typeof birthdate !== 'string')
      throw new Error('Ngày sinh không hợp lệ!');
    if (!gender || typeof gender !== 'string')
      throw new Error('Giới tính không hợp lệ!');
    if (!phone || typeof phone !== 'string')
      throw new Error('Số điện thoại không hợp lệ!');
    if (!identity_code || typeof identity_code !== 'string')
      throw new Error('CMND/CCCD không hợp lệ!');
    if (!email || typeof email !== 'string')
      throw new Error('Email không hợp lệ!');
    if (
      !role ||
      typeof role !== 'string' ||
      (role !== 'ward_officer' && role !== 'district_officer')
    )
      throw new Error('Chức vụ không hợp lệ!');
    if (!password || typeof password !== 'string')
      throw new Error('Mật khẩu không hợp lệ!');
    if (password.length < 8)
      throw new Error('Mật khẩu quá ngắn, mật khẩu phải dài hơn 8 kí tự!');

    const new_user = new Account({
      fullname,
      birthdate,
      phone,
      identity_code,
      email,
      role
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    new_user.password = hashedPassword;
    if (gender === "male") {
      new_user.gender = true;
    }
    else if (gender === "female") {
      new_user.gender = false;
    }
    else {
      throw new Error('Giới tính không hợp lệ!');
    }
    if (!managed_district || typeof managed_district !== 'string')
      throw new Error('Quận quản lí không hợp lệ!');
    const exist_district = await District.exists({ _id: managed_district });
    if (!exist_district) throw new Error('Quận quản lí không hợp lệ!');
    new_user.managed_district = managed_district;
    if (role === 'ward_officer') {
      if (!managed_ward || typeof managed_ward !== 'string')
        throw new Error('Phường quản lí không hợp lệ!');
      const exist_ward = await District.exists({
        _id: managed_district,
        wards: managed_ward
      });
      if (!exist_ward) throw new Error('Phường quản lí không hợp lệ!');
      new_user.managed_ward = managed_ward;
    }
    await new_user.save();
    req.flash('success', 'Tạo tài khoản cán bộ thành công!');
    return res.redirect('/department/account');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/account');
  }
};

exports.renderAssign = async (req, res) => {
  try {
    const user = req.session.user;
    const account = await Account.findOne({ _id: req.params.id }).exec();
    if (!account) throw new Error('Tài khoản không tồn tại!');
    if (account.role === 'department_officer')
      throw new Error('Không thể phân công khu vực cho cán bộ sở!');
    const districts = await District.find({});
    return res.render("department/account/assign", {
      user,
      districts,
      pageName: "account",
      header: {
        navRoot: "Quản lí tài khoản",
        navCurrent: "Phân công khu vực quản lý",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/account');
  }
};

exports.assign = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = req.session.user;
    const account = await Account.findById(user_id).exec();
    if (!account) throw new Error('Tài khoản không tồn tại!');
    if (account.role === 'department_officer')
      throw new Error('Không thể phân công khu vực cho cán bộ sở!');
    const { role, managed_district, managed_ward } = req.body;
    if (
      !role ||
      typeof role !== 'string' ||
      (role !== 'ward_officer' && role !== 'district_officer')
    )
      throw new Error('Chức vụ không hợp lệ!');
    
    account.role = role;
    if (!managed_district || typeof managed_district !== 'string')
      throw new Error('Quận quản lí không hợp lệ!');
    const exist_district = await District.exists({ _id: managed_district });
    if (!exist_district) throw new Error('Quận quản lí không hợp lệ!');
    account.managed_district = managed_district;
    if (role === 'ward_officer') {
      if (!managed_ward || typeof managed_ward !== 'string')
        throw new Error('Phường quản lí không hợp lệ!');
      const exist_ward = await District.exists({
        _id: managed_district,
        wards: managed_ward
      });
      if (!exist_ward) throw new Error('Phường quản lí không hợp lệ!');
      account.managed_ward = managed_ward;
    }
    await account.save();   
    req.flash('success', 'Phân công khu vực cho cán bộ thành công!');
    return res.redirect('/department/account');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/account');
  }
};
