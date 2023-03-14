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
    console.log("HERE IS WHERE SID? ");
    console.log("sid: ", req.params.sid);
    knex
        knex.raw("select * from school where sid = ?", req.params.sid)
        .then((results) => {
            console.log("now in study rows: ", results.rows);
            res.render('addstudyroom', { results: results.rows });
        });
}

//Add new room
exports.roomcreate = (req, res) => {
    // res.render('addschool');
    console.log('Room created');
    console.log("req body:" , req.body);

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