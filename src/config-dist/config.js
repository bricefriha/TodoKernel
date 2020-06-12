//config/Config.js

// to connect to the database
module.exports = {
    DB: process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/todokernel',
    APP_PORT: process.env.APP_PORT ? process.env.APP_PORT : 80,
    Secret: process.env.SECRET ? process.env.SECRET : "[put your secret here]",
    serviceEmail: process.env.SERVICE_EMAIL ? process.env.SERVICE_EMAIL : "[Your email sevice (gmail, outlook, however...)]",
  Email: process.env.EMAIL ? process.env.EMAIL : "[Your email adress]",
  PasswordEmail: process.env.PWD_EMAIL ? process.env.PWD_EMAIL : "[Password of your email account]",
  };
