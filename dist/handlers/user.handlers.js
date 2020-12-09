'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('dotenv/config');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _todo = require('../models/todo.model');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var issuer = process.env.ISSUER;
var secretKey = process.env.SECRET_AUTH_KEY;

var signToken = function signToken(userID) {
  return _jsonwebtoken2.default.sign({
    iss: issuer,
    sub: userID
  }, secretKey, { expiresIn: '1h' });
};

var repository = exports.repository = function () {
  function repository() {
    _classCallCheck(this, repository);
  }

  _createClass(repository, [{
    key: 'createUsers',
    value: function createUsers(req, res) {
      var _req$body = req.body,
          username = _req$body.username,
          password = _req$body.password,
          role = _req$body.role;

      _user2.default.findOne({ username: username }, function (err, user) {
        if (err) res.status(500).json({
          message: {
            msgBody: 'Error has ocurred',
            msgError: true
          }
        });
        if (user) res.status(400).json({
          message: {
            msgBody: 'Username is already taken',
            msgError: true
          }
        });else {
          var newUser = new _user2.default({ username: username, password: password, role: role });
          newUser.save(function (err) {
            if (err) res.status(500).json({
              message: {
                msgBody: 'Error has ocurred',
                msgError: true
              }
            });else res.status(201).json({
              message: {
                msgBody: 'Account sucessfully created',
                msgError: false
              }
            });
          });
        }
      });
    }
  }, {
    key: 'loginUsers',
    value: function loginUsers(req, res) {
      if (req.isAuthenticated()) {
        var _req$user = req.user,
            _id = _req$user._id,
            username = _req$user.username,
            role = _req$user.role;

        var token = signToken(_id);
        res.cookie('access_token', token, {
          httpOnly: true,
          sameSite: true
        });
        res.status(200).json({
          isAuthenticated: true,
          user: {
            username: username,
            role: role
          }
        });
      }
    }
  }, {
    key: 'logoutUsers',
    value: function logoutUsers(req, res) {
      res.clearCookie('access_token');
      req.logout();
      req.session = null;
      res.json({ user: { username: '', role: '' }, success: true });
    }
  }, {
    key: 'createTodo',
    value: function createTodo(req, res) {
      var todo = new _todo2.default(req.body);
      todo.save(function (err) {
        if (err) res.status(500).json({
          message: {
            msgBody: 'Error has ocurred',
            msgError: true
          }
        });else {
          req.user.todos.push(todo);
          req.user.save(function (err) {
            if (err) res.status(500).json({
              message: {
                msgBody: 'Error has ocurred',
                msgError: true
              }
            });else res.status(200).json({
              message: {
                msgBody: 'Successfully created Todo',
                msgError: false
              }
            });
          });
        }
      });
    }
  }, {
    key: 'getTodos',
    value: function getTodos(req, res) {
      _user2.default.findById({ _id: req.user._id }).populate('todos').exec(function (err, document) {
        if (err) res.status(500).json({
          message: {
            msgBody: 'Error has ocurred',
            msgError: true
          }
        });else {
          res.status(200).json({ todos: document.todos, authenticated: true });
        }
      });
    }
  }, {
    key: 'adminSection',
    value: function adminSection(req, res) {
      if (req.user.role === 'admin') {
        res.status(200).json({ message: { msgBody: 'You are an admin', msgError: false } });
      } else {
        res.status(403).json({
          message: {
            msgBody: 'You are not an admin, go away',
            msgError: true
          }
        });
      }
    }
  }, {
    key: 'authenticated',
    value: function authenticated(req, res) {
      var _req$user2 = req.user,
          username = _req$user2.username,
          role = _req$user2.role;

      res.status(200).json({ isAuthenticated: true, user: { username: username, role: role } });
    }
  }, {
    key: 'githubAuth',
    value: function githubAuth(req, res, next) {
      (function (error, user, info) {
        if (error) {
          var statusCode = error.statusCode || 500;
          return res.status(statusCode).json(error);
        }
        req.login(user, function (error) {
          if (error) {
            var _statusCode = error.statusCode || 500;
            return res.status(_statusCode).json(error);
          }
          return res.redirect('/todos');
        });
      });
      req, res, next;
    }
  }]);

  return repository;
}();