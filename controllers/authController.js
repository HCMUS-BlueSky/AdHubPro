const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      !password ||
      !email ||
      typeof password !== "string" ||
      typeof email !== "string"
    )
      throw new Error("Invalid email or password!");

    if (
      !req.body["g-recaptcha-response"] ||
      typeof req.body["g-recaptcha-response"] !== "string"
    )
      throw new Error("Invalid captcha!");

    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET,
      response: req.body["g-recaptcha-response"],
      remoteip: req.ip,
    });

    const ggRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: params,
      }
    );
    const recaptcha = await ggRes.json();
    if (!recaptcha.success) throw new Error("Invalid captcha!");

    const user = await User.findOne({ email })
      .populate("managed_district", "name")
      .exec();

    if (!user) throw new Error("Email or password is incorrect!");

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) throw new Error("Email or password is incorrect!");
    const sessUser = user.toObject();
    delete sessUser["password"];
    req.session.user = sessUser;
    req.session.user.workDir = "/"; 
    if (user.role === "ward_officer") {
      req.session.user.workDir = '/ward';
      return res.redirect("/ward");
    }
    if (user.role === "district_officer") {
      req.session.user.workDir = '/district';
      return res.redirect("/district");
    }
    if (user.role === "department_officer") {
      req.session.user.workDir = '/department';
      return res.redirect("/department");
    }
    return res.redirect("/");
  } catch (err) {
    return res.render("auth/login", {
      err: err.message,
      layout: "./layouts/auth",
    });
  }
};

// exports.register = async (req, res) => {
//   const { email, fullname, phone, password } = req.body;
//   try {
//     if (
//       !email ||
//       !fullname ||
//       !phone ||
//       !password ||
//       typeof email !== "string" ||
//       typeof fullname !== "string" ||
//       typeof phone !== "string" ||
//       typeof password !== "string"
//     )
//       throw new Error("Invalid email, name, phone or password!");
//     const exists = await User.exists({ email });
//     if (exists) throw new Error("Email already in used");
//     if (password.length < 8) throw new Error("Password too short");
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       email,
//       fullname,
//       phone,
//       password: hashedPassword,
//     });
//     const user = await newUser.save();
//     if (!user) throw new Error("Something went wrong!");
//     return res.send("User registered!");
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// };

exports.changePassword = async (req, res) => {
  try {
    const user = req.session.user;
    const account = await User.findById(user._id).exec();
    const { old_password, new_password, new_password_confirm } = req.body;
    if (!old_password || typeof old_password !== 'string') throw new Error('Mật khẩu cũ không hợp lệ!');
    if (!new_password || typeof new_password !== 'string') throw new Error('Mật khẩu mới không hợp lệ!');
    if (!new_password_confirm || typeof new_password_confirm !== 'string') throw new Error('Xác nhận mợi khẩu mới không hợp lệ!');
    if (new_password !== new_password_confirm) throw new Error("Mật khẩu xác nhận không đúng!");
    if (new_password.length < 8) throw new Error('Mật khẩu quá ngắn, mật khẩu phải dài hơn 8 kí tự!');
    const matched = await bcrypt.compare(old_password, account.password);
    if (!matched) throw new Error('Mật khẩu cũ không đúng!');
  
    const hashedPassword = await bcrypt.hash(new_password, 10);
    account.password = hashedPassword;
    await account.save();
    req.flash('success', 'Thay đổi mật khẩu thành công!');
    if (req?.session?.user?.workDir) {
      return res.redirect(req?.session?.user?.workDir + '/change-password');
    }
    return res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    if (req?.session?.user?.workDir) {
      return res.redirect(req?.session?.user?.workDir + '/change-password');
    }
    return res.redirect('/');
  }
};

exports.createNew = (req, res) => {
  res.render('ward/request/create');
};

exports.logout = async (req, res) => {
  req.session = null
  res.clearCookie('session');
  res.clearCookie('session.sig');
  return res.redirect('/');
};