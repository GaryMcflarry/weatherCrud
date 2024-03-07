const jwt = require('jsonwebtoken');

//checkAuth is a middle ware that will check the token that cs=ertian routes recieve to see if they are up to date
//Key: authorization
//Value: Bearer {{token}}
module.exports = (req, res, next) => {
    try {
        //obtaining the token from headers
        const token = req.headers.authorization.split(" ")[1];
        //verifying if the token is the same with the one in the enviroment
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded
        next();
    } catch (error) {
        //error code
        return res.status(400).json({
            message: 'Auth Failed',
            error
        })
    }
    
};