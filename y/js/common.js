function GetUserIP(){
  var ret_ip;
  $.ajaxSetup({async: false});
  $.get('https://jsonip.com/', function(r){ 
    ret_ip = r.ip; 
  });
  return ret_ip;
}

function GetBrowserName() {
  var ret_browsername;
  if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
    ret_browsername = 'Opera';
  }
  else if((navigator.userAgent.indexOf("Edge") != -1 )) {
    ret_browsername = 'Edge';
  }
  else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
    ret_browsername = 'Chrome';
  }
  else if(navigator.userAgent.indexOf("Safari") != -1) {
    ret_browsername = 'Safari';
  }
  else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
   ret_browsername = 'Firefox';
 }
 else if(((navigator.userAgent.indexOf("MSIE") != -1 ) || (navigator.userAgent.indexOf("Trident") != -1 )) || (!!document.documentMode == true )) {
  ret_browsername = 'IE';
}  
else {
 ret_browsername = 'unknown';
}
return ret_browsername;
}

function GetOsName() {
  var ret_osname;
  var os_name = navigator.appVersion;
  if (os_name.indexOf("Win") != -1) {
    ret_osname = "Windows";
  } else if (os_name.indexOf("Mac") != -1) {
    ret_osname = "Mac";
  } else if (os_name.indexOf("X11") != -1) {
    ret_osname = "Unix";
  } else if (os_name.indexOf("Linux") != -1) {
    ret_osname = "Linux";
  } else if (os_name.indexOf("SunOS") != -1) {
    ret_osname = "Solaris";
  } else {
    ret_osname = "Unknown";
  }
  return ret_osname;
}