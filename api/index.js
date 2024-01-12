import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

dotenv.config();



mongoose.connect(process.env.MONGO)
    .then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.log(err);
    });

    const __dirname = path.resolve();


const app = express();

  
app.use(cors({
    origin: 'https://dream-estate-vercel.vercel.app',
    credentials: true,
  }));
  
  // Set additional headers
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'https://dream-estate-vercel.vercel.app'); // Adjust this to your client domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });



app.use(express.json()); // allow json as input to the server (req)
app.use(cookieParser());



app.listen(3000,()=>{
    console.log('Server is running');
})




app.get('/test',(req,res)=>{
    return res.send('hello world');
})

//api routes

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);

//listing router

app.use('/api/listing',listingRouter);



app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})



//error middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode : statusCode,
        message,
    });
})