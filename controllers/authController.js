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

exports.register = async (req, res) => {
  const { email, fullname, phone, password } = req.body;
  try {
    if (
      !email ||
      !fullname ||
      !phone ||
      !password ||
      typeof email !== "string" ||
      typeof fullname !== "string" ||
      typeof phone !== "string" ||
      typeof password !== "string"
    )
      throw new Error("Invalid email, name, phone or password!");
    const exists = await User.exists({ email });
    if (exists) throw new Error("Email already in used");
    if (password.length < 8) throw new Error("Password too short");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      fullname,
      phone,
      password: hashedPassword,
    });
    const user = await newUser.save();
    if (!user) throw new Error("Something went wrong!");
    return res.send("User registered!");
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

// exports.getDetail = async (req, res) => {
//   try {
//     const request = await Request.findOne({ _id: req.params.id });
//     res.render('ward/request/detail', {
//       request
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.createNew = (req, res) => {
//   res.render('ward/request/create');
// };
exports.logout = async (req, res) => {
  // const cookies = req.cookies;
  // const refreshToken = cookies?.refresh_token;
  // if (!refreshToken) return res.sendStatus(204);
  // const user = await User.findOne({ refresh_token: refreshToken }).exec();

  // if (user) {
  //   user.refresh_token = null;
  //   await user.save();
  // }
  req.session = null
  res.clearCookie('session');
  res.clearCookie('session.sig');
  return res.redirect('/');
};