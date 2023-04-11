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
            })
            .then(() => {
                console.log('user inserted succesfully')
                res.redirect('login')
            })
            .catch(e => {
                //console.log(e)
                // Example for Postgres, where code 23505 is a unique_violation
                if (e.code && e.code === '23505') {
                    res.locals.msg1 = 'Username or email already exists'
                    res.locals.msg2 = 'Username or email already exists'

                    res.render('register')
                    return
                }
            })
            
        
        
    } else {
        res.locals.msg3 = 'Passwords do not match'
        res.render('register', {msg: 'Passwords do not match'})
    }
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
    knex.select('*').from('review').where({username:user.username}).then((reviews) => {
        console.log(reviews)

        // get favorite room (highest rated)
        const favereview = reviews.reduce(
            function (a, b) { return a.rating > b.rating ? a : b}
        )

        knex.select('*').from('room').where({username:user.username}).then((rooms) => {
            
            knex.select('*').from('room').where({rid:favereview.rid}).first().then( (fave) => {
                
                res.render('myprofile', {user: user, reviews: reviews, rooms: rooms, fave: fave})
            })

            
        })
    })
    
}

exports.logout = (req, res) => {
    if (req.session.user)
    {
        req.session.user = null
        res.redirect('/')
    }
}