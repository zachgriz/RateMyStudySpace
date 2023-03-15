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
            res.render('addroom', { results: results.rows });
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
        
        res.render('addroom', {results: results.rows, alert : "Room added successfully. "} );
    });
};

//View rate/room
exports.roomview = (req, res) => {
    knex.raw("select * from school, room where school.sid = room.sid and room.sid = ? and room.rid = ?", [req.params.sid, req.params.rid]).then(function(results){
    knex.raw("select * from school where school.sid = ?", req.params.sid).then(function(school){
        res.render('viewroom', {results: results.rows, school: school.rows});
    });
    });
};

exports.roomrate = (req,res) => {
    // console.log('params: ', req.params);

    res.render('rateroom', {sid: req.params.sid, rid: req.params.rid});
}

exports.rate = (req,res) => {
    console.log("body: ", req.body);

    res.render('rateroom', {alert: "Rating added successfully"});
}

