'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = 10;

var UserSchema = new _mongoose2.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 6,
        max: 15
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    todos: [{
        type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Todo'
    }]
});

UserSchema.pre('save', function (next) {
    var _this = this;

    if (!this.isModified('password')) return next();
    _bcrypt2.default.hash(this.password, saltRounds, function (err, passwordhash) {
        if (err) return next(err);
        _this.password = passwordhash;
        next();
    });
});

UserSchema.methods.comparePassword = function (password, callback) {
    var _this2 = this;

    _bcrypt2.default.compare(password, this.password, function (err, isMatch) {
        if (err) return callback(err);else {
            if (!isMatch) return callback(null, isMatch);
            return callback(null, _this2);
        }
    });
};

module.exports = _mongoose2.default.model('User', UserSchema);