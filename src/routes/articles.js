const express = require('express');

const router = express.Router();

const controllers = require('../controllers/articlesController');

router.get('/', controllers.index);
router.get('/articles/new', controllers.newForm);
router.post('/articles', controllers.create);
router.get('/articles/:slug', controllers.show);

module.exports = router;