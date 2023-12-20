const pathFor = (...roles) => (req, res, next) => {
  if (roles.includes(req?.session?.user?.role)) return next();
  return res.redirect(302, req?.session?.user?.workDir || '/');
};

module.exports = pathFor;