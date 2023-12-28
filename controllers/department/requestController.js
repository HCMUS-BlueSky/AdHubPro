const Request = require("../../models/Request");
const { Location } = require("../../models/Location");
const { Ads } = require("../../models/Ads");
const District = require("../../models/District");
const { generateRegexQuery } = require("regex-vietnamese");
const moment = require("moment");

exports.view = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  const selectedDistrict = "5";
  const selectedWard = "Không";
  try {
    const user = req.session.user;
    const districts = await District.find({});
    const requests = await Request.find({})
      .populate("ads.location", "address")
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Request.count();
    res.render("department/request/index", {
      districts,
      requests,
      user,
      selectedDistrict,
      selectedWard,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.filter = async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  try {
    const selectedDistrict = req.query.district_select;
    const selectedWard = req.query.ward_select;
    const districtDoc = await District.findById(selectedDistrict).exec();
    let filterLocation = {};
    if (selectedWard == "Không") {
      filterLocation = {
        district: districtDoc.name,
      };
    } else {
      filterLocation = {
        ward: selectedWard,
        district: districtDoc.name,
      };
    }
    const locations = await Location.find(filterLocation);

    const user = req.session.user;
    const districts = await District.find({});

    const requests = await Request.find({
      "ads.location": { $in: locations },
    })
      .populate("ads.location", "address")
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Request.count();
    res.render("department/request/index", {
      districts,
      selectedDistrict: districtDoc.name,
      selectedWard,
      requests,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/district/location");
  }
};

exports.search = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  const selectedDistrict = "5";
  const selectedWard = "Không";
  try {
    const searchTerm = req.query.searchTerm;
    if (typeof searchTerm !== "string")
      throw new Error("Từ khóa không hợp lệ!");
    if (!searchTerm) return res.redirect("/department/request");
    const user = req.session.user;
    const locations = await Location.find({
      $text: {
        $search: `\"${searchTerm}\"`,
      },
    })
      .distinct("_id")
      .exec();
    const districts = await District.find({});
    const rgx = generateRegexQuery(searchTerm);
    const requests = await Request.find({
      $or: [
        {
          "ads.location": { $in: locations },
        },
        {
          "company.name": { $regex: rgx },
        },
        {
          "ads.type": { $regex: rgx },
        },
      ],
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("ads.location", "address")
      .exec();
    const count = await Request.count({
      $or: [
        {
          "ads.location": { $in: locations },
        },
        {
          "company.name": { $regex: rgx },
        },
        {
          "ads.type": { $regex: rgx },
        },
      ],
    });
    res.render("department/request/index", {
      requests,
      selectedDistrict,
      selectedWard,
      user,
      perPage,
      districts,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chung",
      },
      layout: "layouts/department",
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/department/request");
  }
};
exports.getDetail = async (req, res) => {
  try {
    const user = req.session.user;
    const request = await Request.findOne({
      _id: req.params.id,
    }).populate("ads.location", "ward district address");
    res.render("department/request/detail", {
      request,
      user,
      moment,
      pageName: "request",
      header: {
        navRoot: "Yêu cầu cấp phép",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (error) {
    req.flash("error", "Yêu cầu cấp phép không tồn tại!");
    return res.redirect("/department/request");
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).lean();
    if (!request) throw new Error("Không tìm thấy yêu cầu cấp phép!");
    if (request.status != "pending")
      throw new Error("Không thể duyệt yêu cầu đã được xử lí!");
    await Request.findByIdAndUpdate(req.params.id, { status: "accepted" });
    const newAds = new Ads(request.ads);
    await newAds.save();
    await Location.findByIdAndUpdate(request.ads.location, {
      $inc: { ads_count: 1 },
      accepted: true,
    });
    req.flash("success", "Duyệt yêu cầu cấp phép thành công!");
    return res.redirect("/department/request");
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Duyệt yêu cầu cấp phép không thành công!");
    return res.redirect("/department/request");
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).exec();
    if (!request) throw new Error("Không tìm thấy yêu cầu cấp phép!");
    if (request.status != "pending")
      throw new Error("Không thể từ chối yêu cầu đã được xử lí!");
    await Request.findByIdAndUpdate(req.params.id, { status: "rejected" });
    req.flash("success", "Từ chối yêu cầu cấp phép thành công!");
    return res.redirect("/department/request");
  } catch (error) {
    req.flash("error", "Từ chối yêu cầu cấp phép không thành công!");
    return res.redirect("/department/request");
  }
};
