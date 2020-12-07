import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import userRouter from './src/routes/user.route'
import {} from 'dotenv/config'
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

const URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

 mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
    console.log('Sucessfully connected to Database!')
 })


app.use('/user', userRouter);

 app.listen(PORT, () => {
     console.log(`🚀 Server is started at port: ${PORT}`)
 })
