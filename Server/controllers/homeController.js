exports.view = (req, res) => {
    const user = req.session.user
    console.log(req.session.user)
    res.render('home', {showButtons : true, user: user});
}