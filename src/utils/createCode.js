// 创建随机数
export function createCode() {
  var code = '';
  //设置长度
  var codeLength = 3;
  var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
  for (var i = 0; i < codeLength; i++) {
    //设置随机数范围,这设置为0 ~ 36
    var index = Math.floor(Math.random() * 9);
    //字符串拼接 将每次随机的字符 进行拼接
    code += random[index];
  }
  //将拼接好的字符串赋值给展示的code
  return code
}