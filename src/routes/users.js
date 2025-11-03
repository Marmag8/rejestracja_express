const express = require('express');

const router = express.Router();

const controllers = require('../controllers/usersControllers');

router.get('/', controllers.index);
router.get('/users/new', controllers.newForm);
router.post('/users', controllers.create);
router.get('/users/login', controllers.loginForm);
router.post('/users/login', controllers.login);
router.get('/users/:slug', controllers.show);

module.exports = router;