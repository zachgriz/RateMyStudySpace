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

function getFilterList(array, uniqProperties) {
    return array.filter(
        (value, index, self) =>
            index === self.findIndex(
                t => uniqProperties.every(property => t[property] === value[property])
            )
  )
}

function filterByState(array, filterConstraint) {
    if (filterConstraint !== '') {
        return array.filter(
            (value) => value.state === filterConstraint
        )
    } else {
        return array
    }
}

function filterByCity(array, filterConstraint) {
    if (filterConstraint !== '') {
        return array.filter(
            (value) => value.city === filterConstraint
        )
    } else {
        return array
    }
}

function filterByRating(array, filterConstraint) {
    if (filterConstraint !== '') {
        return array.filter(
            (value) => value.school_avg_rating >= filterConstraint
        )
    } else {
        return array
    }
}



// View all schools in table
exports.view = (req, res) => {
    // Perform database query
    const user = req.session.user

    knex
        .select()
        .from("school")
        .orderBy("numrooms", "desc")
        .then((results) => {
            const states = getFilterList(results, ["state"])
            const cities =  getFilterList(results, ["city"])
            res.render('schoolsearch', { results: results, showButtons : true, user: user, states: states, cities: cities});
        });
}

//Search for specific school. Return a list of schools matching the query string in some way. 
// Both schools and query are set to lowercase to avoid case matching.
exports.find = (req, res) => {
    const searchterm = req.body.search
    const user = req.session.user

    let sortby = req.body.sortby
    if (sortby === '') { sortby = 'numrooms'}

    knex.raw("SELECT * FROM school WHERE lower(sname) LIKE lower('%" + searchterm + "%') ORDER BY " + sortby + " ASC")
    .then((results) => {

        results.rows = filterByState(results.rows, req.body.state)
        results.rows = filterByCity(results.rows, req.body.city)
        results.rows = filterByRating(results.rows, req.body.rating)

        const states = getFilterList(results.rows, ["state"])
        const cities =  getFilterList(results.rows, ["city"])

        res.render('schoolsearch', { results: results.rows, count: results.rows.length, searchterm: searchterm, showButtons : true, user: user,
                                        states: states, cities: cities});
    });  
}

//Add new school
exports.schoolform = (req, res) => {
    res.render('addschool');
};

//Add new school
exports.schoolcreate = (req, res) => {
    const {schoolname, countryname, statename, cityname} = req.body;
    const user = req.session.user

    knex
    .insert ({sname: schoolname,
            country: countryname,
            state: statename,
            city: cityname
    })
    .into("school")
    .then((results) => {
        res.render('addschool', {alert : "School added successfully. ", showButtons: true, user: user} );
    });
};

// View selected school. Chains together multiple queries with knex by using .then(). Finally, pass the results of all queries to the school view. Select school, select all room for given school, and select no. of rooms for given school.
exports.schoolview = (req, res) => {
    const user = req.session.user

    knex.raw("select * from school where sid = ?", req.params.sid).then(function (schools) {
        knex.raw("select * from room, school where room.sid = school.sid and room.sid = ?", req.params.sid).then(function (rooms) {
            knex.raw("select count(*) from room, school where room.sid = school.sid and room.sid = ?", req.params.sid).then(function (count) {
                knex.raw("update school set numrooms = (select count(*) from room, school where room.sid = school.sid and room.sid = ?) where school.sid = ?", [req.params.sid, req.params.sid])
                    .then(function (result) {
                        
                        res.render('viewschool', { results: schools.rows, rooms: rooms.rows, count: count.rows, showButtons : true, user: user });
                    });
                });
            });
           // });
        // });
    });
}