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
    let uniqueUsername
    let uniqueEmail
    knex.select('*').from('user').where({username: req.body.username}).first().then( (user) => {
        if (!user) {
            uniqueUsername = true;
        } else { uniqueUsername = false; }

        knex.select('*').from('user').where({email: req.body.email}).first().then( (user) => {
            if (!user) {
                uniqueEmail = true;
            } else { uniqueEmail = false; }

            // insert user  (unique username, email, and passwords match)
            if(uniqueUsername && uniqueEmail && (req.body.password1 === req.body.password2)) {
                knex('user').insert(
                    {
                        username: req.body.username, 
                        email: req.body.email, 
                        passwordHash: bcrypt.hashSync(req.body.password1)
                    }).then(console.log("User added successfully"))
                
                res.render('home')

            // passwords don't match
            } else if (uniqueUsername && uniqueEmail && !(req.body.password1 === req.body.password2)){
                res.locals.msg3 = 'Passwords do not match'
                res.render('register', {msg3: 'Passwords do not match'})

            // username is not unique
            } else if (!uniqueUsername && uniqueEmail && (req.body.password1 === req.body.password2)){
                res.locals.msg1 = 'Username already exists'
                res.render('register', {msg1: 'Username already exsits'})

            // email is not unique
            } else if (uniqueUsername && !uniqueEmail && (req.body.password1 === req.body.password2)){
                res.locals.msg2 = 'Email already exists'
                res.render('register', {msg2: 'Email already exsits'})

            // username and email are not unique
            }  else if (!uniqueUsername && !uniqueEmail && (req.body.password1 === req.body.password2)) {
                res.locals.msg1 = 'Username already exists'
                res.locals.msg2 = 'Email already exists'
                res.render('register', {msg1: 'Username already exsits', msg2: 'Email already exists'})

            // email is not unique and passwords don't match
            } else if (uniqueUsername && !uniqueEmail && !(req.body.password1 === req.body.password2)) {
                res.locals.msg2 = 'Email already exists'
                res.locals.msg3 = 'Passwords do not match'
                res.render('register', {msg2: 'Email already exists', msg3: 'Passwords do not match'})

            // username is not unique and passwords don't match
            } else if (!uniqueUsername && uniqueEmail && !(req.body.password1 === req.body.password2)) {
                res.locals.msg1 = 'Username already exists'
                res.locals.msg3 = 'Passwords do not match'
                res.render('register', {msg1: 'Username already exsits', msg3: 'Passwords do not match'})
            }
            else {
                res.locals.msg1 = 'Username already exists'
                res.locals.msg2 = 'Email already exists'
                res.locals.msg3 = 'Passwords do not match'
                res.render('register', {msg1: 'Username already exsits', msg2: 'Email already exists', msg3: 'Passwords do not match'})
            }
        })
    })

}

exports.loginUser = (req, res) => {
    
    knex.select('*').from('user').where({username: req.body.username}).first().then( (result) => {
        if (result) {
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
        } else {
            res.render('login', {msg: "No user"})
        }
    })
    
}

exports.myprofile = (req, res) => {

    const user = req.session.user
    res.render('myprofile', {user: user})
}