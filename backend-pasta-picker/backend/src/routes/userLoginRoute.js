import express from 'express'
import user_model from '../models/userModel.js';
import { authProtectRoute } from '../middlewares/authProtect.js'
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import bcrypt from 'bcrypt'


const comparePassword = (inputPassword, hashedPassword) => {
    return bcrypt.compareSync(inputPassword, hashedPassword)
}

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const {username, password } = req.body;
        // Find user profile by username
        const userProfile = await user_model.findOne({ username });

        // Check if user is not found
        if (!userProfile) {
            return res.status(400).json({
                message: 'Invalid username or password',
            });
        }

        // Compare the password from request body with the hashed password in database
        const isPasswordValid = comparePassword(password, userProfile.password);
        // If password does not match
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        //check if account is deleted or not
        if (!userProfile.status) {
            return res.status(403).json({
                message: 'This account is disabled. Please contact support.',
            });
        }

        // If login is successful
        generateTokenAndSetCookie(userProfile._id, 'user', res);
        return res.status(200).json({
            message: 'Successfully logged in',
            data: {
                userID: userProfile.id,
                username: userProfile.username,
                role: userProfile.role,
            },
        });

    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: `bad request ${error}` 
      })
    }
})

//logout
router.post('/logout', async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'bad request'})
    }
})

//make sure the account is correct and also have middleware for verifying token
router.get('/me', authProtectRoute, async (req, res) => {
    try {
        const user = await user_model.findById(req.user._id).select("-password")
        res.status(200).json({user})
    } catch (error) {
        console.log(error)
      res.status(400).json({message: 'bad request'})
    }
})


export default router
