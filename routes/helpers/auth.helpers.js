var crypto = require('crypto');
/**
 * 
 */
var authenticationHelpers = {
    getSalt() {
        return crypto.randomBytes(16).toString('hex');
    },
    /**
     * 
     * @param {*} salt 
     * @param {*} password 
     */
    getHash(salt, password) {
        return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    },
    checkIfValidPass(user, password) {
        var unvalidatedHash = authenticationHelpers.getHash(user.salt, password);
        return unvalidatedHash === user.hash;
    }
}

module.exports = authenticationHelpers;