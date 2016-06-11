// shigoto-no-owari
var SNO = {
    timer: null,
    $elem: null,
    endTime: 0,
    init: function($elem, endTime){
        if(this.timer != null){
            clearInterval(this.timer);
        }
        this.$elem = $elem;
        this.endTime = endTime;
        this.timer = setInterval(this.outputTime, 1000);
    },
    load: function(endTime){
        var startObj = moment();
        var endObj = moment(endTime, "HH:mm:ss");
        if(endObj.isBefore(startObj)){
            endObj = endObj.add(1, "d");
        }
        var diffSec = endObj.diff(startObj, "s");
        return moment("00:00:00", "HH:mm:ss").add(diffSec, "s").format("HH:mm:ss");
    },
    outputTime: function(){
        var leftTime = SNO.load(SNO.endTime);
        $(SNO.$elem).html(leftTime);
    },
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}


$(function(){
    var slider = $('#slider').slideReveal({
      position: "right",
      trigger: $("#trigger")
    });

    $.each(Array(24), function(i,h){
        if(i < 10) i = "0"+i;
        $("select[name=hour]").append("<option value="+i+">"+i+"</option>");
    });
    $.each(Array(60), function(i,h){
        if(i < 10) i = "0"+i;
        $("select[name=min]").append("<option value="+i+">"+i+"</option>");
    });
    $.each(Array(60), function(i,h){
        if(i < 10) i = "0"+i;
        $("select[name=sec]").append("<option value="+i+">"+i+"</option>");
    });

    $('#trigger').bind('click', function(){
        if($(this).hasClass('open')){
            $(this).removeClass('open');
            $(this).addClass('close');
        } else {
            $(this).removeClass('close');
            $(this).addClass('open');
        }
    });

    $('#update').bind('click', function(){
        slider.slideReveal("hide");
        $('#trigger').removeClass('close');
        $('#trigger').addClass('open');
        var title = $('input[name=title]').val();
        var cookie = $('input[name=cookie]').is(':checked');
        var hour = $('select[name=hour]').val();
        var min = $('select[name=min]').val();
        var sec = $('select[name=sec]').val();
        if(cookie){
            SNO.setCookie("sno-title", title, 30);
            SNO.setCookie("sno-endtime", hour+":"+min+":"+sec, 30);
            SNO.setCookie("sno-cookie", cookie, 30);
        } else {
            SNO.setCookie("sno-title", title, -1);
            SNO.setCookie("sno-endtime", hour+":"+min+":"+sec, -1);
            SNO.setCookie("sno-cookie", cookie, -1);
        }
        $("div.title").html(title);
        $(".time").html("00:00:00");
        SNO.init($(".time"), hour+":"+min+":"+sec);
    });

    if(SNO.getCookie("sno-cookie")){
        $("div.title").html(SNO.getCookie("sno-title"));
        $('input[name=title]').val(SNO.getCookie("sno-title"));
        $('input[name=cookie]').attr('checked', true);
        var t = (SNO.getCookie("sno-endtime") == "") ? "00:00:00" : SNO.getCookie("sno-endtime");
        var tarr = t.split(":");
        $('select[name=hour]').val(tarr[0]);
        $('select[name=min]').val(tarr[1]);
        $('select[name=sec]').val(tarr[2]);
    }
    
    SNO.init($(".time"), t);
});