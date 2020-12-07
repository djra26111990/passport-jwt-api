'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

require('dotenv/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var User = require('../models/user.model');


var secretKey = process.env.SECRET_AUTH_KEY;

var cookieExtractor = function cookieExtractor(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
};

_passport2.default.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secretKey
}, function (payload, done) {
    User.findById({ _id: payload.sub }, function (err, user) {
        if (err) return done(err, false);
        if (user) return done(null, user);else return done(null, false);
    });
}));

_passport2.default.use(new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        user.comparePassword(password, done);
    });
}));