const jwt = require('jsonwebtoken');
const Admin = require("../model/admin");
const User = require("../model/usermodel");
require('dotenv').config();



const authenticate = (req, res, next) => {
    if (req.session.user) {
        // User is authenticated
        return next();
    }
    // User is not authenticated
    res.redirect('/login'); // Redirect to login page or send an appropriate response
};


const adminAuth = async (req, res, next) => {
    try {
        // Get the token from the header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Adain");

        // Find the admin by ID
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ message: 'Access denied' });
        }

        // Attach admin to the request object
        req.admin = admin;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token', error: err.message });
    }
};

module.exports = {authenticate, adminAuth};
