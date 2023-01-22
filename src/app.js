const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/product')
.then(()=>{
  console.log("Database is connected!");
})
.catch((err)=>{
    console.log("A error has been occurred while connecting to database.");   
})

app.use('/api', api);

// app.use(middlewares.notFound);
// app.use(middlewares.errorHandler);

module.exports = app;
