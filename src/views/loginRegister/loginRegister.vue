<template>
  <div class="card-bg">
    <div class="right-bg">
      <div class="login-card">
        <div class="login-span1">
          <span>欢迎使用</span><br>
          <span>优浪语音转写系统！</span><br>
        </div>
        <div class="elForm">
          <el-form ref="login" :model="login" :hide-required-asterisk="true">
            <el-form-item>
              <span class="span9">请输入用户名</span>
              <el-input v-model="login.userName"></el-input>
            </el-form-item>
            <el-form-item prop="pass" :rules="[
                { validator: validatePass, trigger: 'blur,change'},
                { min: 1, max: 20, message: '密码的长度应在6~20位字符之间,以字母开头', trigger: 'blur,change' }]">
              <span class="span9">请输入密码</span>
              <el-input v-model="login.password" type="password" @keyup.enter.native="loginIn"></el-input>
              <!-- <el-input autocomplete="nope" v-model="login.password" type="password" @keyup.enter.native="loginIn"></el-input> -->
            </el-form-item>
            <el-form-item>
              <el-checkbox style="float: left; color: #7c8085;" v-model="rememberme">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
              <div class="btn btn1" @click="loginIn">
                登 录
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {ask_login} from '../../api/user'
import {ask_getsubsection} from '../../api/subsection'
import {setCookie, getCookie, CheckForm, delCookie} from "../../utils/util"; //记得带上{}花括号
import {ask_addClusterdbr, ask_findClusterdbList} from '../../api/cluster'
import { ask_config } from '../../api/administr';

export default {
  data: function() {
    return {
      isLogin: true, // 是否显示登录表单
      registerError: "", // 注册错误消息
      rememberme: false, //勾选记住密码框
      form: {
        //表单数据
        userName: "",
        password: "",
        passwordConfirm: "",
        mail: "",
        telephoneID: "",
        isShowUsername: false,
        isShowPassword: false,
        isShowPassConfirm: false
      },
      login: {
        //记住登录信息
        userName: "",
        password: ""
      }
    };
  },
  components: {},
  methods: {
    // 表单验证，密码是否包含非法字符
    validatePass: function(rule, value, callback) {
      if (!this.login.password) {
        callback(new Error("密码为空或含有非法字符！"));
      } else if (CheckForm(value) === false) {
        callback(new Error("密码含有非法字符或未以字母开头！"));
      } else {
        callback();
      }
    },

    // 记住密码，则填写上一次保存的密码
    setLoginForm() {
      var rmb = getCookie("rmb");
      var username = getCookie("username");
      var password = getCookie("password");
      if (rmb == "true") {
        this.login.userName = username;
        this.login.password = password;
        this.rememberme = true;
      }
    },
    // 显示登录表单
    goLogin: function() {
      this.isLogin = true;
      // 移除登录表单的校验结果
      this.$refs.login.clearValidate();
    },
    // 显示注册表单
    goRegister: function() {
      this.isLogin = false;
      // 移除登录表单的校验结果
      this.$refs.form.clearValidate();
    },
    // 登录
    loginIn: function() {
      // 先进行表单验证，通过才发送请求
      this.$refs.login.validate(isValid => {
        if (isValid) {
          var form = new FormData()
          form.append('status', "login")
          form.append('userName', this.login.userName)
          form.append('password', this.login.password)
          form.append('cid', this.$route.query.Device)
          form.append('cName', this.$route.query.Name)
          ask_login(form).then(res => {
            if (res.success) {
              // 是否记住密码
              if (this.rememberme) {
                setCookie("rmb", true);
                setCookie("username", this.login.userName);
                setCookie("password", this.login.password);
              } else {
                delCookie("rmb");
                delCookie("username");
                delCookie("password");
              }
              // 将token和oUser存到服务器里
              localStorage.setItem('token', res.result.token)
              localStorage.setItem('oUser', JSON.stringify(res.result.userinfo))
              sessionStorage.setItem('cid', this.$route.query.Device)
              sessionStorage.setItem('cName', this.$route.query.Name)
              this.getConfig()
              // 获取配置参数
              this.getParameter(res.result.userinfo.userID)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      });
    },

    //获取帐号权限
    getAthentic(uid) {
      this.$router.push({path: "/meeting/mainInterface"});
    },

    // 查询当前用户是否有声纹库 有的话返回 没有的话创建
    SearchDbList(){
      ask_findClusterdbList().then(res => {
        if(res.result.length > 0){ // 有声纹库
          this.voicedbID = res.result[0].voicedbId
          this.voicedbName = res.result[0].voicedbName
          return
        } else { // 没有声纹库
          // 创建声纹库
          var form = new FormData()
          form.append("voicedbName", window.oUser.userName + '的声纹库')
          ask_addClusterdbr(form).then(res =>{
            ask_findClusterdbList().then(res =>{
              this.voicedbID = res.result[0].voicedbId
              this.voicedbName = res.result[0].voicedbName
            })
          })
        }
      })
    },

    //获取配置参数
    getParameter(id){
      let that=this;
      ask_getsubsection(id).then(res => {
        if (res.success) {
          localStorage.setItem('setUp', JSON.stringify(res.result))
          this.SearchDbList()
          that.getAthentic() //获取帐号权限
        }
      })
    },

    // 获取单机/网络
    getConfig(){
      ask_config().then(res => {
        if(res.success){
          sessionStorage.setItem('meetingType', res.result.meetingType) 
        }
      })
    }
  },
  created() {
    if (screen.width < 1024) {
      this.$alert(
        "您的显示分辨率过低，可能会导致显示错误，请选择更高的显示分辨率。",
        "兼容提示",
        {
          confirmButtonText: "确定",
          callback: action => {}
        }
      );
    }
  },

  mounted() {
    console.log(this.$route.query);
    this.setLoginForm();
  }
};
</script>

<style lang="scss">
// input:-webkit-autofill {
//   -webkit-box-shadow: 0 0 0 20px rgba(0,11,24,0) inset;
// }

</style>

<style lang="scss" scoped>
  .card-bg {
    min-width: 1334px;
    width: 100%;
    height: 100%;
    position:fixed;
    background-image: url("../../assets/loginRegister/login_bg.png");
    background-size:100% 100%;
    background-color: #010753;
    .right-bg{
      position: relative;
      float: right;
      height: 100%;
      width: 47%;
      background-color: rgba(0,11,24,0.5);
      .login-card {
        width: 60%;
        margin: auto;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .login-span1{
          margin-top: 40px;
          text-align: left;
          height: 80px;
          font-size: 32px;
          letter-spacing: 5px;
          color: #c7c8c9;
          padding-left: 40px;
        }
        .elForm{
          height: calc(100% - 170px);
          width: 82%;
          margin-left: 9%;
          vertical-align: middle;
          .el-form{
            margin-top: 50px;
            ::v-deep .el-input__inner{
              padding-left: 0px;
              color: #fefeff;
              border: none;
              border-radius: 0px;
              border-bottom: 1px solid #48525d;
              background-color: rgba(0,11,24,0) !important;
            }

            ::v-deep .el-checkbox__inner{
              background-color: rgba(0,11,24,0) !important;
            }
            
            .btn{
              font-family: MicrosoftYaHei-Bold !important;
              margin-top: 20px;
              width: 100%;
              height: 50px;
              line-height: 50px;
              border-radius: 10px;
              margin-right: 0px;
            }
          }
        }
      }
    }
  }
</style>
