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

function filterByAttribute(array, filterConstraint, attribute) {
    if (filterConstraint !== '' && filterConstraint !== undefined) {
        return array.filter(
            (value) => value[attribute] === filterConstraint
        )
    } else {
        return array
    }
}

function filterByRating(array, filterConstraint, attribute) {
    if (filterConstraint !== '' && filterConstraint !== undefined) {
        return array.filter(
            (value) => value[attribute] >= filterConstraint
        )
    } else {
        return array
    }
}

function filterByFits(array, filterConstraint) {
    if (filterConstraint !== '' && filterConstraint !== undefined) {
        return array.filter(
            function (value) {
                if (filterConstraint === '0') {return value.fits < 5}
                else if (filterConstraint === '5') {return value.fits <= 10 && value.fits >= 5}
                else {return value.fits > 10}
            }
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
    var searchterm = req.body.search
    const user = req.session.user

    let sortby = req.body.sortby
    if (sortby === '') { sortby = 'numrooms DESC'}
    if (sortby === undefined) { sortby = 'numrooms DESC'}
    if (sortby === 'school_avg_rating') { sortby = 'school_avg_rating DESC NULLS LAST'}

    knex.raw("SELECT * FROM school WHERE lower(sname) LIKE lower('%" + searchterm + "%') ORDER BY " + sortby)
    .then((results) => {

        results.rows = filterByAttribute(results.rows, req.body.state, 'state')
        results.rows = filterByAttribute(results.rows, req.body.city, 'city')
        results.rows = filterByRating(results.rows, req.body.rating, 'school_avg_rating')

        knex.raw("SELECT city,state from school").then((listItems) => {
        const states = getFilterList(listItems.rows, ["state"])
        const cities =  getFilterList(listItems.rows, ["city"])

        res.render('schoolsearch', { results: results.rows, count: results.rows.length, searchterm: searchterm, showButtons : true, user: user,
                                        states: states, cities: cities});
        });
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

                        knex.raw("SELECT bname from room").then((listItems) => {
                            const buildings = getFilterList(listItems.rows, ["bname"])

                            res.render('viewschool', { results: schools.rows, rooms: rooms.rows, count: count.rows, showButtons : true, user: user, buildings: buildings });

                        })
                    });
                });
            });
           // });
        // });
    });
}

exports.schoolviewfilter = (req, res) => {
    const user = req.session.user

    let sortby = req.body.sortby
    if (sortby === '') { sortby = 'num_reviews DESC'}
    if (sortby === 'room_avg_rating') { sortby = 'room_avg_rating DESC NULLS LAST'}

    knex.raw("select * from school where sid = ?", req.params.sid).then(function (schools) {
        knex.raw("select * from room, school where room.sid = school.sid and room.sid = ? order by "+sortby, req.params.sid).then(function (rooms) {
            knex.raw("select count(*) from room, school where room.sid = school.sid and room.sid = ?", req.params.sid).then(function (count) {
                knex.raw("update school set numrooms = (select count(*) from room, school where room.sid = school.sid and room.sid = ?) where school.sid = ?", [req.params.sid, req.params.sid])
                    .then(function (result) {

                        rooms.rows = filterByAttribute(rooms.rows, req.body.building, 'bname')
                        rooms.rows = filterByFits(rooms.rows, req.body.fits)
                        rooms.rows = filterByRating(rooms.rows, req.body.rating, 'room_avg_rating')

                        knex.raw("SELECT bname from room").then((listItems) => {
                            const buildings = getFilterList(listItems.rows, ["bname"])

                            res.render('viewschool', { results: schools.rows, rooms: rooms.rows, count: count.rows, showButtons : true, user: user, buildings: buildings });

                        })
                    });
                });
            });
    });
}