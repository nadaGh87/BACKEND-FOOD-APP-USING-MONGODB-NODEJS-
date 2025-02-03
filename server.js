const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

// dotenv config
dotenv.config();
//db connection
connectDB();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use('/api/v1/test', require('./routes/testRoutes'));
app.use('/api/v1/auth',require('./routes/authRoutes'));
app.use('/api/v1/user',require('./routes/UserRoutes'));
app.use('/api/v1/restaurant',require('./routes/RestaurantRoutes'));
app.use('/api/v1/order', require('./routes/OrderRoutes'));


// Base route
app.get("/", (_req, res) => {
    return res.status(200).send("<h1> Welcome to Food Server APP API BASE PROJECT </h1>");
});

// Port
const PORT = process.env.PORT || 5000;

// Listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.white.bgMagenta);
});
console.log(process.env.MONGO_URI); 