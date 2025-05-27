const express = require('express');
const { register, login, currentUser, forgetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/current',protect,currentUser);
router.post('/forgetPassword',forgetPassword);




module.exports = router;