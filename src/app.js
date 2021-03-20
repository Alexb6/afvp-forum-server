const express = require('express');
const morgan = require('morgan');

/* Adding all express methods into the app */
const app = express();
/* ------------------------------------------
Middlewares
------------------------------------------ */
/* Request logger for node */
app.use(morgan('dev'));
/* Body parser, exposing the request's data into the req.body */
app.use(express.json({ limit: '10kb' }));
/* URL Encoded, parsing data obj w nested obj */
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
/* Add headers to the res to prevent CORS errors while accessing the API */
app.use((res, req, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
   if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      return res.status(200).json({});
   }
   next();
});

module.exports = app;