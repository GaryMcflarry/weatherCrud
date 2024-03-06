const express = require('express');
const app = express();
//Documenting Logs
const morgan = require('morgan');
//parsing ther request body
const bodyParser = require('body-parser')
//making a connection to the mongoDB
const mongoose = require('mongoose')

//include the routes
const userRoutes = require('./weather_user_api/routes/users')

//attempting to connect to the mongoDB
mongoose.set('strictQuery', true)
//127.0.0.1 = localhost
mongoose.connect(`mongodb://127.0.0.1:27017/weatherApp`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('strictQuery', true);

//making use of the morgan and body-parser dependencies
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//Enabling CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, HEAD, OPTIONS, POST, PUT, DELETE, PATCH"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"

    );
    next();
});

//add route handling
app.use('/users', userRoutes);

//middleware handling errors for when requests arent picked up by middleware
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})


//Handling normla errors, send back a Http error response
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

//Exporting the express app, making it available for the server to use
module.exports = app;