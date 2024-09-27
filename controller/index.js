
const user = (req, res) => {
    res.render('index', { title: " ALPHA page" })
}

const ping = (req, res) => {
    res.json({ status: true, message: "This is alpha app" })
}


module.exports = { user, ping }