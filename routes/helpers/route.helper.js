module.exports = {
    /**
     * 
     * @param {*} res 
     * @param {*} err 
     * @param {*} statusCode 
     */
    sendJsonError(res, err, statusCode) {
        var code = statusCode || 400;
        res.status(code)
        .json({
            message: err.toString()
        });
    }
}