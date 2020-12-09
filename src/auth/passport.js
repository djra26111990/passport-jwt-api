import passport from 'passport'
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const GithubStrategy = require('passport-github').Strategy;
import User  from '../models/user.model';
import UserGithub from '../models/userGithub.model'
import {} from 'dotenv/config'

const secretKey = process.env.SECRET_AUTH_KEY;

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
}

passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secretKey
}, (payload, done)=> {
    User.findById({ _id : payload.sub }, (err, user) => {
        if(err)
            return done(err, false);
        if(user)
            return done(null, user);
        else 
            return done(null, false);
    });
}));

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if(err)
            return done(err);
        if(!user)
            return done(null, false);
        user.comparePassword(password, done);
    });
}));

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/user/auth/github/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
    UserGithub.findOne({
            profileId: profile.id
        }).lean().exec((err, user) => {
            if (err) {
                return cb(err, null);
            }
            if (user) {
                return cb(null, user);
            }

            let newUser = new UserGithub({
                profileId: profile.id,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                username: profile.username,
                accessToken: accessToken,
                refreshToken: refreshToken,
                provider: profile.provider || 'github',
                role: 'user'
            });

            newUser.save((error, inserted) => {
                if (error) {
                    return cb(error, null);
                }

                return cb(null, inserted);
            });
        });
  }
));
