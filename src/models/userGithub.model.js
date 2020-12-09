import mongoose from 'mongoose'

const UserGithubSchema = new mongoose.Schema({
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


const UserGithub = mongoose.model('UserGithub', UserGithubSchema, 'UsersGithub');
module.exports = UserGithub