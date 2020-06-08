//config/Config.js

// to connect to the database
module.exports = {
    DB: process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/todoKernel',
    APP_PORT: process.env.APP_PORT ? process.env.APP_PORT : 80,
    Secret: process.env.SECRET ? process.env.SECRET : "[put your secret here]",
  };
