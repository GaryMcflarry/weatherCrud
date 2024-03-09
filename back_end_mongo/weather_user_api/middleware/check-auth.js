const jwt = require('jsonwebtoken');

//checkAuth is a middle ware that will check the token that cs=ertian routes recieve to see if they are up to date
//Key: authorization
//Value: Bearer {{token}}
module.exports = (req, res, next) => {
    try {
        // Check if the Authorization header exists
        if (!req.headers.authorization) {
            throw new Error('Authorization header missing');
        }

        // Obtaining the token from headers
        const token = req.headers.authorization.split(" ")[1];
        // Verifying if the token is the same with the one in the environment
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        // Error handling: log the error and send response
        console.error('Error in authentication:', error);
        return res.status(400).json({
            message: 'Auth Failed',
            error: error.message // Sending only the error message for security reasons
        });
    }
};