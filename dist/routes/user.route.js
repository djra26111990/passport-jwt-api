'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passport3 = require('../auth/passport');

var _passport4 = _interopRequireDefault(_passport3);

var _user = require('../controllers/user.controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRouter = _express2.default.Router();

userRouter.post('/register', _user.createUser);

userRouter.post('/login', _passport2.default.authenticate('local', { session: false }), _user.loginUser);

userRouter.get('/logout', _passport2.default.authenticate('jwt', { session: false }), _user.logoutUsers);

userRouter.post('/todo', _passport2.default.authenticate('jwt', { session: false }), _user.createTodo);

userRouter.get('/todos', _passport2.default.authenticate('jwt', { session: false }), _user.getTodos);

userRouter.get('/admin', _passport2.default.authenticate('jwt', { session: false }), _user.adminSection);

userRouter.get('/authenticated', _passport2.default.authenticate('jwt', { session: false }), _user.authStatus);

userRouter.get('/auth/github', _passport2.default.authenticate('github'));

userRouter.get('/auth/github/callback', _user.githubAuth);

module.exports = userRouter;