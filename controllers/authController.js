import { hashPassword } from "../helper/authHelper.js";
import userModel from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import { comparePassword } from "../helper/authHelper.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validation
    if (!email || !name || !address || !phone || !password || !answer) {
      return res
        .status(400)
        .json({ error: "Please provide all required information." });
    }

    // Existing user check
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists. Please login." });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create and save the new user
    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role:user.role
    });

    await user.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found. Please register." });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    //tokennnn

    const token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        id:user._id,
        email: user.email,
        role: user.role,
        phone:user.phone,
        address:user.address
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "invalid email or password" });
  }
};

// forgeeeeeet password

// export const forgetPasswordController = async (req, res) => {
//   try {
//     const {email, answer, newPasswword} =req.body

//     if (!email) {
//       res.status(400).json({message:"please provide your email"})
//     }
//     if (!answer) {
//       res.status(400).json({message:"please provide your answer"})
//     }   if (!newPasswword) {
//       res.status(400).json({message:"please provide your new password"})
//     }

//     // check is email and ans is correct

//     const user=await userModel.findOne({email, answer})

//     // check user

//     if (!user) {
//       res.status(404).json({message:"wrong email or password"})
//     }

//     const hashed = await hashPassword(newPasswword)
//     await userModel.findByIdAndUpdate(user._id, {password:hashed})
//     res.status(200).json({success:true, message:"password changed"})

    
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ success: false, error: "something went wrong", error });
//   }
// };

// export const testController = (req, res) => {
//   return res.status(200).json({
//     message: "Testing the api",
//   });
// };


export const updateProfileController=async(req, res)=>{
  try {
    const {name, email,password,address,phone} = req.body
    const user = await userModel.findById(req.user._id)
    if (password && password.length < 6) {
      return res.json({error:"password is required of 8 or more characters"})
    }
    const hashedPassword=password? await hashPassword(password) : undefined
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
      name: name || user.name,
      password: hashedPassword||user.password,
      phone:phone || user.phone,
      address:address|| user.address

    }, {new:true})

    res.status(200).json({
      success:true,
      message:"profile updated successfully",
      updatedUser
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success:false,
      message:"failure in updating profile",
      error
    })
  }
}
