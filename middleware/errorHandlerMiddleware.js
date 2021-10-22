const errorHandlerMiddleware = async (err, req, res, next) => {
    console.log(`ERROR => ${err}`)
    return res.status(500).json({
        msg: `Ooops...something went wrong. Does this help: ${err}`
    })
}

module.exports = errorHandlerMiddleware;