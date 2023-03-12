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

exports.find = (req, res) => {

    let searchterm = req.body.search

    console.log("searchterm: ", searchterm);

    knex
    .select('*')
    .from("school")
    .where('sname', 'like', '%' + searchterm +'%')
    .then((results) => {
        res.render('schoolsearch', { results: results });

    console.log(results);

    });
}