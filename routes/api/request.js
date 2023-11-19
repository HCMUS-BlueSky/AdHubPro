const express = require('express');
const Request = require('../../models/Request');
const hasRoles = require('../../middleware/hasRoles');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find({}).exec();
    return res.json(requests);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router