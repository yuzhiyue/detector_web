function addCookie(name,value,expiresHours){
    var cookieString=name+"="+escape(value);
//判断是否设置过期时间
    if(expiresHours>0){
        var date=new Date();
        date.setTime(date.getTime+expiresHours*3600*1000);
        cookieString=cookieString+"; expires="+date.toGMTString();
    }
    document.cookie=cookieString;
}

function getCookie(name){
    var strCookie=document.cookie;
    var arrCookie=strCookie.split("; ");
    for(var i=0;i<arrCookie.length;i++){
        var arr=arrCookie[i].split("=");
        if(arr[0]==name)return arr[1];
    }
    return "";
}

function deleteCookie(name){
    var date=new Date();
    date.setTime(date.getTime()-10000);
    document.cookie=name+"=v; expires="+date.toGMTString();
}

function  randomChar(l) {
    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    var timestamp = new Date().getTime();
    for (var i = 0; i < l; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return timestamp + tmp;
}

function  randomCharWithoutTime(l) {
    var x = "0123456789";
    var tmp = "";
    for (var i = 0; i < l; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return tmp;
}

function addZero(number, length) {
    var buffer = "";
    if (number ==  "") {
        for (var i = 0; i < length; i ++) {
            buffer += "0";
        }
    } else {
        if (length < number.length) {
            return "";
        } else if (length == number.length) {
            return number;
        } else {
            for (var i = 0; i < (length - number.length); i ++) {
                buffer += "0";
            }
            buffer += number;
        }
    }
    return buffer;
}


function formatDate(now) {
    var year = String(now.getFullYear());
    var month = String(now.getMonth()+1);
    var date = String(now.getDate());
    var hour = String(now.getHours());
    var minute = String(now.getMinutes());
    var second = String(now.getSeconds());
    return year+"/"+ addZero(month, 2) + "/" + addZero(date,2) + " " + addZero(hour,2) + ":" + addZero(minute,2) + ":" + addZero(second,2);
}

var PageItems=[{text:'概览',link:"/home",group:"1"},
    {text:'探针管理',link:"/detector",group:"2"},
    {text:'轨迹查询',link:"/search",group:"3"},
    // {text:'区域扫描',link:SearchPage},
    {text:'轨迹吻合度分析',link:"/similar",group:"4"},
    // {text:'电子围栏',link:"/search"},
    // {text:'视频关联分析',link:"detector2"},
    // {text:'车牌号关联分析',link:"/car"},
    {text:'上网行为查询',link:"/behavior",group:"5"},
    {text:'特征库管理',link:"/feature",group:"6"},
    {text:'用户管理',link:"/user",group:"7"},
    {text:'探针配置',link:"/detector_conf",group:"8"}
]

module.exports.addCookie = addCookie;
module.exports.getCookie = getCookie;
module.exports.deleteCookie = deleteCookie;
module.exports.randomChar = randomChar;
module.exports.randomCharWithoutTime = randomCharWithoutTime;
module.exports.formatDate = formatDate;
module.exports.PageItems = PageItems;
$.support.cors = true;
module.exports.server_addr = "http://112.74.90.113/server_interface"
//module.exports.server_addr = "http://192.168.31.149:8080"