
const express = require('express');
const router = express.Router();
const { register, login, changePassword, googleAuth } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/change-password/:userId', changePassword);

module.exports = router;
