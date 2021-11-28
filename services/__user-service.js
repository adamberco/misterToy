const fs = require('fs')
const gUsers = require('../data/user.json')

module.exports = {
    query,
    getById,
    signup,
    checkLogin
}

function query(filterBy = {}) {
    return Promise.resolve(gUsers)
}
function getById(userId) {
    const user = gUsers.find(user => user._id === userId)
    return Promise.resolve(user)
}
function checkLogin(nickname, password) {
    const user = gUsers.find(user => user.nickname === nickname)
    if (user && user.password === password) return Promise.resolve(user)
    else return Promise.resolve(null)
}

function signup(nickname, password) {
    let user = gUsers.find(user => user.nickname === nickname)
    if (user) return Promise.resolve(null)
    user = {
        _id: _makeId(),
        nickname,
        password,
        isAdmin: false
    }

    gUsers.push(user)
    return _saveUsersToFile()
        .then(() => user)
}

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/user.json', JSON.stringify(gUsers, null, 2), (err) => {
            if (err) return reject(err)
            resolve();
        })
    })
}