// var username=document.cookie.split(";")[0].split("=")[1];

// export var sessionIDGlobal;

//  水印
// export function addWaterMarker(str)
// {
// 	alert('addWaterMarker='+ str);
// 	var can = document.createElement('canvas');
// 	// var body = document.body;
// 	$('.txtEdit').append(can);
// 	can.width=600;
// 	can.height=300;
// 	can.style.display='none';
// 	var cans = can.getContext('2d');
// 	cans.rotate(-20*Math.PI/180);
// 	cans.font = "25px Microsoft JhengHei";
// 	cans.fillStyle = "rgba(17, 17, 17, 0.2)";
// 	cans.textAlign = 'left';
// 	cans.textBaseline = 'Middle';
// 	cans.fillText(str,can.width/20,can.height);

// 	$('.txtEdit').css(
// 	  'background-image',"url("+can.toDataURL("image/png")+")"
// 	);
// }

export function myAlert(txt) {
  // alert(txt)
}

export function CheckForm(newName) {
  var regEn = /[`~!@#$%^&*()_+<>?:"{},.\\\s\/;'[\]]/im,
  regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
  var han = /^[\u4e00-\u9fa5]+$/;
  var reg = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9~!@&%#_]{8,16}$/;
  if (regEn.test(newName) || regCn.test(newName) || han.test(newName)||reg.test(newName)) {
    // alert("名称不能包含特殊字符.");
    return false;
  }
};

export function CheckMeetingName(newName) {
  var regEn = /[`~!@#$%^&*()_+<>?:"{},.\\\s\/;'[\]]/im,
  regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
  var reg = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9~!@&%#_]{8,16}$/;
  if (regEn.test(newName) || regCn.test(newName) || reg.test(newName)) {
    // alert("名称不能包含特殊字符.");
    return false;
  }
  return true;
};

export function CheckVoiceName(newName) {
  var regEn = /[`~!@#$%^&*()_+<>?:"{},.\\\s\/;'[\]]/im,
  regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
  regXia = /[^\w_]/;
  var reg = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9~!@&%#_]{8,16}$/;
  if (regEn.test(newName) || regCn.test(newName) || reg.test(newName)) {
    console.log(regXia.test(newName),"xia");
    console.log(regEn.test(newName));
    // if(!regXia.test(newName)) {
    //   return true
    // } else {
    //   // alert("名称不能包含特殊字符.");
    //   return false;
    // }
    
  }
  return true;
};

export function CheckUserName(newName) {
  var regEn = /[`~!@#$%^&*()_+<>?:"{},.\\\s\/;'[\]]/im,
    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
  if (regEn.test(newName) || regCn.test(newName)) {
    // alert("名称不能包含特殊字符.");
    return false;
  }
  return true;
};


export function CheckLength(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  //alert(len);
  if (len > 20 || len < 1) {
    return false;
  } else {
    return true;
  }

};


export function gb2utf8(gbStr) {
  var codeStr = gbStr;
  var codeRE = new RegExp("(%..%..)", "gi");
  var replaceRE = new RegExp("(%..%..)", "i");
  var gbCode;
  var utfCode;
  var gbStart;
  while ((codeRE.lastIndex < gbStr.length) && replaceRE.test(gbStr)) {
    codeRE.exec(gbStr);
    gbCode = new String(RegExp.$1);
    gbStart = new Number(codeStr.indexOf(gbCode.toLowerCase()));
    var utfStart = 0;
    if (gbStart != -1) {
      utfStart = gbStart + 7;
      utfCode = codeStr.substring(utfStart, utfStart + 6);
    } else {
      utfCode = "%u3000";
    }
    gbStr = gbStr.replace(replaceRE, utfCode);
  }
  return gbStr;
}

export function UnicodeToUtf8(unicode) {
  var uchar;
  var utf8str = "";
  var i;
  for (i = 0; i < unicode.length; i += 2) {
    uchar = (unicode[i] << 8) | unicode[i + 1];        //UNICODE为2字节编码，一次读入2个字节
    utf8str = utf8str + String.fromCharCode(uchar);  //使用String.fromCharCode强制转换
  }
  return utf8str;
}

export function Utf8ToUnicode(strUtf8) {
  var i, j;
  var uCode;
  var temp = new Array();
  for (i = 0, j = 0; i < strUtf8.length; i++) {
    uCode = strUtf8.charCodeAt(i);
    if (uCode < 0x100) {         //ASCII字符
      temp[j++] = 0x00;
      temp[j++] = uCode;
    } else if (uCode < 0x10000) {
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else if (uCode < 0x1000000) {
      temp[j++] = (uCode >> 16) & 0xff;
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else if (uCode < 0x100000000) {
      temp[j++] = (uCode >> 24) & 0xff;
      temp[j++] = (uCode >> 16) & 0xff;
      temp[j++] = (uCode >> 8) & 0xff;
      temp[j++] = uCode & 0xff;
    } else {
      break;
    }
  }
  temp.length = j;
  return temp;
}

//JS操作cookies方法!
//写cookies
export function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//读cookies
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

//删cookies
export function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+"; path=/";
}

//使用示例
// setCookie("name","hayden");
// alert(getCookie("name"));

//如果需要设定自定义过期时间
//那么把上面的setCookie　函数换成下面两个函数就ok;
//程序代码
export function setCookieByTime(name, value, time) {
  var strsec = getsec(time);
  var exp = new Date();
  exp.setTime(exp.getTime() + strsec * 1);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

export function getsec(str) {
  //alert(str);
  var str1 = str.substring(1, str.length) * 1;
  var str2 = str.substring(0, 1);
  if (str2 == "s") {
    return str1 * 1000;
  } else if (str2 == "h") {
    return str1 * 60 * 60 * 1000;
  } else if (str2 == "d") {
    return str1 * 24 * 60 * 60 * 1000;
  }
}

//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30
// setCookie("name","hayden","s20");

export function trimSpace(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "" || typeof (array[i]) == "undefined") {
      array.splice(i, 1)
      i = i - 1
    }
  }
  return array;
}

//去掉数组中空值


export function escapeStringHTML(str) {
  str = str.replace(/&lt;/g, '<')
  str = str.replace(/&gt;/g, '>')
  return str
}

//编码转符号
