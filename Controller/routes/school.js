const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');


router.get('/schoolsearch', schoolController.view);
router.post('/schoolsearch', schoolController.find);
router.get('/addschool', schoolController.schoolform);
router.post('/addschool', schoolController.schoolcreate);
router.post('/viewschool/:id', schoolController.schoolview);



module.exports = router;