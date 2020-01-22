
    if (window.addEventListener) {
        window.addEventListener("message", onMessage, false);        
    } 
    else if (window.attachEvent) {
        window.attachEvent("onmessage", onMessage, false);
    }

    function onMessage(event) {
    // Check sender origin to be trusted
        if (event.origin !== "http://80.210.70.4:3333") return;
        var data = event.data;
        if (typeof(window[data.func]) == "function") {
        window[data.func].call(null, data.message);
    }
}

// Function to be called from iframe
async function parentFunc(message) {
  
  localStorage.setItem("token", message);
  sendToken(message);
  //const response = await fetch('http://localhost:82/validate/'+message);
  //const myJson = await response.json();  
  //alert(JSON.stringify(myJson))   
  window.location = "/home.html";
}

function sendToken(token){
var ajaxPost = $.post( "/saveToken", {token:token})
}
