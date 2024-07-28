import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
const protect=asyncHandler(async(req,res,next)=>{

let token
token=req.cookies.jwt
console.log("hello",token);

if(token){
  console.log("entering");
  try {
    const decoded=jwt.verify(token,process.env.JWT_SECERT)
    console.log("gii",decoded);
    req.user=await User.findById(decoded.userId).select('-password')
    console.log(req.user);
    next()
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
export {protect}