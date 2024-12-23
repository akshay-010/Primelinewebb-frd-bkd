const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key


// Hardcoded admin credentials
const hardcodedAdminUsername = "admin";
const hardcodedAdminPassword = "admin@123";
//Admin Login
const adminLogin = async (req, res) => {
    try {
        const { adminUsername, adminPassword } = req.body;

        // Compare provided credentials with hardcoded ones
        if (adminUsername === hardcodedAdminUsername && adminPassword === hardcodedAdminPassword) {
            // Create a JWT token
            const token = jwt.sign({ username: hardcodedAdminUsername }, secretKey, {
                expiresIn: '1h', // Token expiry time
            });

            // Return success response with token and user info
            return res.json({
                message: 'Login successful',
                success: true,
                token,
                username: hardcodedAdminUsername,
            });
        } else {
            // Invalid credentials
            return res.json({ message: 'Invalid username or password', success: false });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        return res.status(500).json({ message: 'An error occurred', success: false });
    }
};



module.exports = {
    adminLogin,
};
