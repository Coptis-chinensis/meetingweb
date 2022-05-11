
'use strict';
// 千万不要添加入口函数
// 设计图的宽度/自己设定的html的font-size值 = 不同屏幕/不同的html的font-size值	
var Ohtml = document.documentElement;
function getSize(){
	// // 获取手机屏幕的宽度
	// var windowWidth = Ohtml.offsetWidth;
	// // 当屏幕大于640的时候，让根目录的fontsize就等于640下面对应的值
	// if(windowWidth >= 1200){
	// 	Ohtml.style.fontSize = '100px';
	// }else if(windowWidth <= 320){
	// 	// 当屏幕大于320的时候，让根目录的fontsize就等于320下面对应的值
	// 	Ohtml.style.fontSize = '20px';
	// }else{
	// 	Ohtml.style.fontSize = windowWidth/(1200/100) + 'px';
	// }
	// 	
		var windowWidth = Ohtml.offsetWidth;
		// 当屏幕大于640的时候，让根目录的fontsize就等于640下面对应的值
		if(windowWidth >= 1920){
			Ohtml.style.fontSize = '100px';
		}
		// else if(windowWidth <= 320){
		// 	// 当屏幕大于320的时候，让根目录的fontsize就等于320下面对应的值
		// 	Ohtml.style.fontSize = '10px';
		// }
		else{
			var width = windowWidth/(1920/100)
			if( width < 80) {
				width = 80
			}
			Ohtml.style.fontSize = width + 'px';
		}
		

	// if(windowWidth<800){
	// 	$(".r_content div").css("font-size","16px")
	// }
	// window.wavesufer.zoom(0)
	// console.log(window)
	// console.log(window.wavesufer)
	// document.getElementsByTagName('iframe')[0].contentWindow.wavesurfer
	// console.log(document.getElementsByTagName('iframe')[0])
}
// 初始化调用
getSize();
// 在屏幕发生改变的时候去调用
window.addEventListener('resize',getSize);