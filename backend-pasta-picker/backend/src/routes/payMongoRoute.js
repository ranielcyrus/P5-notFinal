import express from 'express'
import axios from 'axios';
import { payMongoSecretKey, payMongoApiUrl } from '../config/index.js';


const router = express.Router();

// Create Payment Link Route
router.post('/', async (req, res) => {
    const { amount, description } = req.body;

    try {
        const response = await axios.post(
            payMongoApiUrl,
            {
                data: {
                    attributes: {
                        amount, //use this key value pair to pass your payload from frontend
                        currency: 'PHP',
                        description,
                    },
                },
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${payMongoSecretKey}:`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        //link need to redirect
        const checkoutUrl = response.data.data.attributes.checkout_url;

        console.log(checkoutUrl)
        res.status(200).json(response.data);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create payment link' });
    }
    
});

export default router