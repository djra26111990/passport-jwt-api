import {} from 'dotenv/config'
import JWT from 'jsonwebtoken'
import User from '../models/user.model'
import Todo from '../models/todo.model'


const issuer = process.env.ISSUER
const secretKey = process.env.SECRET_AUTH_KEY

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: issuer,
      sub: userID,
    },
    secretKey,
    { expiresIn: '1h' }
  )
}

export class repository {
  constructor() {}

  createUsers(req, res) {
    const { username, password, role } = req.body
    User.findOne({ username }, (err, user) => {
      if (err)
        res.status(500).json({
          message: {
            msgBody: 'Error has ocurred',
            msgError: true,
          },
        })
      if (user)
        res.status(400).json({
          message: {
            msgBody: 'Username is already taken',
            msgError: true,
          },
        })
      else {
        const newUser = new User({ username, password, role })
        newUser.save((err) => {
          if (err)
            res.status(500).json({
              message: {
                msgBody: 'Error has ocurred',
                msgError: true,
              },
            })
          else
            res.status(201).json({
              message: {
                msgBody: 'Account sucessfully created',
                msgError: false,
              },
            })
        })
      }
    })
  }

  loginUsers(req, res) {
    if (req.isAuthenticated()) {
      const { _id, username, role } = req.user
      const token = signToken(_id)
      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: true,
      })
      res.status(200).json({
        isAuthenticated: true,
        user: {
          username,
          role,
        },
      })
    }
  }

  logoutUsers(req, res) {
    res.clearCookie('access_token')
    res.json({ user: { username: '', role: '' }, success: true })
  }

  createTodo(req, res) {
    const todo = new Todo(req.body)
    todo.save((err) => {
      if (err)
        res.status(500).json({
          message: {
            msgBody: 'Error has ocurred',
            msgError: true,
          },
        })
      else {
        req.user.todos.push(todo)
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: {
                msgBody: 'Error has ocurred',
                msgError: true,
              },
            })
          else
            res.status(200).json({
              message: {
                msgBody: 'Successfully created Todo',
                msgError: false,
              },
            })
        })
      }
    })
  }

  getTodos(req, res) {
    User.findById({ _id: req.user._id })
      .populate('todos')
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: {
              msgBody: 'Error has ocurred',
              msgError: true,
            },
          })
        else {
          res.status(200).json({ todos: document.todos, authenticated: true })
        }
      })
  }

  adminSection(req, res) {
    if (req.user.role === 'admin') {
      res
        .status(200)
        .json({ message: { msgBody: 'You are an admin', msgError: false } })
    } else {
      res.status(403).json({
        message: {
          msgBody: 'You are not an admin, go away',
          msgError: true,
        },
      })
    }
  }

  authenticated(req, res) {
    const { username, role } = req.user
    res.status(200).json({ isAuthenticated: true, user: { username, role } })
  }
}
