var linkemvals;
var gauge_down;
var gauge_up;
var gauge_signal;
var barssignal;
var interval;

$(document).ready(function() {

    $(".loading-obj").show();
    $(".set-obj").hide();
    $(".unset-obj").hide();
    $("#ipaddressinput").val(localStorage.linkemip);

    $("#buttonsave").on("click",function(){

        testIP($("#ipaddressinput").val());

    });

    if(localStorage.linkemip){
        $(".loading-obj").hide();
        interval =  setInterval(function(){loadLinkemInfo(true);},1000);
    }
    else{
        $(".loading-obj").hide();
        $(".set-obj").hide();
        $(".unset-obj").show();
    }

    gauge_down = new JustGage({
        id: "gauge_down",
        value: 0,
        min: 0,
        max: 20,
        levelColorsGradient: true,
        hideInnerShadow: true,
        label: 'Mb/s',
        decimals:2,
        pointer: true,
        // gaugeWidthScale: 0.6,
        pointerOptions: {
            toplength: -15,
            bottomlength: 10,
            bottomwidth: 6,
            color: '#8e8e93',
            stroke: '#ffffff',
            stroke_width: 2,
            stroke_linecap: 'round'
        },
        customSectors: [{
            color: '#3498db',
            lo: 0,
            hi: 5
        }, {
            color: '#3498db',
            lo: 5,
            hi: 10
        }, {
            color: '#3498db',
            lo: 10,
            hi: 20
        }],
    });
    gauge_up=new JustGage({
        id: "gauge_up",
        value: 0,
        min: 0,
        max: 2,
        label: "Mb/s",
        pointer: true,
        decimals:2,
        // gaugeWidthScale: 0.6,
        pointerOptions: {
            toplength: -15,
            bottomlength: 10,
            bottomwidth: 6,
            color: '#8e8e93',
            stroke: '#ffffff',
            stroke_width: 2,
            stroke_linecap: 'round'
        },
        levelColorsGradient: true,
        hideInnerShadow: true,
        customSectors: [{
            color: '#9b59b6',
            lo: 0,
            hi: 2
        }],
    });
    gauge_signal = new JustGage({
        id: 'gauge_signal',
        value: 0,
        min: 0,
        max: 35,
        label: 'dB',
        donut: true,
        pointer: true,
        gaugeWidthScale: 0.4,
        pointerOptions: {
            bottomlength: 10,
            bottomwidth: 6,
            color: '#8e8e93',
            stroke: '#ffffff',
            stroke_width: 2,
            stroke_linecap: 'round'
        },
        counter: true,
        customSectors: [{
            color: '#e74c3c',
            lo: 0,
            hi: 10
        }, {
            color: '#f1c40f',
            lo: 10,
            hi: 18
        }, {
            color: '#5fbeaa',
            lo: 18,
            hi: 35
        }],
    });
    barssignal = $("#barsignal").peity("bar", { width: 50,height:30,colors:"#5fbeaa" });

});


function testIP(ip){
    $(".unset-obj").hide();
    $(".loading-obj").show();
    var url = "http://"+ip+"/cgi-bin/sysconf.cgi?page=ajax.asp&action=each_status&parameter=gui_event_mobileNet_currentMode%09gui_event_mobileNet_operator%09gui_event_mobileNet_signal%09gui_event_lan_ip%09gui_event_lan_mask%09gui_event_wan_ip%09gui_event_wan_mask%09gui_event_firewall_service%09gui_event_mag_deviceName%09gui_event_monitor_dataRate%09gui_event_monitor_deviceUpTime%09gui_event_about_provider";
    $.ajax({
        method: "get",
        url: url,
        success:function(data){
            localStorage.linkemip = ip;
            interval =  setInterval(function(){loadLinkemInfo(true);},1000);
        },
        error:function(){
            $(".loading-obj").hide();
            $(".unset-obj").show();
            $("#errormsg").html("Error! I can't find your Router!");
        },

    });
}
function loadLinkemInfo(updateView){
    var valori_linkem;


    $.ajax({
        method: "get",
        url: "http://"+$("#ipaddressinput").val()+"/cgi-bin/sysconf.cgi?page=ajax.asp&action=each_status&parameter=gui_event_mobileNet_currentMode%09gui_event_mobileNet_operator%09gui_event_mobileNet_signal%09gui_event_lan_ip%09gui_event_lan_mask%09gui_event_wan_ip%09gui_event_wan_mask%09gui_event_firewall_service%09gui_event_mag_deviceName%09gui_event_monitor_dataRate%09gui_event_monitor_deviceUpTime%09gui_event_about_provider",
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
            localStorage.linkemip = $("#ipaddressinput").val();

            //chrome.extension.getBackgroundPage().updateSetting();

            $.ajax({
                method: "get",
                url: 'http://'+localStorage.linkemip+'/cgi-bin/sysconf.cgi?page=ajax.asp&action=status_Signal_Strength',
                success:function(data){
                    var valori= encodeURIComponent(data).split("%09");
                    valori_linkem.signal = valori[1];
                    valori_linkem.quality = valori[2];
                    linkemvals = valori_linkem;
                    $(".loading-obj").hide();
                    $(".set-obj").show();
                    updatePanel();

                },
                error:function(){
                    $(".loading-obj").hide();
                    $(".unset-obj").show();
                    $("#errormsg").html("Error! I can't find your Router!");
                }
            });


        },
        error:function(){
            clearInterval(interval);
            $(".loading-obj").hide();
            $(".unset-obj").show();
            $("#errormsg").html("Error! I can't find your Router!");
        }
    });

}
function updatePanel(){

    var str="";
    switch(parseInt(linkemvals.power_signal)){
        case 0:
            str="No Signal";
            barssignal.text("0,0,0,0,0").change();
            break;
        case 1:
            str="Bad";
            barssignal.text("1,0,0,0,0").change();
            break;
        case 2:
            str="Adequate";
            barssignal.text("1,2,0,0,0").change();
            break;
        case 3:
            str="Good";
            barssignal.text("1,2,3,0,0").change();
            break;
        case 4:
            str="Really Good";
            barssignal.text("1,2,3,4,0").change();
            break;
        case 5:
            str="Excellent";
            barssignal.text("1,2,3,4,5").change();
            break;

    }
    $("#text-signal").html(str);
    $("#text-operator").html(linkemvals.operator+" ("+linkemvals.type_connection+")");
    $("#text-signalquality").html(linkemvals.quality+" dB");
    gauge_signal.refresh(parseInt(linkemvals.quality));

    $("#text-down").html((parseInt(linkemvals.vel_down)/1000).toFixed(2)+" Mb/s");
    gauge_down.refresh((parseInt(linkemvals.vel_down)/1000).toFixed(2));

    $("#text-up").html((parseInt(linkemvals.vel_up)/1000).toFixed(2)+" Mb/s");
    gauge_up.refresh((parseInt(linkemvals.vel_up)/1000).toFixed(2));

    $("#namerouter").html(" ("+linkemvals.name_router+")");
    $("#text-iprouter").html(linkemvals.router_ip);
    $("#text-subnet-local").html(linkemvals.local_mask);
    $("#text-wanip").html(linkemvals.wan_ip);
    $("#text-wanmask").html(linkemvals.wan_mask);

    if(linkemvals.firewall!="disable"){
        $("#text-firewall").removeClass("text-danger");
        $("#text-firewall").addClass("text-success");
        $("#text-firewall").html('<i class="fa fa-check"></i>');
    }
    else{

        $("#text-firewall").removeClass("text-success");
        $("#text-firewall").addClass("text-danger");
        $("#text-firewall").html('<i class="fa fa-times"></i>');

    }




}