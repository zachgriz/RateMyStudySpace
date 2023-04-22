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
                    userid: result.userid,
                }
                if(result.pfp)
                {                    
                    var base64 = Buffer.from(result.pfp).toString('base64')
                    req.session.user.pfp = base64
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
    let favereview = null

    if (req.query.msg) {
        res.locals.msg = req.query.msg
        res.locals.bname = req.query.bname
        res.locals.rno = req.query.rno
    }

    knex.select('*').from('review').where({userid:user.userid}).then((reviews) => {

        // get favorite room (highest rated)
        if (reviews.length > 0) {
        favereview = reviews.reduce(
            function (a, b) { return a.rating > b.rating ? a : b}
        )}

        knex.select('*').from('room').where({userid:user.userid}).then((rooms) => {
            
            if (favereview !== null) {
                knex.select('*').from('room').where({rid:favereview.rid}).first().then( (fave) => {
                    
                    res.render('myprofile', {user: user, reviews: reviews, rooms: rooms, fave: fave})
                })   
            } else {
                    
                res.render('myprofile', {user: user, reviews: reviews, rooms: rooms})
            }       
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

exports.editProfileForm = (req, res) => {
    res.render('editprofile', {msg: req.msg})
}

exports.editProfile = (req, res) => {
    const user = req.session.user
    const {username, email, password1, password2} = req.body
    if(password1 != password2)
    {
        res.render('editprofile', {msg: 'Passwords must match'})
    } else {
        if(username !== "")
        {
            knex('user')
            .where({userid:user.userid})
            .update(
                {
                    username: username
                }
            ).then(() => {
                req.session.user.username = username
                console.log('username updated')
            }).then(() => {                
                res.redirect('/user/myprofile')
            })
        }
        if(email !== "")
        {
            knex('user')
            .where({userid:user.userid})
            .update(
                {
                    email: email
                }
            ).then(() => {
                req.session.user.email = email
                console.log('email updated')
            }).then(() => {                
                res.redirect('/user/myprofile')
            })
        }
        if(password1 !== "")
        {
            knex('user')
            .where({userid:user.userid})
            .update(
                {
                    passwordHash: bcrypt.hashSync(password1)
                }
            ).then(() => {
                console.log('password updated')
            }).then(() => {                
                res.redirect('/user/myprofile')
            })
        }
        if(req.files)
        {
            console.log('file added')
            knex('user')
            .where({userid:user.userid})
            .update(
                {
                    pfp: req.files.pfp.data
                }
            ).then(() => {
                console.log(req.files.pfp.data)
                req.session.user.pfp = Buffer.from(req.files.pfp.data).toString('base64')
                console.log(req.session.user.pfp)

                console.log('pfp updated')
            }).then(() => {                
                res.redirect('/user/myprofile')
            })
        }
        // if entire form is empty just render profile page. this seemed like the best way to meet this requirement
        if (!req.files && username === "" && email === "" && password1 === "" && password2 === "")
        {
            res.redirect('/user/myprofile')
        }
    }
}
