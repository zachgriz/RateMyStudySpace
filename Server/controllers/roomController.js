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
    // knex.raw("SELECT ROUND(avg(rating), 1) FROM(SELECT * FROM review, room WHERE room.rid = review.rid and room.sid = review.sid and room.rid = ? and rating IS NOT NULL) as ratings", req.params.rid).then(function(rating){
        //  console.log("rating: ", rating.rows[0].round)
        knex.raw("select * from school where school.sid = ?", req.params.sid).then(function(school){
        // knex.raw("UPDATE room SET room_avg_rating = ? WHERE room.rid = ? and room.sid = ?", [rating.rows[0].round, req.params.rid, req.params.sid]).then(function(update){
        res.render('viewroom', {results: results.rows, school: school.rows});
    }); }); //}); });
    // console.log("rates", ratings)
};

exports.roomrate = (req,res) => {
    // console.log('params: ', req.params);

    res.render('rateroom', {sid: req.params.sid, rid: req.params.rid});
}

exports.rate = (req,res) => {

    const {rating, content} = req.body

    knex('review')
    .insert({rating: rating,
        content: content,
        rid: req.params.rid,
        sid: req.params.sid})
    .then(function() { 
        knex.raw("SELECT ROUND(avg(rating), 1) FROM(SELECT * FROM review, room WHERE room.rid = review.rid and room.sid = review.sid and room.rid = ? and rating IS NOT NULL) as ratings", req.params.rid).then(function(rating){
        knex.raw("UPDATE room SET room_avg_rating = ? WHERE room.rid = ? and room.sid = ?", [rating.rows[0].round, req.params.rid, req.params.sid]).then(function(update){
        knex.raw("SELECT round(avg(room_avg_rating), 1) FROM school, room WHERE room.sid = school.sid and school.sid = ?", req.params.sid).then(function(rating) {
        knex.raw("UPDATE school SET school_avg_rating = ? WHERE school.sid = ?", [rating.rows[0].round, req.params.sid]).then(function (update) {
        knex.raw("SELECT count(*) FROM review where rid = ? and sid = ?", [req.params.rid, req.params.sid]).then(function (num_reviews){
            console.log("nr: ", num_reviews.rows[0].count);
        knex.raw("UPDATE room SET num_reviews = ? WHERE sid = ? and rid = ?", [num_reviews.rows[0].count, req.params.sid, req.params.rid]).then(function (update_reviews){
            res.render('rateroom', {sid: req.params.sid, rid: req.params.rid, alert: "Rating added successfully"});
    }); }); });
    }); }); }); });

   
}

