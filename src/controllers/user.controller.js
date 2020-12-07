import { repository } from '../handlers/user.handlers'

const opUsers = new repository();


export const createUser = (req, res) => {
    return opUsers.createUsers(req, res);
}

export const loginUser = (req, res) => {
    return opUsers.loginUsers(req, res);
}

export const logoutUsers = (req, res) => {
    return opUsers.logoutUsers(req, res);
}

export const logoutUser = (req, res) => {
    return opUsers.logoutUsers(req, res);
}

export const createTodo = (req, res) => {
    return opUsers.createTodo(req, res);
}

export const getTodos = (req, res) => {
    return opUsers.getTodos(req, res);
}

export const adminSection = (req, res) => {
    return opUsers.adminSection(req, res);
}

export const authStatus = (req, res) => {
    return opUsers.authenticated(req, res);
}
