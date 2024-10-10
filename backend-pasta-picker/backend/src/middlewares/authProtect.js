import customer_model from "../models/customerModel.js";
import user_model from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const authProtectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        // Check if no token is provided
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        // Determine user type (customer or user)
        const { userType } = decode; // Assuming the token contains a userType field
        let user;

        if (userType === 'customer') {
            user = await customer_model.findById(decode.userID).select("-password");
            if (!user) {
                return res.status(404).json({ error: "Customer not found" });
            }
            req.customer = user;
        } else if (userType === 'user') {
            user = await user_model.findById(decode.userID).select("-password");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            req.user = user;
        } else {
            return res.status(400).json({ error: "Unauthorized: Invalid user type" });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Bad request' });
    }
};