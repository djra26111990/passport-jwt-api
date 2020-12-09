import express from 'express'
import passport from 'passport'
import passportConfig from '../auth/passport'
import { createUser, loginUser, logoutUsers, createTodo, getTodos, adminSection, authStatus, githubAuth } from '../controllers/user.controller';

const userRouter = express.Router()

userRouter.post('/register', createUser)

userRouter.post('/login', passport.authenticate('local', { session: false }), loginUser)

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), logoutUsers)

userRouter.post('/todo', passport.authenticate('jwt', { session: false }), createTodo)

userRouter.get('/todos', passport.authenticate('jwt', { session: false }), getTodos)

userRouter.get('/admin', passport.authenticate('jwt', { session: false }), adminSection)

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }),authStatus)

userRouter.get('/auth/github', passport.authenticate('github'));

userRouter.get('/auth/github/callback', githubAuth);


module.exports = userRouter