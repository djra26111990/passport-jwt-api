'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _userGithub = require('../models/userGithub.model');

var _userGithub2 = _interopRequireDefault(_userGithub);

require('dotenv/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var GithubStrategy = require('passport-github').Strategy;


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
    _user2.default.findById({ _id: payload.sub }, function (err, user) {
        if (err) return done(err, false);
        if (user) return done(null, user);else return done(null, false);
    });
}));

_passport2.default.use(new LocalStrategy(function (username, password, done) {
    _user2.default.findOne({ username: username }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        user.comparePassword(password, done);
    });
}));

_passport2.default.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/user/auth/github/callback"
}, function (accessToken, refreshToken, profile, cb) {
    _userGithub2.default.findOne({
        profileId: profile.id
    }).lean().exec(function (err, user) {
        if (err) {
            return cb(err, null);
        }
        if (user) {
            return cb(null, user);
        }

        var newUser = new _userGithub2.default({
            profileId: profile.id,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
            username: profile.username,
            accessToken: accessToken,
            refreshToken: refreshToken,
            provider: profile.provider || 'github',
            role: 'user'
        });

        newUser.save(function (error, inserted) {
            if (error) {
                return cb(error, null);
            }

            return cb(null, inserted);
        });
    });
}));