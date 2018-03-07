const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


mongoose.connect(
    'mongodb://DarcyDeAngelo:' + process.env.MONGO_ATLAS_PW + '@node-api-shop-shard-00-00-28ayr.mongodb.net:27017,node-api-shop-shard-00-01-28ayr.mongodb.net:27017,node-api-shop-shard-00-02-28ayr.mongodb.net:27017/test?ssl=true&replicaSet=node-api-shop-shard-0&authSource=admin'
);

mongoose.Promise = global.Promise;


app.use(morgan('dev'));
//making our uploads file accessable
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

//if neighter of the above gets used, then we will have an error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

//handle your errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//app.use((req, res, next) => {
//    res.status(200).json({
//        message: 'It works!'
//    });
//})

module.exports = app;