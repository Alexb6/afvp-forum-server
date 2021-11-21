const cors = require('cors');

const corsOptions = {
   origin: [
      'http://localhost:3000',
      'http://www.afvp.net',
      'https://www.afvp.net/',
      'http://www.dev.afvp.net/',
      'https://www.dev.afvp.net/'
   ], // '*' or use an [] to specify multiple & specific origins
   credentials: true,
   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = cors(corsOptions);