const pathFor = (...roles) => (req, res, next) => {
  if (roles.includes(req?.session?.user?.role)) return next();
  return res.redirect(302, '/');
};

module.exports = pathFor;