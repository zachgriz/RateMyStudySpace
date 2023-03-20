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

    console.log("rid = " + req.params.rid)

    knex.raw("select * from school, room where school.sid = room.sid and room.sid = ? and room.rid = ?", [req.params.sid, req.params.rid]).then(function(results){
    knex.raw("SELECT ROUND(avg(rating), 2) FROM(SELECT * FROM review, room WHERE room.rid = review.rid and room.sid = review.sid and room.rid = ?) as ratings", req.params.rid).then(function(rating){
    console.log("ratingval: ", Number(rating.rows[0].round))
    knex.raw("UPDATE room SET room_avg_rating = ? WHERE room.rid = ? and room.sid = ?", [Number(rating.rows[0].round), req.params.rid, req.params.sid]).then(function(update){
    knex.raw("select * from school where school.sid = ?", req.params.sid).then(function(school){
        res.render('viewroom', {results: results.rows, school: school.rows});
    }); }); }); });
    // console.log("rates", ratings)
};

exports.roomrate = (req,res) => {
    // console.log('params: ', req.params);

    res.render('rateroom', {sid: req.params.sid, rid: req.params.rid});
}

exports.rate = (req,res) => {

    const {rating, content} = req.body
    console.log("rating: ", rating);

    knex('review')
    .insert({rating: rating,
        content: content,
        rid: req.params.rid,
        sid: req.params.sid})
    .then(function() { 
         res.render('rateroom', {sid: req.params.sid, rid: req.params.rid, alert: "Rating added successfully"});
    })

   
}

