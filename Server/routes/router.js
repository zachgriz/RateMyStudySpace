const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const homeController = require('../controllers/homeController');
const accountController = require('../controllers/accountController');
const studyController = require('../controllers/studyController');


router.get('/', homeController.view);
router.get('/schoolsearch', schoolController.view);
router.post('/schoolsearch', schoolController.find);
router.get('/addschool', schoolController.schoolform);
router.post('/addschool', schoolController.schoolcreate);
router.get('/viewschool/:sid', schoolController.schoolview);
router.get('/register', accountController.register);
router.get('/login', accountController.login);

module.exports = router;