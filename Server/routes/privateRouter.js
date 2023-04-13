const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const homeController = require('../controllers/homeController');
const accountController = require('../controllers/accountController');
const roomController = require('../controllers/roomController');
const forumController = require('../controllers/forumController');
const fileUpload = require('express-fileupload');

const sessionChecker = (req, res, next) => {
    if(req.session.user){
      next()
    } else {
      res.redirect('/login')
    }
  
}
  

router.use(sessionChecker)
router.use(fileUpload())

router.get('/addschool', schoolController.schoolform);
router.post('/addschool', schoolController.schoolcreate);

router.get('/myprofile', accountController.myprofile)
router.get('/logout', accountController.logout)

router.get('/:sid/addroom', roomController.roomform);
router.post('/:sid/addroom', roomController.roomcreate);
router.post('/:sid/:rid/rate', roomController.rate);
router.get('/:sid/:rid/rate', roomController.roomrate);


module.exports = router;