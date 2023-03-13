const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const app = express();
let port = process.env.PORT || 3000;

// Middleware

// Parse form-encoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse json
app.use(bodyParser.json());

// Parse static files 
app.use(express.static(path.join(__dirname, 'public')));

//Templating engine (This is where we would use ejs)
// app.set("view engine", "ejs");
app.engine('hbs', exphbs.engine( {extname: '.hbs' }));
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

const routes = require('../Server/routes/router');
app.use('/', routes)

app.listen(port, () => console.log('listening on port ' + port));
