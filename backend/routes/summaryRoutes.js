const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const { getSummary } = require('../controllers/summaryController');

router.get(
   '/',
   auth,
   authorize('VIEWER', 'ANALYST', 'ADMIN'),
   getSummary
);

module.exports = router;