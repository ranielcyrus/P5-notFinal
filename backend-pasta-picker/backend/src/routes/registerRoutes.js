import express from 'express'
import customer_model from '../models/customerModel.js';
import hashedPassword from '../utils/hashPassword.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const {username, email, password, address, contact} = req.body;

      //check for email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        return res.status(400).json({ message: 'error: invalid email format!'})
      }

      //check if username is already taken
      const existingUser = await customer_model.findOne({username})
      if(existingUser){
        return res.status(400).json({ message: 'error: username is already taken!'})
      }

      //check if password is < 8 characters
      if(password.length < 8) {
        return res.status(400).json({message: 'error: password must be at least 8 characters'})
      }

      //check if email is already taken
      const existingEmail = await customer_model.findOne({email})
      if(existingEmail){
        return res.status(400).json({ message: 'error: Email is already in used!'})
      }

      //check for contact format
      const contactRegex = /^[0-9]*$/;
      if(!contactRegex.test(contact)){
        return res.status(400).json({message: 'error: invalid contact!'})
      }

      //hashing the password
      const newCustomer = customer_model({
        username, 
        email,
        password: hashedPassword(password),
        address,
        contact,
        status: true
      })  

      // Save the new customer and generate the token
      await newCustomer.save();
      generateTokenAndSetCookie(newCustomer._id, 'customer', res); // Pass userType as 'customer'

      res.status(201).json({
          message: 'New Customer profile is successfully created',
          data: {
              userID: newCustomer._id, // Corrected this line
              username: newCustomer.username,
              email: newCustomer.email,
              address: newCustomer.address,
              contact: newCustomer.contact
          },
      });
      
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'bad request'
      })
    }
  })

export default router