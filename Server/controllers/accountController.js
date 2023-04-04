const bcrypt = require('bcryptjs')
require('dotenv').config({path:__dirname+'/./../../.env'})

// Database connection
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});

exports.register = (req, res) => {
    res.render('register', {showButtons : false});
}

exports.login = (req, res) => {
    res.render('login', {showButtons : false});
}

exports.registerUser = (req, res) => {
    if(req.body.password1 === req.body.password2) {
        knex('user').insert(
            {
                username: req.body.username, 
                email: req.body.email, 
                passwordHash: bcrypt.hashSync(req.body.password1)
            }).then(console.log("User added successfully"))
         
        res.render('home')
    } else {
        res.locals.msg = 'Passwords do not match'
        res.render('register', {msg: 'Passwords do not match'})
    }
}

exports.loginUser = (req, res) => {
    
    knex.select('*').from('user').where({username: req.body.username}).first().then( (result) => {
        if(bcrypt.compareSync(req.body.password, result.passwordHash))
        {
            req.session.user = {
                username: result.username,
                email: result.email,
                userid: result.userid
            }

            res.redirect('/')
        } else {
            res.render('login', {msg: "Incorrect password"})
        }
    })
    
}

exports.myprofile = (req, res) => {

    const user = req.session.user
    res.render('myprofile', {user: user})
}