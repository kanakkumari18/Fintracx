const express = require('express');

const router = express.Router();

const { register, login } = require('../controllers/authController');

const validate = require('../middleware/validate');

const {
   registerValidator,
   loginValidator
} = require('../validators/authValidator');

router.post('/register', registerValidator, validate, register);

router.post('/login', loginValidator, validate, login);

module.exports = router;