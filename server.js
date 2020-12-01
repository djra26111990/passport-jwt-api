const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

const URI = process.env.MONGO_URI;
const PORT = process.env.PORT  || 5000;

 mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
    console.log('Sucessfully connected to Database!')
 })

const userRouter = require('./routes/user.route');
app.use('/user', userRouter);

 app.listen(PORT, () => {
     console.log(`🚀 Server is started at port: ${PORT}`)
 })
