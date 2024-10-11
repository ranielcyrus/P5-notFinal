import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userID, userType, res) => {
    const token = jwt.sign({ userID, userType }, process.env.JWT_SECRET, { expiresIn: '15d' });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // how long in ms
        secure: process.env.NODE_ENV !== "production",
        httpOnly: true, // Ensure the cookie is only accessible by the server
        sameSite: "None", // Allows cross-site cookies
    });
};