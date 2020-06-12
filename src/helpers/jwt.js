// Import jwt
const expressJwt = require('express-jwt');

// Call the config file
const config = require('../config/config.js');

// Call the user service
const UserRepository = require('../repositories/UserRepository');

module.exports = jwt;

function jwt() {
    const secret = config.Secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/users/forgot',
            '/users/recovery'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await UserRepository.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};

