// Database connection
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: "localhost",
        user: "postgres",
        password: "dragon567",
        database: "Rate My Study Room"
    }
});

// View all schools in table
exports.view = (req, res) => {
    // Perform database query
    knex
        .select()
        .from("school")
        .then((results) => {
            res.render('schoolsearch', { results: results });
        });
}

//Search for specific school
exports.find = (req, res) => {
    let searchterm = req.body.search

    knex
    .select('*')
    .from("school")
    .where('sname', 'LIKE', ['%' + searchterm +'%'])
    .then((results) => {
        res.render('schoolsearch', { results: results });

    });
}

//Add new school
exports.schoolform = (req, res) => {
    res.render('addschool');
};

//Add new school
exports.schoolcreate = (req, res) => {
    const {schoolname, countryname, statename, cityname} = req.body;
    
    knex
    .insert ({sname: schoolname,
            country: countryname,
            state: statename,
            city: cityname
    })
    .into("school")
    .then((results) => {
        res.render('addschool', {alert : "School added successfully. "} );
    });
};

// View selected school. Chains together multiple queries with knex by using .then(). Finally, pass the results of all queries to the school view. Select school, select all room for given school, and select no. of rooms for given school.
exports.schoolview = (req, res) => {
    knex.raw("select * from school where sid = ?", req.params.sid).then(function (schools) {
        knex.raw("select * from room, school where room.sid = school.sid and room.sid = ?", req.params.sid).then(function (rooms) {
            knex.raw("select count(*) from room, school where room.sid = school.sid and room.sid = ?", req.params.sid).then(function (count) {
                knex.raw('update school set numrooms = (select count(*) from room, school where room.sid = school.sid and room.sid = ?) where school.sid = ?', [req.params.sid, req.params.sid])
                    .then(function (result) {
                        res.render('viewschool', { results: schools.rows, rooms: rooms.rows, count: count.rows });
                    });
            });
        });
    });
    

   
   
       
}