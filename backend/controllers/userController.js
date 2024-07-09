import userModal from "../models/userModals.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//login user

const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {

        const user = await userModal.findOne({email})

        if(!user){
            res.json({success:false, message: "user doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            res.json({success:false, message: "invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: "error logging in"})
    }
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

//register user 

const registerUser = async (req,res) => {
    const {name,email,password}=req.body
    try {

        //checking if user exists
        const exists = await userModal.findOne({email})
        if(exists) {
            return res.json({success: false, message:"user already exists"})
        }

        //validating email and password
        if(!validator.isEmail(email)){
            return res.json({success: false, message:"invalid email"})
        }
        if(password.length<8){
            return res.json({success: false, message:"enter a strong password"})
        }
        
        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModal({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:"error in creating user"})
    }

}

export {loginUser, registerUser}