$(document).ready(function() {

 
    var stockArray;
    $.ajaxSetup({async: false});
    $.get("https://api.worldtradingdata.com/api/v1/stock?symbol=SNAP,TWTR,VOD.L&api_token=demo", function(data, status){

        stockArray = data.data;
    })
    var stocks = {}

    var Usertoken = localStorage.getItem("token")
    var portfolio = {}
    var balance = 0;

    var test = ""
    
    $("#balance").text(balance)


    for (let index = 0; index < stockArray.length; index++) {
        
        let element = stockArray[index];

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds())
        var timeStamp = ""+date + " " + time

        stocks[element.symbol] = {"name": element.name, "price":element.price, "lastUpdated": timeStamp }

        $("#stock-list").append("<li style='font-size: 20px; font-weight: bold;'>"+
        element.name+" "+element.symbol+" "+element.price+ "$ updated at: " + timeStamp +
        "</li><input type='number' id ='input"+element.symbol+"' style='width:30px'></input ><button id='"+element.symbol+"' class = 'stock'>Buy</button>")
        
    }

    
    function buyStock(stockItem, quantity){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds())
        var timeStamp = ""+date + " " + time
        element = stocks[stockItem]

        let price = round(element.price*quantity);

        if(balance -price < 0){
            alert("Can't afford! Transfer more money")
            return
        }
        balance = balance -price
        $("#balance").text(balance)

        if(portfolio[stockItem] != undefined){
            portfolio[stockItem].quantity = round((parseFloat(portfolio[stockItem].quantity, 10)+parseFloat(quantity,10)))
            portfolio[stockItem].boughtValue = round((parseFloat(portfolio[stockItem].boughtValue, 10) + price))
        }
        else{
            portfolio[stockItem] = {"name":element.name, "quantity": quantity, "boughtValue":price}

        }
        $("#portfolio").empty();
        for (var key in portfolio) {
            if (portfolio.hasOwnProperty(key)) {        
                $("#portfolio").append("<li style='font-size: 20px; font-weight;'>"+
                portfolio[key].quantity +"x " +portfolio[key].name+" "+key+ "</li><button id='sell"+stockItem+"'class ='sell'>Sell</button>" ) 
            }
        }


        $(".sell").click(function() {
            let chosenStock = this.id.substring(4)
            let value = round(parseFloat(portfolio[chosenStock].quantity,10) * (stocks[chosenStock]).price)

            if(parseFloat(portfolio[chosenStock].boughtValue, 10) > value ){
                alert("You lost money, nothing to report to the tax!")
            }
            else if(parseFloat(portfolio[chosenStock].boughtValue, 10) == value ){
                alert("You got your money back and nothing else. Nothing to report to tax")
            }
            else{
                let taxData = round(value - parseFloat(portfolio[chosenStock].boughtValue, 10))
                alert("You made money! " + taxData + " reported to the tax agency")
                $.post( "http://localhost:81/SendTaxData", { token: Usertoken, money: taxData })
                .done(function( data ) {
                if( data.statuscode == 200 ){
                    alert("You now owe " + round(parseFloat(data.taxOwed.replace(",","."))) + "$ in tax")
                        
                }
        })
            }

            delete portfolio[chosenStock];
            balance = balance +value
            $("#balance").text(balance)

            $("#portfolio").empty()
            for (var key in portfolio) {
                if (portfolio.hasOwnProperty(key)) {           
                    $("#portfolio").append("<li style='font-size: 20px; font-weight;'>"+
                    portfolio[key].quantity +"x " +portfolio[key].name+" "+key+  "</li><button id='sell"+key+"'class ='sell'>Sell</button>" ) 
                }
                
            }
        });

    }

    $("#addBtc").click(function(){
        let addedMoney = $("#addInput").val();
        $.post( "http://localhost:81/sendBankData", { token: Usertoken, money: addedMoney })
        .done(function( data ) {
            if( data.Response.statuscode == 200 ){
                let currentBalance = round(parseFloat($("#balance").text(),10))
                balance = round(parseFloat(addedMoney,10) + currentBalance)
                $("#balance").text(balance)    
            }
        })
    })


    $(".stock").click(function() {
        let chosenStock = this.id
        let quantity = $("#input"+jq(chosenStock)).val()
        buyStock(chosenStock,quantity)
      });
  

    setInterval(updateStocks,10000)

    function updateStocks (){

        $("#stock-list").empty();

        for (var element in stocks) {
            let influence = Math.random() *  (1.2 - 0.8) + 0.8; 
            stocks[element].price = round((stocks[element].price * influence))

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds());
    
            var timeStamp = ""+date + " " + time

            if (influence >= 1){
                
                $("#stock-list").append("<li style='color:green; font-size: 20px; font-weight: bold;'>"+
                stocks[element].name+" "+element+" "+stocks[element].price+"$ updated at: " + timeStamp +
                "</li><input type='number' id ='input"+element+"' style='width:30px'></input ><button id='"+element+"' class = 'stock2'>Buy</button>")
            }
            else{
                $("#stock-list").append("<li style='color:red; font-size: 20px; font-weight: bold;'>"+
                stocks[element].name+" "+element+" "+stocks[element].price+"$ updated at: " + timeStamp +
                "</li><input type='number' id ='input"+element+"' style='width:30px'></input> <button id='"+element+"'class ='stock2'>Buy</button>")
            }
            
            stocks[element] =  {"name": stocks[element].name, "price":stocks[element].price, "lastUpdated": timeStamp }

        }

        $(".stock2").click(function() {
            let chosenStock = this.id
            let quantity = $("#input"+jq(chosenStock)).val()
            buyStock(chosenStock,quantity)          
        });
    }

    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    function jq( myid ) {
 
        return ""+myid.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
     
    }

    function getPercentageChange(oldNumber, newNumber){
        var decreaseValue = oldNumber - newNumber;
        return (decreaseValue/oldNumber)*100
    }

    function round(num){

        return Math.round(num * 100) / 100
    }


})

