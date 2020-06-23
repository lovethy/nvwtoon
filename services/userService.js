let getLogin = async function () {
    try {
        var users = { "name":"bb" };
        return users;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

module.exports = {
    getLogin : getLogin
}