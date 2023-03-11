const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
let port = process.env.PORT || 3000;

// Middleware

// Parse form-encoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse json
app.use(bodyParser.json());

// Parse static files 
app.use(express.static('public'))

//Templating engine (This is where we would use ejs)
// app.set("view engine", "ejs");
app.engine('hbs', exphbs.engine( {extname: '.hbs' }));
app.set('view engine', 'hbs');


app.get('/schoolsearch', (req,res) => 
{
    res.render('schoolsearch');
});

app.listen(port, () => console.log('listening on port ' + port));
