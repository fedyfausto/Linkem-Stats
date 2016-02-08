chrome.browserAction.setBadgeBackgroundColor({color:"#2c3e50"});
chrome.browserAction.setBadgeText({text: "..."});
console.log(localStorage['linkemip']);
var interval;
interval = setInterval(function(){loadLinkemInfo()},5000); 
if(localStorage.linkemip){

}    
else{
    // chrome.tabs.create({ url: "options.html" });
    chrome.browserAction.setIcon({path:"assets/icons/0.png"});
    chrome.browserAction.setBadgeText({text: "Error!"});
}


function loadLinkemInfo(){
    var valori_linkem;

    $.ajax({
        method: "get",
        url: "http://"+localStorage.linkemip+"/cgi-bin/sysconf.cgi?page=ajax.asp&action=each_status&parameter=gui_event_mobileNet_currentMode%09gui_event_mobileNet_operator%09gui_event_mobileNet_signal%09gui_event_lan_ip%09gui_event_lan_mask%09gui_event_wan_ip%09gui_event_wan_mask%09gui_event_firewall_service%09gui_event_mag_deviceName%09gui_event_monitor_dataRate%09gui_event_monitor_deviceUpTime%09gui_event_about_provider",
        success:function(data){



            var valori= encodeURIComponent(data).split("%09");
            var velox = valori[10].split("%2C");
            valori_linkem = {
                type_connection : valori[1],
                operator : valori[2],
                power_signal : valori[3],
                router_ip : valori[4],
                local_mask : valori[5],
                wan_ip : valori[6],
                wan_mask : valori[7],
                firewall : valori[8],
                name_router : valori[9],
                operator : valori[2],
                vel_up : velox[0],
                vel_down : velox[4]
            };

            $.ajax({
                method: "get",
                url: 'http://'+localStorage.linkemip+'/cgi-bin/sysconf.cgi?page=ajax.asp&action=status_Signal_Strength',
                success:function(data){
                    var valori= encodeURIComponent(data).split("%09");
                    valori_linkem.signal = valori[1];
                    valori_linkem.quality = valori[2];
                    var linkemvals = valori_linkem;

                    chrome.browserAction.setIcon({path:"assets/icons/"+linkemvals.power_signal+".png"});
                    chrome.browserAction.setBadgeText({text: (parseInt(linkemvals.vel_down)/1000).toFixed(2)});


                },
                error:function(){

                }
            });


        },
        error:function(){
            chrome.browserAction.setIcon({path:"assets/icons/0.png"});
            chrome.browserAction.setBadgeText({text: "Error"});
        }
    });

}