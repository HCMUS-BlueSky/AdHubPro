const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/logout', authController.logout);

router.post('/change_password', (req, res, next) => {
  if (req?.session?.user?.workDir) return next();
  return res.redirect('/');
}, authController.changePassword);

router.use((req, res, next) => {
  if (req?.session?.user?.workDir) {
    if (req?.session?.user?.workDir == '/') return next();
    return res.redirect(req?.session?.user?.workDir);
  }
  return next();
});

router.get('/', (req, res) => {
  return res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
  return res.render('auth/login', { layout: './layouts/auth' });
});

router.post('/login', authController.login);

module.exports = router;
