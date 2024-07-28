import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken';
import {getDownloadURL,ref,uploadBytes} from  'firebase/storage'
import dotenv from 'dotenv';

dotenv.config();


const admin = {
  email:process.env.ADMIN_EMAIL,
  password:process.env.ADMIN_PASSWORD,
}

const authAdmin=async(req,res)=>{
  try {
    console.log(admin.email);
    const {email,password}=req.body
    console.log(admin.email);
    const isAdmin=email===admin.email&&password===admin.password 
    console.log(isAdmin);
    if(isAdmin){

    const token = jwt.sign({ adminId:"admin@gmail.com" }, process.env.JWT_SECERT, {
      expiresIn: '30d',
    });
    res.cookie('jwts',token,{
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: false // Add this flag if using HTTPS
    }).json({
    message:"admmin logged"
    });
  }
  else{
    return res.status(401).json({message:"Invalid email or password"}) 
  }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error' });
    
  }



}
const loadUsers=async(req,res)=>{
  try {
    const userDetails= await User.find()
    res.status(200).json(userDetails)
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"server error"})
    
  }

}
const adminProfileUpdate=async(req,res)=>{
  try {
    const userId=req.query._id
  
    console.log("hey boy",userId);
    const singleUser=await User.findOne({_id:userId})
    res.status(200).json(singleUser)
    console.log(singleUser);
  } catch (error) {
    console.log(error);
    
  }


}
const adminUpdate=async(req,res)=>{
  console.log("hdsnfjkbh");
 
  try {
    const {_id,name,email,password,url}=req.body
    const user=await User.findById(_id)
    console.log("hey",name);
    if(user){
      user.name=name || user.name;
      user.email=email || user.email
      user.url=url || user.url
      
      if(password){
        user.password=password
      }
  
      const updatedUser=await user.save()
      res.status(200).json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        url:updatedUser.url
  
      })
  
    }else{
      res.status(404)
      throw new Error('User not found')
    }
  
    
  } catch (error) {
    console.log(error);
    
  }
}
const deleteUser=async(req,res)=>{
  try {
    const _id=req.query._id
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
    
  } catch (error) {
    console.log(error);
  }
 
 

}
const AdminLogOut=asyncHandler(async(req,res)=>{
  res.cookie('jwts','',{
    httpOnly:true,
    expires:new Date(0)
  })
  res.status(200).json({message:'user logged out'})
})

export  { authAdmin,loadUsers,adminProfileUpdate,adminUpdate,deleteUser,AdminLogOut}
