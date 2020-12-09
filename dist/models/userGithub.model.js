'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserGithubSchema = new _mongoose2.default.Schema({
    profileId: String,
    email: String,
    username: String,
    accessToken: String,
    refreshToken: String,
    provider: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    }
});

var UserGithub = _mongoose2.default.model('UserGithub', UserGithubSchema, 'UsersGithub');
module.exports = UserGithub;