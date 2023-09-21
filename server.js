const express = require("express");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

connectDb(); // database

const app = express(); // makes my app expressible

dotenv.config(); // Load environment variables from .env

const port = process.env.PORT || 5000;

// express middleware for request json
app.use(express.json());

// add the request
app.use('/api/contacts', require("./routes/contactRoutes")) 

// add the request
app.use('/api/users', require("./routes/userRoutes")) 


// my middle ware for response json
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

