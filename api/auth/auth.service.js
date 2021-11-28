const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullName) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullName: ${fullName}`)
    if (!username || !password || !fullName) return Promise.reject('fullName, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    const newUser = userService.add({ username, password: hash, fullName })
    delete newUser.password
    return newUser
    // return
}

module.exports = {
    signup,
    login,
}