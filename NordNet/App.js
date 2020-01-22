const express = require("express")
const app = express()

const request = require('request');


var bodyParser = require('body-parser')
app.use(express.static(__dirname + "/public"));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


var apiPorts = {"bank": "3000", "skat":"51676"}


var xmlrpc = require('xmlrpc')
const xmlToJson = require('xml-to-json-stream');

var client = xmlrpc.createClient({ host: 'localhost', port: apiPorts["bank"], path: '/'})
const parser = xmlToJson({attributeMode:false});


const routeIndex =  require('./routes/index.js')

app.get('/',routeIndex);

var apiPorts = {"bank": "3000", "skat":"51676"}

function print(){
  console.log("Interval says: " +token)
}

app.post("/sendBankData", function ( req, res) {
  let tempToken = req.body.token;
  let money = req.body.money;
  let val;
  client.methodCall('deductMoney', [tempToken, money], function (error, value) {
    if (error)
      console.log(error)
    
    parser.xmlToJson(value, (err,json)=>{
        val = json;
        res.send(val);
    })

  })
});

app.post("/sendTaxData", function ( req, res) {
  let tempToken = req.body.token;
  let tempMoney = req.body.money;
  let val ;
  request.post("http://localhost:"+ apiPorts["skat"] +"/tax/addTax", { json: {token:tempToken, money:tempMoney} }, (err, resp, body) => {
    if (err) { return console.log(err); }
      res.send(body);
  });

});


server = app.listen(81, (error) => {
    if (error)
    console.log("Error!")

    console.log("Server listening on port " + server.address().port )
})