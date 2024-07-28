import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import dotenv from 'dotenv';

dotenv.config();
const AdminProtect=asyncHandler(async(req,res,next)=>{


const token= req.cookies.jwts;
console.log("hello",token);

if(token){
  console.log("entering");
  try {
    const decoded=jwt.verify(token,process.env.JWT_SECERT)
    console.log("gii",decoded);
    if(decoded.adminId===process.env.ADMIN_EMAIL){
      console.log("heytvrrrrrrr");
       next()
    }else{

      throw new Error('Not authorized, invalid token')

    }
    
   
  } catch (error) {
    console.log("got error");
    res.status(401)
    throw new Error('Not authorized, invalid token')
    
  }

}else{
  res.status(401)
  throw new Error('Not authorized, no token')
}
})
export {AdminProtect}