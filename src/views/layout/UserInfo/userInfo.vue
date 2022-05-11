<template>
  <div id="userInfo" class="userInfo">
    <div class="user-headPhoho">
      <div class="userImg">
        <img :src="logoimg" />
      </div>
      <div class="avator_btn" @click="openEditDialog">上传头像</div>
    </div>
    <div v-if="showUser" class="user">
      <span>{{userName}}</span>
      <div style="padding-top:0.05rem;">
        <div class="user-operation" @click="changePassShow = true">
          <img class="IMG" :src="passimg" />
          <span class="span1">修改密码</span>
        </div>
        <div class="shuxian"></div>
        <div class="user-operation" @click="exit">
          <img class="IMG" :src="exitimg" />
          <span class="span1">退出</span>
        </div>
      </div>
    </div>
    <!-- 修改密码弹框 -->
    <Dialog
      title="修改密码"
      width="5rem"
      okTxt="确认"
      noTxt="取消"
      :visible="changePassShow"
      :cancel="cancelChangePass"
      :upload="uploadChangePass">
      <div class="userInfoDialog">
        <div class="user_avator">
          <img :src="logoimg" />
        </div>
        <div class="userSpan" v-if="oUser != ''">
          <span>{{oUser.userName}}</span>
        </div>
        <div class="passwordchange">
          <el-form ref="account" :model="account" class="formitem" :rules="accountRules">
            <el-form-item label="原始密码：" prop="pswbefore" :rules="[{ validator: validatePass},
             { min: 6, max: 20, message: '密码的长度应在6~20位字符之间', trigger: 'blur' }]">
              <el-input v-model="account.pswbefore" placeholder="原始密码" clearable autocomplete="off" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="pswNow" :rules="[{ validator: validatePass1},
            { min: 6, max: 20, message: '密码的长度应在6~20位字符之间', trigger: 'blur' }]">
              <el-input v-model="account.pswNow" type="password" placeholder="新密码" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="pswNowagain" :rules="[{ validator: validatePass2}]">
              <!-- validate-event属性的作用是: 输入时不触发表单验证.提交时再验证,你也可以设置成动态验证 -->
              <el-input v-model="account.pswNowagain" type="password" placeholder="重新输入新密码" autocomplete="off" :validate-event="false"
                        @keyup.enter.native="uploadChangePass"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </Dialog>
    <!-- 编辑头像弹框 -->
    <Dialog
      title="编辑头像"
      width="420px"
      okTxt="确定"
      noTxt="取消"
      :visible="changePohtoShow"
      :cancel="closeEditDialog"
      :upload="editAvator">
      <div class="clearfix">
        <div class="cropper_wrapper">
          <div class="cropper_main" id="myCropper-workspace">
            <div class="myCropper-words" v-if="!imgCropperData.imgSrc">请点击按钮选择图片进行裁剪</div>
            <img ref="avatarImage" :src="imgCropperData.imgSrc"/>
          </div>
          <div class="cropper_toolbar">
            <input class="choose_image" type="file" title="" ref="inputer" :accept="imgCropperData.accept"
                   @change="handleFile"/>
            <span class="reset_image">重新上传</span>
            <div class="cropper_btngroup">
              <i class="el-icon-remove-outline" @click="zoom(-0.1)"></i>
              <i class="el-icon-circle-plus-outline" @click="zoom(0.1)"></i>
              <i class="el-icon-refresh" @click="rotate"></i>
            </div>
          </div>
        </div>
        <div class="avatar_perview_wrapper">
          <div class="avatar_preview"></div>
          <p class="avator_preview_text">头像预览</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Bus from '../../../js/bus'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css' // 剪辑插件
import Dialog from '../../../components/dialog.vue'
import {CheckForm} from '../../../utils/util'//记得带上{}花括号
import {ask_exit, ask_updatePassword, ask_uploadPhoto, ask_update } from '../../../api/user'

export default {
  props:{
    showLeftMenu: Boolean
  },
  components:{
    Dialog
  },
  data() {
    return {
      changePohtoShow: false, // 是否显示修改头像框
      changePassShow: false, // 是否显示修改密码弹框
      showUser: true,
      cropper: {}, //剪辑插件
      account: {  //账号信息
        pswbefore: '',
        pswNow: '',
        pswNowagain: ''
      },
      accountRules: {},
      imgCropperData: { //头像剪辑数据
        accept: 'image/gif, image/jpeg, image/png, image/bmp',
        imgSrc: ''
      },
      logoimg: window.oUser
              ? (window.oUser.headPhotoPath != null 
                  ? window.oUser.headPhotoPath + "?" + new Date().getTime()
                  : require('../../../assets/avator.png'))
              : require('../../../assets/avator.png'),
      userName: window.oUser ? window.oUser.userName : '',
      passimg: require('../../../assets/mainInterFace/passimg.png'),
      exitimg: require('../../../assets/mainInterFace/exitimg.png'),
      oUser: window.oUser ? window.oUser : '',
    }
  },
  watch:{
    'showLeftMenu'() {
      if (this.showLeftMenu) {
        setTimeout(() => {
          this.showUser = this.showLeftMenu
        }, 500)
      } else {
        this.showUser = this.showLeftMenu
      }
    }
  },
  created(){
    Bus.$on('changePhoto', (url) => {
      this.logoimg = url || defaultHead
    });
    Bus.$on('changeUserName', (userName) => {
      this.username = userName
    });
  },
  mounted(){
  },
  methods:{

    // 表单验证，密码是否包含非法字符
    validatePass: function (rule, value, callback) {
      // $('#pswbeforeerror').hide()
      if (value === '') {
        callback(new Error('密码为空或含有非法字符！'));
      } else if (CheckForm(value) === false) {
        callback(new Error('密码为空或含有非法字符'));
      } else {
        callback();
      }
    },

    // 表单验证，新密码是否和老密码一样
    validatePass1: function (rule, value, callback) {
      if (value === '') {
        callback(new Error('密码为空或含有非法字符！'));
      } else if (CheckForm(value) === false) {
        callback(new Error('密码为空或含有非法字符'));
      } else if (value == this.account.pswbefore) {
        callback(new Error('新密码不可和旧密码一样'));
      } else {
        callback();
      }
    },

    // 表单验证1，密码是否和新密码框一样
    validatePass2 (rule, value, callback) {
      if (value === '') {
        callback(new Error('密码为空或含有非法字符！'));
      } else if (CheckForm(value) === false) {
        callback(new Error('密码为空或含有非法字符'));
      } else if (value !== this.account.pswNow) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    },

    // 打开头像编辑面板
    openEditDialog() {
      this.imgCropperData.imgSrc = this.logoimg
      this.changePohtoShow = true
      this.$nextTick(() => {
        this.initCropper()
      })
    },

    // 关闭头像编辑面板
    closeEditDialog() {
      this.changePohtoShow = false
      this.cropper.destroy && this.cropper.destroy();
    },

    // 初始化头像剪裁
    initCropper () {
      // 初始化裁剪区域
      var image = this.$refs.avatarImage;
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        autoCropArea: 1,
        preview: '.avatar_preview',
      });
    },

    // 上传新头像
    editAvator() {
      let $imgData = this.cropper.getCroppedCanvas()
      let imgBase64Data = $imgData.toDataURL('image/png');
      
      // 截取字符串
      let photoType = imgBase64Data.substring(imgBase64Data.indexOf(",") + 1);
      //进制转换
      const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, {
          type: contentType
        });
        return blob;
      }
      const contentType = 'image/jepg';
      const b64Data2 = photoType;
      const blob = b64toBlob(b64Data2, contentType);
      // 构造上传图片的数据
      let form = new FormData();
      form.append("file", blob, "avatar.png")
      form.append("userid", window.oUser ? window.oUser.userID : '')
      ask_uploadPhoto(form).then(res => {
        if (res.success) {
          this.$message.success("头像修改成功")
          this.headPhotoPath = res.message + '?time=' + Date.now()
          Bus.$emit('changePhoto', this.headPhotoPath)
          window.oUser.headPhotoPath = res.message
          // location.reload();//上传成功后自动刷新页面，刚上传的头像显示出来
          // location.reload(false)
        } else{
          this.$message.error("头像修改失败")
        }
        this.closeEditDialog()
      })
    },

    // 选择文件
    handleFile (e) {
      let _this = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = inputDOM.files[0];
      // 判断文件格式
      if (this.imgCropperData.accept.indexOf(this.file.type) == -1) {
        this.$message.error('您选择的图片格式不正确！');
        return;
      }
      // 判断文件大小限制
      if (this.file.size > 5242880) {
        this.$message.error('您选择的图片过大，请选择5MB以内的图片！');
        return;
      }
      var reader = new FileReader();
      // 将图片将转成 base64 格式
      reader.readAsDataURL(this.file);
      // 清空input file中的文件，这样就可以重复选择同一张图片了
      $(inputDOM).val("");
      reader.onload = function () {
        _this.imgCropperData.imgSrc = this.result;
        _this.$nextTick(() => {
          if (_this.cropper.replace) {
            _this.cropper.replace(this.result)
          } else {
            _this.initCropper();
          }
        })
      }
    },

    // 头像编辑时，放大或缩小
    zoom: function (val) {
      this.cropper.zoom && this.cropper.zoom(val)
    },

    // 头像编辑时，旋转图片
    rotate: function () {
      this.cropper.zoom && this.cropper.rotate(45)
    },

    // 关闭修改密码弹框
    cancelChangePass() {
      this.changePassShow = false
      this.$nextTick(() => {
        this.$refs.account.clearValidate();
      });
      this.account = {  //账号信息
        pswbefore: '',
        pswNow: '',
        pswNowagain: ''
      }
    },

    // 修改密码
    uploadChangePass() {
      this.$refs.account.validate((isValid) => {
        if (isValid) {
          var form = new FormData()
          form.append("userID", window.oUser ? window.oUser.userID : '')
          form.append("pswbefore", this.account.pswbefore)
          form.append("pswNow", this.account.pswNow)
          ask_updatePassword(form).then(res => {
            if (res.success) {
              this.$message.success("修改密码成功，请重新登录！")
              localStorage.removeItem('token')
              localStorage.removeItem('oUser')
              this.$router.push({path: '/'})
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    
    // 退出登录
    exit(){
      this.$confirm('确认退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'meeting_confirm',
        cancelButtonClass: 'confirm_cancel',
        confirmButtonClass: 'confirm_btn'
      }).then(() => {
        ask_exit().then(res => {
          if (res.success) {
            localStorage.removeItem('oUser')
            localStorage.removeItem('token')
            localStorage.removeItem('setUp')
            this.$router.push({'path': `/?Device=` + sessionStorage.getItem("cid") + `&Name=` + sessionStorage.getItem("cName")})
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  .clearfix{
    height: 300px;
    .cropper_wrapper {
      float: left;
    }
  }

  .cropper_main {
    width: 250px;
    height: 250px;
    img {
      width: 100%;
      max-width: 100%;
    }
    .myCropper-words {
      width: 100%;
      height: 390px;
      line-height: 390px;
      text-align: center;
      background-color: #CCCCCC;
    }
  }
  .cropper_toolbar {
    margin-top: 8px;
    .choose_image {
      position: absolute;
      width: 56px;
      height: 20px;
      opacity: 0;
      cursor: pointer;
    }
    .reset_image {
      color: #3159B9;
      cursor: pointer;
    }
    .cropper_btngroup {
      float: right;
      i{
        font-size: 20px;
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
  .avatar_perview_wrapper {
    float: right;
    width: 80px;
    .avatar_preview {
      width: 100%;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #CCCCCC;
    }
    .avator_preview_text {
      margin-top: 15px;
      color: #808080;
      font-size: 14px;
      text-align: center;
    }
  }

  .userInfoDialog{
    position: relative;
    .user_avator{
      height: 1.6rem;
      width: 100%;
      img{
        position: absolute;
        left:35%;
        border-radius: 65px;
        width: 1.5rem;
      }
    }
    .userSpan{
      text-align: center;
      width: 100%;
    }
    .passwordchange{
      padding-top: 20px;
      padding-bottom: 30px;
      ::v-deep .el-form-item__label{
        font-size: 0.19rem;
        width: 110px;
      }
      ::v-deep .el-input{
        width: calc(100% - 110px);
      }
      ::v-deep .el-form-item__error{
        margin-left: 110px;
      }
    }
    
  }

  .userInfo {
    width: 3rem;
    height: 1.22rem;
    padding-top: 0.3rem;
    padding-left: 0.17rem;
    display: inline-flex;
    .user-headPhoho{
      display: flex;
      height: 0.6rem;
      width: 0.6rem;
      .userImg{
        border-radius: 50%;
        height: 0.6rem;
        img{
          border-radius: 50%;
          height: 0.6rem;
        }
      }
      .avator_btn {
        display: none;
        position: absolute;
        font-size: 0.14rem;
        border-radius: 50%;
        height: 0.6rem;
        line-height: 0.6rem;
        width: 0.6rem;
        text-align: center;
        color: #f5f5f5;
        background-color: rgba(0, 0, 0, .5);
        cursor: pointer;
      }
      &:hover .avator_btn {
        display: block;
      }
      &:active .avator_btn {
        color: #fff;
        text-decoration: underline;
      }
    }
    .user{
      width: 2rem;
      padding-top: 0.07rem;
      margin-left: 0.17rem;
      font-size: 17px;
      color: #fff;
      .user-operation{
        vertical-align: middle;
        cursor: pointer;
        display: inline-block;
        .IMG{
          // height: 0.15rem;
          height: 14px;
          // margin-top: 0.04rem;
          margin-top: 3px;
          float: left;
        }
      }
      .shuxian{
        margin-left: 16px;
        margin-right: 16px;
        display: inline-block; 
        height: 10px; 
        width: 0.5px;
        background-color: #b5bff2;
      }
    }
  }

</style>