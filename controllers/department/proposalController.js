const { Location } = require("../../models/Location");
const { Ads } = require('../../models/Ads');
const Proposal = require("../../models/Proposal");
const Enum = require('../../models/Enum');
const { generateRegexQuery } = require('regex-vietnamese');

exports.view = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const user = req.session.user;
    const proposal = await Proposal.find({})
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .exec();
    const count = await Proposal.count();
    res.render("department/proposal/index", {
      proposal,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: "proposal",
      header: {
        navRoot: "Yêu cầu chỉnh sửa",
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
    const proposal = await Proposal.findOne({
      _id: req.params.id,
    })
      .populate({
        path: "location",
        select: ["address", "ward", "district", "method"],
      })
      .populate({ path: "ads", select: ["type", "size", "images"] });
    res.render("department/proposal/detail", {
      proposal,
      user,
      pageName: "proposal",
      header: {
        navRoot: "Yêu cầu chỉnh sửa",
        navCurrent: "Thông tin chi tiết",
      },
      layout: "layouts/department",
    });
  } catch (error) {
    req.flash("error", "Yêu cầu chỉnh sửa không tồn tại!");
    return res.redirect("/department/proposal");
  }
};

exports.approve = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({
      _id: req.params.id
    });
    if (!proposal) throw new Error('Không tìm thấy yêu cầu chỉnh sửa!');
    if (proposal.status !== 'pending') throw new Error("Yêu cầu chỉnh sửa đã được xử lí!");
    if (proposal.type === 'Điểm đặt quảng cáo') {
      const location = await Location.findById(proposal.location).exec();
      if (!location) throw new Error("Không tìm thấy điểm đặt quảng cáo!");
      const { latitude, longitude, _id, created_at, updated_at, ...filtered } =
        proposal.updated_location._doc;
      // if (filtered.ward && 
      //   typeof filtered.ward === "string" &&
      //   filtered.ward.length > 0)
      //   location.ward = filtered.ward;
      // if (filtered.district && 
      //   typeof filtered.district === "string" && 
      //   filtered.district.length > 0)
      //   location.district = filtered.district;
      if (
        filtered.address &&
        typeof filtered.address === 'string' &&
        filtered.address.length > 0
      )
        location.address = filtered.address;
      if (
        filtered.type &&
        typeof filtered.type === 'string' &&
        filtered.type.length > 0
      ) {
        const typeExisted = await Enum.exists({
          name: 'LocationType',
          values: filtered.type
        }).exec();
        if (!typeExisted) throw new Error('Loại địa điểm không hợp lệ!');
        location.type = filtered.type;
      }
      if (
        filtered.method &&
        typeof filtered.method === 'string' &&
        filtered.method.length > 0
      ) {
        const methodExisted = await Enum.exists({
          name: 'LocationMethod',
          values: filtered.method
        }).exec();
        if (!methodExisted)
          throw new Error('Hình thức quảng cáo không hợp lệ!');
        location.method = filtered.method;
      }
      if (
        filtered.images &&
        Array.isArray(filtered.images) &&
        filtered.images.length > 0
      )
        location.images = filtered.images;
      await location.save();
      proposal.status = 'accepted';
      await proposal.save();
    } else if (proposal.type === 'Bảng quảng cáo') {
      const ads = await Ads.findById(proposal.ads).exec();
      if (!ads) throw new Error('Không tìm thấy bảng quảng cáo!');
      const { location, _id, created_at, updated_at, ...filtered } =
        proposal.updated_ads._doc;
      if (
        filtered.type &&
        typeof filtered.type === 'string' &&
        filtered.type.length > 0
      ) {
        const typeExisted = await Enum.exists({
          name: 'AdsType',
          values: filtered.type
        }).exec();
        if (!typeExisted) throw new Error('Loại bảng quảng cáo không hợp lệ!');
        ads.type = filtered.type;
      }
      if (
        filtered.size &&
        typeof filtered.size === 'string' &&
        filtered.size.length > 0
      )
        ads.size = filtered.size;
      if (
        filtered.images &&
        Array.isArray(filtered.images) &&
        filtered.images.length > 0
      )
        ads.images = filtered.images;
      await ads.save();
      proposal.status = 'accepted';
      await proposal.save();
    } else {
      throw new Error('Sai loại yêu cầu chỉnh sửa!');
    }
    req.flash('success', "Duyệt yêu cầu chỉnh sửa thành công!");
    return res.redirect('/department/proposal');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/proposal');
  }
};

exports.reject = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({
      _id: req.params.id
    });
    if (!proposal) throw new Error('Không tìm thấy yêu cầu chỉnh sửa!');
    if (proposal.status !== 'pending')
      throw new Error('Yêu cầu chỉnh sửa đã được xử lí!');
    proposal.status = 'rejected';
    await proposal.save();
    req.flash('success', 'Từ chối duyệt yêu cầu chỉnh sửa thành công!');
    return res.redirect('/department/proposal');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/proposal');
  }
};

exports.search = async (req, res) => {
  const perPage = 10;
  const page = req.query.page || 1;
  try {
    const searchTerm = req.query.searchTerm;
    if (typeof searchTerm !== 'string')
      throw new Error('Từ khóa không hợp lệ!');
    if (!searchTerm) return res.redirect('/department/proposal');
    const user = req.session.user;
    const locations = await Location.find({
      $text: {
        $search: `\"${searchTerm}\"`
      }
    })
      .distinct('_id')
      .exec();
    const rgx = generateRegexQuery(searchTerm);
    const proposal = await Proposal.find({
      $or: [
        {
          location: { $in: locations }
        },
        {
          type: { $regex: rgx }
        }
      ]
    })
      .sort({ created_at: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: 'location',
        select: ['address', 'ward', 'district', 'method']
      })
      .exec();
    const count = await Proposal.count({
      $or: [
        {
          location: { $in: locations }
        },
        {
          type: { $regex: rgx }
        }
      ]
    });
    res.render('department/proposal/index', {
      proposal,
      user,
      perPage,
      current: page,
      pages: Math.ceil(count / perPage),
      pageName: 'proposal',
      header: {
        navRoot: 'Yêu cầu chỉnh sửa',
        navCurrent: 'Thông tin chung'
      },
      layout: 'layouts/department'
    });
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/department/proposal');
  }
};