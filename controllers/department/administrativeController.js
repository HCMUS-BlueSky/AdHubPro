const District = require("../../models/District");

exports.view = async (req, res) => {
  try {
    const user = req.session.user;
    const districts = await District.find({}).exec();
    res.render("department/administrative", {
      user,
      districts,
      pageName: "administrative",
      header: {
        navRoot: "Quản lí đơn vị hành chính",
        navCurrent: "Thông tin quận",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.addDistrict = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== 'string')
      throw new Error('Dữ liệu không hợp lệ!');
    const filtered = value.trim().replace(/^quận */gi, '');
    const newDistrict = new District({ name: filtered });
    await newDistrict.save();
    req.flash('success', 'Thêm quận thành công!');
    return res.redirect('/department/administrative');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/administrative');
  }
};

exports.addWard = async (req, res) => {
  try {
    const { districtId, ward } = req.body;
    if (
      !districtId ||
      typeof districtId !== 'string' ||
      !ward ||
      typeof ward !== 'string'
    )
      throw new Error('Dữ liệu không hợp lệ!');
    const district = await District.findById(districtId).exec();
    if (!district) throw new Error('Quận không tồn tại!')
    const filtered = ward.trim().replace(/^phường */gi, '');
    await District.findByIdAndUpdate(districtId, {
      $push: { wards: filtered }
    });
    req.flash('success', 'Thêm phường thành công!');
    return res.redirect('/department/administrative');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/administrative');
  }
};

