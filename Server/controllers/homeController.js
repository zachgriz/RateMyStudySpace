exports.view = (req, res) => {
    const user = req.session.user
    res.render('home', {showButtons : true, user: user});
}