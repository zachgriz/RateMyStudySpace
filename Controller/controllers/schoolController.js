//Database connection
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

        // console.log(results);

        });
}

//Search for specific school
exports.find = (req, res) => {
    let searchterm = req.body.search

    knex
    .select('*')
    .from("school")
    .where('sname', 'LIKE', '%' + searchterm +'%')
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
    // res.render('addschool');

    const {schoolname, countryname, statename, cityname} = req.body;
    
    console.log(schoolname, countryname, statename, cityname);
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

// View selected school
exports.view = (req, res) => {
    // Perform database query
    knex
        .select()
        .from("school")
        .where('sname', '=', req.params.id )
        .then((results) => {
            res.render('viewschool', { results: results });

        // console.log(results);

        });
}