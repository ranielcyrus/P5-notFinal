import express from 'express'
import user_model from '../models/userModel.js';
import hashedPassword from '../utils/hashPassword.js';
import { authProtectRoute } from '../middlewares/authProtect.js';

const router = express.Router();

// Apply authProtectRoute middleware to all routes or specific routes
router.use(authProtectRoute); // Apply middleware to all routes

//edit user
router.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const userDetailsToUpdate = req.body;
    try {
      const userProfile = await user_model.findOne({ _id: id });
  
      // Check if user is not found
      if (!userProfile) {
          return res.status(404).json({
              message: 'User not found',
          });
      }
  
      // Check if username is already existing
      if(userDetailsToUpdate.username) {
        const existingUser = await user_model.findOne({username: userDetailsToUpdate.username})
        if(existingUser){
          return res.status(400).json({ message: 'error: username is already taken!'})
        }
      }
  
      // Check if a new password is provided and hash it
      if (userDetailsToUpdate.password) {
        userDetailsToUpdate.password = hashedPassword(userDetailsToUpdate.password);
      }
  
      const updateSuccess = await user_model.findByIdAndUpdate(id, userDetailsToUpdate);
  
      if (updateSuccess) {
          res.status(200).json(updateSuccess);
      } else {
      res.status(404).json({ message: "update unsuccessful"});
      }
    } catch (error) {
      // Handle any other errors
      console.error(error);
      return res.status(500).json({
          message: 'Something went wrong',
      });
    }
  })

  router.patch('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
  
      const userProfile = await user_model.findOne({ _id: id });
  
      // Check if user is not found
      if (!userProfile) {
        return res.status(404).json({
            message: 'User not found',
        });
      }
  
      const user = await user_model.findByIdAndUpdate(id, {
  
        status: false
  
      }, {
          new: true
      })
      await user.save()
  
      res.status(200).json({"message": "user deleted!", data: user})
  
    } catch (error) {
      res.status(400).json(
        {
            "message": error.message
        })
    }
  })

export default router