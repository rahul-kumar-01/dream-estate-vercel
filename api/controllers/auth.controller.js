import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import  jwt  from 'jsonwebtoken';
import { set } from 'mongoose';


export const signup = async (req,res,next) =>{
    const {username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);       //hash sync(means it's awiat) 10 is salt 
    const newUser = new User({username,email,password:hashedPassword});
    try{
        await newUser.save();
        return res.status(201).json("User created succesfully");    
    }
    // Intially 
    // catch(err){
    //     return res.status(500).json(err.message);
    // }
    //After adding middleware
    catch(err){
        next(err);
        // next(errorHandler(500,'error from function')); // we created  this err used when password mistach by using upper line it's not error  
    }
}

export const signin = async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'User not found'));
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Invalid credential'));
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET );
        console.log(token);
        console.log(process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc;
        
        return res.cookie('access_token', token, {
            httpOnly: false,
            secure: true, 
            domain: 'dream-estate-vercel-api.vercel.app',
            sameSite : 'none',
          }).status(200).json({ token, rest });  

          
    }catch(err){
        next(err);
    }
}

export const google = async (req,res,next) => {
    try{
        
        const user = await User.findOne({email: req.body.email});
        if(user){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password:pass, ...rest} = user._doc;
            console.log(rest);
            res
            .cookie('access_token',token,{
                httpOnly: false,
                secure: true, 
                domain: 'dream-estate-vercel-api.vercel.app',
                sameSite : 'none',                      
            }
            )
            .status(200)
            .json(rest);
        }
        else{
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);  //0.89374hihfe
            const hashedPassword = bcryptjs.hashSync(generatePassword,10);
            const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8) ,
                 email: req.body.email, password: hashedPassword, avatar: req.body.photo});

            await newUser.save();
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:pass, ...rest} = newUser._doc;
            res
            .cookie('access_token',token,{
                httpOnly: false,
                secure: true, 
                domain: 'dream-estate-vercel-api.vercel.app',
                sameSite : 'none',                      
            }
            )
            .status(200)
            .json(rest);
        }
    }catch(error){
        next(error);
    }
}

export const signout = async (req,res,next) => {
    try{
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    }catch(error){
        next(error);
    }
}