
chrome.browserAction.setBadgeText({text: "..."});

if(localStorage.linkemip){
    setInterval(function(){chrome.browserAction.setBadgeText({text: "99999 Mb/s"});},5000);   
}    
else{
    var sett = {
        type:'basic',
        title:"Inserisci l'indirizzo IP!",
        message:"Devi inserire l'indirizzo IP del tuo router Linkem"
    };
   // chrome.tabs.create({ url: "options.html" });
    chrome.browserAction.setBadgeText({text: "Error!"});
}