const District = require("../../models/District");
const { Location } = require('../../models/Location');

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

exports.deleteDistrict = async (req, res) => {
  try {
    const { districtId } = req.body;
    if (!districtId || typeof districtId !== 'string')
      throw new Error('Dữ liệu không hợp lệ!');

    const district = await District.findById(districtId).exec();
    if (!district) throw new Error('Quận không tồn tại!');
    const conflicted = await Location.exists({ district: district.name }).exec();
    if (conflicted) throw new Error('Không thể xóa quận đã có điểm đặt!');

    await District.findByIdAndDelete(districtId);
    req.flash('success', 'Xóa quận thành công!');
    return res.redirect('/department/administrative');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/administrative');
  }
};

exports.deleteWard = async (req, res) => {
  try {
    const { districtId, ward } = req.body;
     if (
       !districtId ||
       typeof districtId !== 'string' ||
       !ward ||
       typeof ward !== 'string'
     )
       throw new Error('Dữ liệu không hợp lệ!');
    const trimmedWard = ward.trim();
    const district = await District.findById({
      _id: districtId,
      wards: trimmedWard
    }).exec();
    if (!district) throw new Error('Phường không tồn tại!');
    const conflicted = await Location.exists({
      district: district.name,
      ward: trimmedWard
    }).exec();
    if (conflicted) throw new Error('Không thể xóa phường đã có điểm đặt!');

    await District.findByIdAndUpdate(districtId, {
      $pull: { wards: trimmedWard }
    });
    req.flash('success', 'Xóa phường thành công!');
    return res.redirect('/department/administrative');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/administrative');
  }
};
