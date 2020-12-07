import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId, ref: 'Todo'
    }]
});

UserSchema.pre('save', function(next) {
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, saltRounds, (err, passwordhash) => {
        if(err)
            return next(err);
        this.password = passwordhash;
        next();
    });
})

UserSchema.methods.comparePassword = function(password, callback){
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err)
            return callback(err);
        else { 
            if(!isMatch)
                return callback(null, isMatch)
            return callback(null, this)
        }
    })
}

module.exports = mongoose.model('User', UserSchema)