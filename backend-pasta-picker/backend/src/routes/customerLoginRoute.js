import express from 'express'
import customer_model from '../models/customerModel.js';
import hashedPassword from '../utils/hashPassword.js';
import bcrypt from 'bcrypt'

const comparePassword = (inputPassword, hashedPassword) => {
    return bcrypt.compareSync(inputPassword, hashedPassword)
}

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const {username, password } = req.body;
        // Find user profile by email
        const userProfile = await customer_model.findOne({ username });

        // Check if user is not found
        if (!userProfile) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        // Compare the password from request body with the hashed password in database
        const isPasswordValid = comparePassword(password, userProfile.password);

        console.log(isPasswordValid)

        // If password does not match
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        // If login is successful
        return res.status(200).json({
            message: 'Successfully logged in',
        });

    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: 'bad request'
      })
    }
  })


export default router