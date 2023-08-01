const jwt = require('jsonwebtoken');
config = require('../config');
const secret = config.jwt.secret;

const assignToken = (data) =>{
    return jwt.sign(data, secret);
}

module.exports = {
    assignToken
}