module.exports = (req, res) => {

    var path = require('path');
    res.status(200).sendFile(path.resolve(__dirname +"/../public/index.html"))
}