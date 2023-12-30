const Enum = require("../../models/Enum");

exports.view = async (req, res) => {
  try {
    const user = req.session.user;
    const methods = await Enum.find({});
    res.render("department/method", {
      user,
      methods,
      pageName: "method",
      header: {
        navRoot: "Quản lí hình thức",
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
    const method = await Enum.findOne({ _id: req.params.id });
    res.render("department/method/detail", {
      user,
      method,
      pageName: "method",
      header: {
        navRoot: "Quản lí hình thức",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Add & delete method
// exports.addMethod = async (req, res) => {
//     try {
//       const newMethod = req.body;
//       const method = await Enum.findOne({ _id: req.params.id });
//       if (!newMethod || typeof newMethod !== 'string') 
//         throw new Error("Hình thức không hợp lệ!");
//       method.findOneAndUpdate(
//         { _id: req.body.id },
//         { $addToSet: { values: newMethod}});
//       method.save()
//       req.flash('success', 'Tạo hình thức mới thành công!');
//       return res.redirect('/department/method');
      
//     } catch (err) {
//       req.flash('error', err.message);
//       return res.redirect('/department/method');
//     }
// };


// exports.removeMethod = async (req, res) => {
//   try {
//     const method = await Enum.findOne({
//       _id: req.params.id,
//       "ads.location": { $in: managed_locations },
//     });
//     if (!method) throw new Error("Không tìm thấy hình thức!");
//     if (method.status != 'pending')
//       throw new Error('Không thể xóa hình thức không tồn tại!');
//     await method.findByIdAndDelete(req.params.id);
//     req.flash("success", "Xóa hình thức thành công!");
//     return res.redirect("department/method", {
//             layout: "layouts/department"});
//   } catch (error) {
//     req.flash("error", "Xóa hình thức không thành công!");
//     return res.redirect("department/method", {
//             layout: "layouts/department"});
//   }
// };
