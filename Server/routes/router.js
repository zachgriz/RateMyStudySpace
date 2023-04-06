const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const homeController = require('../controllers/homeController');
const accountController = require('../controllers/accountController');
const roomController = require('../controllers/roomController');

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
router.get('/addschool', schoolController.schoolform);
router.post('/addschool', schoolController.schoolcreate);
router.get('/viewschool/:sid', schoolController.schoolview);

router.get('/register', accountController.register);
router.get('/login', accountController.login);
router.post('/loginuser', accountController.loginUser)
router.post('/registeruser', accountController.registerUser)

router.get('/:sid/addroom', roomController.roomform);
router.post('/:sid/addroom', roomController.roomcreate);
router.get('/:sid/:rid', roomController.roomview);
router.get('/:sid/:rid/rate', roomController.roomrate);
router.post('/:sid/:rid/rate', roomController.rate);


module.exports = router;