const express = require("express")
const app = express()

var bodyParser = require('body-parser')
app.use(express.static(__dirname + "/public"));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


const routeIndex =  require('./routes/index.js')

app.get('/',routeIndex);

var token = ""

function print(){
  console.log("Interval says: " +token)
}

app.post("/saveToken", function ( req, res) {
  let tempToken = req.body.token;
  token = tempToken;
  res.statusCode = 200;
  res.send();
});

server = app.listen(81, (error) => {
    if (error)
    console.log("Error!")

    console.log("Server listening on port " + server.address().port )
})