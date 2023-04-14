exports.tos = (req, res) => {
    const user = req.session.user
    res.render('tos', {showButtons: true, user: user});
}

exports.pp = (req, res) => {
    const user = req.session.user
    res.render('pp', {showButtons: true, user: user});
}

exports.about = (req, res) => {
    const user = req.session.user
    res.render('about',{showButtons: true, user: user});
}

exports.faq = (req, res) => {
    const user = req.session.user
    res.render('faq', {showButtons: true, user: user});
}