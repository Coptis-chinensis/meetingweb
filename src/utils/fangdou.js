//防抖
export function debounce (fn, t = 500) {
  let lastTime;
  return function () {
      clearTimeout(lastTime);
      const [that, args] = [this, arguments];
      lastTime = setTimeout(() => {
         fn.apply(that, args);
      }, t);
  }
}
/*xxx.vue中使用
eventName:debounce(function(){
  //do thing
})
*/
// 节流
export function throttle(fn, t = 500) {
  let last;
  let timer;
  return function () {
    let th = this;
    let args = arguments;
    let now = +new Date();
    if (last && now - last < interval) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            last = now;
            fn.apply(th, args);
        }, t);
    } else {
        last = now;
        fn.apply(th, args);
    }
  }
}