'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./routes/user.route');

var _user2 = _interopRequireDefault(_user);

require('dotenv/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use((0, _cookieParser2.default)());
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({
    extended: false
}));

var URI = process.env.MONGO_URI;
var PORT = process.env.PORT || 5000;

_mongoose2.default.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function () {
    console.log('Sucessfully connected to Database!');
});

app.use('/user', _user2.default);

app.listen(PORT, function () {
    console.log('\uD83D\uDE80 Server is started at port: ' + PORT);
});