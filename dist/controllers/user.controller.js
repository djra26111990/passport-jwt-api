'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.githubAuth = exports.authStatus = exports.adminSection = exports.getTodos = exports.createTodo = exports.logoutUser = exports.logoutUsers = exports.loginUser = exports.createUser = undefined;

var _user = require('../handlers/user.handlers');

var opUsers = new _user.repository();

var createUser = exports.createUser = function createUser(req, res) {
    return opUsers.createUsers(req, res);
};

var loginUser = exports.loginUser = function loginUser(req, res) {
    return opUsers.loginUsers(req, res);
};

var logoutUsers = exports.logoutUsers = function logoutUsers(req, res) {
    return opUsers.logoutUsers(req, res);
};

var logoutUser = exports.logoutUser = function logoutUser(req, res) {
    return opUsers.logoutUsers(req, res);
};

var createTodo = exports.createTodo = function createTodo(req, res) {
    return opUsers.createTodo(req, res);
};

var getTodos = exports.getTodos = function getTodos(req, res) {
    return opUsers.getTodos(req, res);
};

var adminSection = exports.adminSection = function adminSection(req, res) {
    return opUsers.adminSection(req, res);
};

var authStatus = exports.authStatus = function authStatus(req, res) {
    return opUsers.authenticated(req, res);
};

var githubAuth = exports.githubAuth = function githubAuth(req, res, next) {
    return opUsers.githubAuth(req, res, next);
};