import express from 'express'
import customer_model from '../models/customerModel.js';
import hashedPassword from '../utils/hashPassword.js';
import bcrypt from 'bcrypt'
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import { authProtectRoute } from '../middlewares/authProtect.js';

const comparePassword = (inputPassword, hashedPassword) => {
    return bcrypt.compareSync(inputPassword, hashedPassword)
}

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const {username, password } = req.body;
        // Find user profile by email
        const customerProfile = await customer_model.findOne({ username });

        // Check if user is not found
        if (!customerProfile) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        // Compare the password from request body with the hashed password in database
        const isPasswordValid = comparePassword(password, customerProfile.password);
        // If password does not match
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        //check if account is deleted or not
        if (!customerProfile.status) {
            return res.status(403).json({
                message: 'This account is disabled. Please contact support.',
            });
        }

        // If login is successful
        generateTokenAndSetCookie(customerProfile._id, 'customer', res); //generate token
        return res.status(200).json({
            message: 'Successfully logged in',
            data: {
                userID: customerProfile.id,
                username: customerProfile.username,
                email: customerProfile.email,
                address: customerProfile.address,
                contact: customerProfile.contact
            },
        });

    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: 'bad request'
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

  // Get current user profile - requires authentication
  router.get('/me', authProtectRoute, async (req, res) => { // Use authProtectRoute middleware
    try {
        const customer = await customer_model.findById(req.customer._id).select("-password")
        res.status(200).json({customer})
    } catch (error) {
        console.log(error)
      res.status(400).json({message: 'bad request'})
    }
  })

export default router