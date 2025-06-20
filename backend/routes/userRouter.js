import express from "express"
import { loginUser, registerUser } from "../controllers/userController.js"
import { validateUserRegistration, validateUserLogin, authLimiter } from "../middleware/security.js"

const userRouter = express.Router()

userRouter.post("/register", authLimiter, validateUserRegistration, registerUser)
userRouter.post("/login", authLimiter, validateUserLogin, loginUser)

export default userRouter