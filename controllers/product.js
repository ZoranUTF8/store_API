// PRODUCTS CONTROLER

// import mongo db model
const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({}).select("name price").limit(2)



    res.status(200).json({
        products,
        hits: products.length
    })
}

const getAllProducts = async (req, res) => {
    const searchQuery = {};
    const {
        featured,
        company,
        name,
        sort,
        fields,
        numericFilters
    } = req.query;

    if (featured) {
        searchQuery.featured = featured === "true" ? true : false;
    }
    if (company) {
        searchQuery.company = company;
    }
    if (name) {
        searchQuery.name = {
            $regex: name,
            $options: "i"
        }
    }
    if (numericFilters) {

        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte"

        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

        const options = ["price", "rating"];
        filters = filters.split(",").forEach((item) => {

            const [field, operator, value] = item.split("-")

            if (options.includes(field)) {
                searchQuery[field] = {
                    [operator]: Number(value)
                }
            }
        });


    }


    let result = Product.find(searchQuery); // prepare the query so we can add more options if needed

    // SORTING 
    if (sort) {
        const sortList = sort.split(",").join(" ");
        result = result.sort(sortList)

    } else { // if no sort param than sort by date default
        result = result.sort("createdAt");
    }

    // FIELDS
    if (fields) {
        const fieldsList = fields.split(",").join(" ")
        result.select(fieldsList);
    }
    // PAGINATION
    const page = Number(req.query.page) || 1; //if no page query than default is 1
    const limit = Number(req.query.limit) || 10; //if no limit query than default is 10
    const skip = (page - 1) * limit;



    // ADD THE COMPLETE QUERY IF THERE IS BEFORE QUERYING THE DB
    result = result.skip(skip).limit(limit)

    const products = await result;

    res.status(200).json({
        hits: products.length,
        products
    })
}



module.exports = {
    getAllProductsStatic,
    getAllProducts
}