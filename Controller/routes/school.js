const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');


router.get('/schoolsearch', schoolController.view);
router.post('/schoolsearch', schoolController.find);



module.exports = router;