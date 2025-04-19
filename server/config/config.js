require('dotenv').config(); 

module.exports = {
  database: process.env.MONGO_URI || 'mongodb+srv://HUSSLEX:mydb@cluster0.fg5db.mongodb.net/anyuakonline?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET|| 'H8g!kL2@pT9#zVq3$wXy7^jF6*eB1&nR4', 
  port: process.env.PORT || 5000,
};