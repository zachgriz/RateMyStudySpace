const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const app = express();
let port = process.env.PORT || 3000;

// Middleware

// Parse form-encoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse json
app.use(bodyParser.json());

// Handle file uploads
// app.use(fileUpload());

// Parse static files 
app.use(express.static(path.join(__dirname, 'public')));

const hbs = exphbs.create({
  helpers: {
    gt: function( a, b ){
      return (a > b);
    }
  },
  extname: '.hbs'
});
//Templating engine (This is where we would use ejs)
// app.set("view engine", "ejs");
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//Database connection
const pool = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME
    }
  });

//establish session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'super secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

const routes = require('../Server/routes/router');

// not sure if this is correct but its the only way i was able to get the file uploader to work
//routes.use(fileUpload())

app.use('/', routes)

app.listen(port, () => console.log('listening on port ' + port));
