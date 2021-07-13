const cors = require('cors');

const corsOptions = {
   origin: ['http://localhost:3000', 'http://www.afvp.net'], // '*' or use an [] to specify multiple & specific origins
   credentials: true,
   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = cors(corsOptions);