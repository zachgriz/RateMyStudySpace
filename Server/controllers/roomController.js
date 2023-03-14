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

// View all rooms at school
exports.view = (req, res) => {
    
    res.render('study', { results: results });

}

//Create a new study room
exports.roomform = (req, res) => {
    knex
        knex.raw("select * from school where sid = ?", req.params.sid)
        .then((results) => {
            res.render('addstudyroom', { results: results.rows });
        });
}

//Add new room
exports.roomcreate = (req, res) => {
    const {buildingname, roomno, address, fits, description} = req.body;
    
    knex('room')
    .insert ({bname: buildingname,
            rno: roomno,
            fits: fits,
            address: address,
            description: description, 
            sid: req.params.sid})
    .then(function() {
        return knex.raw("select * from school where sid = ?", req.params.sid) })
    .then(function(results) {
        
        res.render('addstudyroom', {results: results.rows, alert : "Room added successfully. "} );
    });

};