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

router.get('/editprofile', accountController.editProfileForm)
router.post('/editprofile', accountController.editProfile)

router.get('/:sid/addroom', roomController.roomform);
router.post('/:sid/addroom', roomController.roomcreate);
router.post('/rate/:sid/:rid', roomController.rate);
router.get('/rate/:sid/:rid', roomController.roomrate);


module.exports = router;