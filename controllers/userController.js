var Service = require('../services/userService')

let getLogin = async function (req, res, next) {
    try {
        var users = await Service.getLogin();
        return res.render('login', { data: users, title: "Succesfully Users Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

module.exports = {
    getLogin : getLogin
}