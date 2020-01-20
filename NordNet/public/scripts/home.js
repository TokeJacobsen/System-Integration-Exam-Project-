$(document).ready(function() {
 
    var stockArray;
    $.ajaxSetup({async: false});
    $.get("https://api.worldtradingdata.com/api/v1/stock?symbol=SNAP,TWTR,VOD.L&api_token=demo", function(data, status){

        stockArray = data.data;  
    })

    var portfolio = {}
    var balance = 1000;

    setInterval(()=> {console.log("from interval"+JSON.stringify(portfolio))},3000)

    
    $("#balance").text(balance)

    var stocks = []

    for (let index = 0; index < stockArray.length; index++) {
        let element = stockArray[index];

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds())
        var timeStamp = ""+date + " " + time

        stocks.push({"name": element.name, "symbol": element.symbol, "price":element.price, "lastUpdated": timeStamp })

        $("#stock-list").append("<li style='font-size: 20px; font-weight: bold;'>"+
        element.name+" "+element.symbol+" "+element.price+ "$ updated at: " + timeStamp +
        "</li><input type='number' id ='input"+element.symbol+"' style='width:30px'></input ><button id='"+element.symbol+"' class = 'stock'>Buy</button>")
        
    }

    
    function buyStock(element, quantity){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds())
        var timeStamp = ""+date + " " + time

        let price = element.price*quantity;
        if(balance -price < 0){
            alert("Can't afford! Transfer more money")
            return
        }
        balance = balance -price
        $("#balance").text(balance)

        if(portfolio[element.symbol] != undefined){
            portfolio[element.symbol].quantity = (parseInt(portfolio[element.symbol].quantity, 10)+parseInt(quantity,10)).toString()
        }
        else{

            portfolio[element.symbol] = {"name":element.name, "quantity": quantity}
        }
        $("#portfolio").empty();
        for (var key in portfolio) {
            if (portfolio.hasOwnProperty(key)) {           
                $("#portfolio").append("<li style='font-size: 20px; font-weight;'>"+
                portfolio[key].quantity +"x " +portfolio[key].name+" "+key+  "</li><button id='sell"+element.symbol+"'class ='sell'>Sell</button>" ) 
            }
        }


        $(".sell").click(function() {
            let chosenStock = this.id.substring(4)
            let value = parseInt(portfolio[chosenStock].quantity,10) * (stocks.find(element => element.symbol == chosenStock)).price
            delete portfolio[chosenStock];
            balance = balance +value
            $("#balance").text(balance)

            $("#portfolio").empty()
            for (var key in portfolio) {
                if (portfolio.hasOwnProperty(key)) {           
                    $("#portfolio").append("<li style='font-size: 20px; font-weight;'>"+
                    portfolio[key].quantity +"x " +portfolio[key].name+" "+key+  "</li><button id='sell"+element.symbol+"'class ='sell'>Sell</button>" ) 
                }
            }
        });

    }


    $(".stock").click(function() {
        let chosenStock = stocks.find(element => element.symbol == this.id)
        let quantity = $("#input"+chosenStock.symbol).val()
        buyStock(chosenStock,quantity)
      });
  

    setInterval(updateStocks,10000)

    function updateStocks (){
        $("#stock-list").empty();
        for (let index = 0; index < stocks.length; index++) {
            let element = stockArray[index];
            let influence = Math.random() *  (1.2 - 0.8) + 0.8; 
            element.price = Math.round((element.price * influence) * 100) / 100

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = checkTime(today.getHours()) + ":" + checkTime(today.getMinutes()) + ":" + checkTime(today.getSeconds());
    
            var timeStamp = ""+date + " " + time

            if (influence >= 1){
                
                $("#stock-list").append("<li style='color:green; font-size: 20px; font-weight: bold;'>"+
                element.name+" "+element.symbol+" "+element.price+"$ updated at: " + timeStamp +
                "</li><input type='number' id ='input"+element.symbol+"' style='width:30px'></input ><button id='"+element.symbol+"' class = 'stock2'>Buy</button>")
            }
            else{
                $("#stock-list").append("<li style='color:red; font-size: 20px; font-weight: bold;'>"+
                element.name+" "+element.symbol+" "+element.price+"$ updated at: " + timeStamp +
                "</li><input type='number' id ='input"+element.symbol+"' style='width:30px'></input> <button id='"+element.symbol+"'class ='stock2'>Buy</button>")
            }
            
            stocks[index] =  {"name": element.name, "symbol": element.symbol, "price":element.price, "lastUpdated": timeStamp }

    
        }
        $(".stock2").click(function() {
            let chosenStock = stocks.find(element => element.symbol == this.id)
            let quantity = $("#input"+chosenStock.symbol).val()
            buyStock(chosenStock,quantity)          
        });
    }

    


    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

})

