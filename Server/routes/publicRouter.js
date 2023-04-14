const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const homeController = require('../controllers/homeController');
const accountController = require('../controllers/accountController');
const roomController = require('../controllers/roomController');
const forumController = require('../controllers/forumController');
const fileUpload = require('express-fileupload');

// // define a session checker which only allows logged in users
// const sessionChecker = (req, res, next)=>{
//     if(req.session.user){
//       next()
//     }else{
//       res.redirect("/?msg=raf")
//     }
//   }
  
//   router.use(sessionChecker)


router.get('/', homeController.view);

router.get('/schoolsearch', schoolController.view);
router.post('/schoolsearch', schoolController.find);

router.get('/viewschool/:sid', schoolController.schoolview);
router.post('/viewschool/:sid', schoolController.schoolviewfilter)

router.get('/register', accountController.register);
router.get('/login', accountController.login);
router.post('/loginuser', accountController.loginUser)
router.post('/registeruser', accountController.registerUser)

//router.get('/getimage/:id', roomController.getImage);


router.get('/:sid/:rid', roomController.roomview);

router.get('/termsofservice', forumController.tos);
router.get('/privacypolicy', forumController.pp);
router.get('/about', forumController.about);
router.get('/faq', forumController.faq);


module.exports = router;