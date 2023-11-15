const pathFor = (...roles) => (req, res, next) => {
  if (roles.includes(req?.user?.role)) return next();
  return res.redirect(302, '/');
};

module.exports = pathFor;