const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 登录页
router.get('/', checkNotLogin, (req, res, next) => {
	res.send(req.flash());
})

// POST /signup 用户登录
router.post('/', checkNotLogin, (req, res, next) => {
	res.send(req.flash());
})

module.exports = router;