const express = require('express');
app = express();
require('dotenv').config();
// ASYNC ERRORS
require("express-async-errors");
///////////////

// CUSTOM FUNCTIONS
const connectDB = require("./db/connectDB");
//////////////


// MIDDLEWARE IMPORT
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
const notFound = require("./middleware/notFound");
/////////////////

// NATIVE MIDDLEWARE USE
app.use(express.json()); // parse JSON
/////////////////
// Router import
const productsRouter = require("./routes/products");
///////////////



// ROUTES
app.get("/", (req, res) => {
    res.send(`<h1>Store API</h1> <a href="/api/v1/products">products route</a>`);
})

app.use("/api/v1/products",productsRouter)

// CUSTOM MIDDLEWARE
app.use(notFound);
app.use(errorHandlerMiddleware);

// START UP SERVER AND DB CONNECTION
// 
const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`SERVER ON: ${port}`))
    } catch (err) {
        console.log(`ERROR => ${err}`)
    }
}
start();