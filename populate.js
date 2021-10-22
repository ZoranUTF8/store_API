// add data from json to our db
require('dotenv').config()

const connectDB = require("./db/connectDB");
const ProductModel = require("./models/product");
const jsonProducts = require("./products.json");


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        //delete all products in dv
        await ProductModel.deleteMany();
        // add products to db
        await ProductModel.create(jsonProducts)
        console.log("server populated");
        process.exit(0);

    } catch (err) {
        console.log(err)
        process.exit(1);
    }
}

start();