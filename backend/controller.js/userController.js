import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken';
import {getDownloadURL,ref,uploadBytes} from  'firebase/storage'



const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(password);
    const user = await User.findOne({ email: email });
    
    if (user && (await user.matchPassword(password))) {
      console.log(user);
      const userId = user._id;
      const token = jwt.sign({ userId }, process.env.JWT_SECERT, {
        expiresIn: '30d',
      });
      console.log(token);
      res.cookie('jwt',token,{
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: false // Add this flag if using HTTPS
      }).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        url:user.url,
        token:token
      });
    } else {
      console.log("Invalid email or password");
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Invalid email or password' });
  }
});
const registerUser=asyncHandler(async(req,res)=>{
  const {name,email,password,url}=req.body
  console.log(url);

  const userExists=await User.findOne({email})
  if(userExists){
    res.status(400)
    throw new Error('user already exists')
  }
  const user =await User.create({
    name,
    email,
    password,
    url
  })
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    url: user.url
    // You can include any other user data you want to send in the response
  });
})
const logoutUser=asyncHandler(async(req,res)=>{
  res.cookie('jwt','',{
    httpOnly:true,
    expires:new Date(0)
  })
  res.status(200).json({message:'user logged out'})
})
const getUserProfile=asyncHandler(async(req,res)=>{
  const user={
    _id:req.user._id,
    name:req.user.name,
    email:req.user.email,
    url:req.user.url
  }
  res.status(200).json(user)
})
const updateUserProfile=asyncHandler(async(req,res)=>{
  const user=await User.findById(req.user._id)
  console.log("hey",user);
  if(user){
    user.name=req.body.name || user.name;
    user.email=req.body.email || user.email
    user.url=req.body.url || user.url
    console.log(req.body.name);
    console.log(req.body.url);
    if(req.body.password){
      user.password=req.body.password
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
})
async function uploadImage(image){
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      throw new Error("User not authenticated");
    }
    const imageRef=ref(storage,`images/${image.name}`)
    await uploadBytes(imageRef,image)
    const url=await getDownloadURL(imageRef)
    return url
    
  } catch (error) {
    console.log(error);
  }
}




export{ 
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
}