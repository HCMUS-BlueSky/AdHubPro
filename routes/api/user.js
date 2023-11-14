const express = require('express');
const User = require('../../models/User');
const isAuth = require('../../middleware/isAuth');
const hasRoles = require('../../middleware/hasRoles');
const router = express.Router();

router.get('/', isAuth, async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
});

router.get('/all', hasRoles('department_officer'), async (req, res) => {
  try {
    const users = User.find({}).exec();
    return res.json(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
module.exports = router;
