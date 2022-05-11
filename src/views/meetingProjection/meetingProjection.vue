<template>
  <div class="card-bg" :style="{backgroundImage:bg}" @click="requestFullScreen($event)">
    <!-- 头部信息 -->
    <div class="header">
      <!-- 如果没有副标题 -->
      <span v-if="title1 == ''" class="span8">{{title | titleCut}}</span>
      <!-- 如果有副标题 -->
      <span v-if="title1 != ''" class="titleSpan span8">{{title | titleCut}}</span><br>
      <span v-if="title1 != ''" class="title1Span span10">{{title1}}</span>
      <div class="control">
        <!-- 用户信息 -->
        <div class="userInfo" @click="changeShow('userInfo')">
          <div style="margin-top: 0.1rem; float: left">
            <img style="margin-right: 0.1rem; width: 0.33rem;"
                 src="../../assets/meetingProjection/user_logo.png" />
          </div>
          <span>{{userInfo.name}}</span>
          <img style="margin-left: 0.1rem; width: 0.12rem" v-if="showInfo == '1'"
               src="../../assets/up_logo.png" />
          <img style="margin-left: 0.1rem; width: 0.12rem" v-else 
               src="../../assets/down_logo.png" />
        </div>
        <!-- 更换背景 -->
        <div class="icon" @click="changeShow('BackgroundChange')" style="margin-top: 0.03rem">
          <el-tooltip class="item" effect="dark" content="更换背景" placement="bottom">
            <img src="../../assets/meetingProjection/bgc_logo.png" style="width: 0.35rem" />
          </el-tooltip>
        </div>
        <!-- 字体大小 -->
        <div class="icon" @click="changeShow('Typeface')" style="margin-top: 0.03rem">
          <el-tooltip class="item" effect="dark" content="字体大小" placement="bottom">
            <img src="../../assets/meetingProjection/typeface_logo.png" style="width: 0.35rem" />
          </el-tooltip>
        </div>
        <!-- 清屏 -->
        <div class="icon" @click="recordContent=[]" style="margin-top: 0.03rem">
          <el-tooltip class="item" effect="dark" content="清屏" placement="bottom">
            <img src="../../assets/meetingProjection/clean_logo.png" style="width: 0.35rem" />
          </el-tooltip>
        </div>
        <div class="btn btn4" @click="showCloseWin">
          <div class="btnImg">
            <img style="height: 0.17rem;" src="../../assets/meetingTransfer/end_logo.png">
            退出投屏
          </div>
        </div>
      </div>
    </div>
    <!-- 会议转写内容 -->
    <div class="transfer-container" ref="transferContainer" :style="{fontSize:fontSize/100+'rem'}" @click="isSettingEdit=false">
      <span class="transferSpan" v-for="(item,index) of recordContent"
            @dblclick="dbclickToEdit(item, $event)" @blur="blurToFinish(item, $event)"
            :key="index" :class="{finalText:item.v2t!='v2t'}">{{item.transferText}}</span>
      <!-- <span class="transferSpan">喂喂喂喂一三四五六一三四五六第一三第四第五第六第七第八第一三第四第五第六第七第八初一初二十三十四十五十六四十九吧初一初二十三十四十五十六四十九吧星期三星期四星期五休息行吗星期三星期四星期五休息行吗你觉得我会大冬天的开小风扇吗你觉得我会大冬天的开小风扇吗我以为是这个我以为是这个一二三四五六七八一二三四五六七八</span> -->
    </div>
    <!-- 创建人信息展示框 -->
    <div class="meetingCard userInfoDialog" v-if="showInfo == '1'">
      <div class="header">
        <span>参会人信息</span>
      </div>
      <el-form :model="userInfo">
        <el-form-item label="参会人姓名" prop="title">
          <el-input v-model="userInfo.name" placeholder="选填，请输入2-6位字符" clearable></el-input>
        </el-form-item>
        <el-form-item label="参会人职位" prop="title1">
          <el-input v-model="userInfo.job" placeholder="选填，请输入6-16位字符" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 更换背景框 -->
    <div class="meetingCard backgroundDialog" v-if="showInfo == '2'">
      <div class="backgroundImg">
        <img src="../../assets/meetingProjection/bg-small_01.png" data-src="bg01" alt="宇宙极光"
              @click.stop="changeBackGround">
        <p>极光</p>
      </div>
      <div class="backgroundImg">
        <img src="../../assets/meetingProjection/bg-small_05.png" data-src="bg05" alt="商务灰"
              @click.stop="changeBackGround">
        <p>商务灰</p>
      </div>
      <div class="backgroundImg">
        <img src="../../assets/meetingProjection/bg-small_04.png" data-src="bg04" alt="酷炫黑"
              @click.stop="changeBackGround">
        <p>酷炫黑</p>
      </div>
      <div class="backgroundImg">
        <img src="../../assets/meetingProjection/bg-small_02.png" data-src="bg02" alt="山河风光"
              @click.stop="changeBackGround">
        <p>高山</p>
      </div>
      <div class="backgroundImg">
        <img src="../../assets/meetingProjection/bg-small_06.png" data-src="bg06" alt="深灰蓝"
              @click.stop="changeBackGround">
        <p>深灰蓝</p>
      </div>
      <div class="backgroundImg">
        <img src="../../assets/meetingProjection/bg-small_03.png" data-src="bg03" alt="渐变风格"
              @click.stop="changeBackGround">
        <p>渐变</p>
      </div>
    </div>
    <!-- 文字大小框 -->
    <div class="meetingCard typeFaceDialog" v-if="showInfo == '3'">
      <div class="content3">
        <CardSetting v-model="fontSize" :minNum="68" :maxNum="74"></CardSetting>
      </div>
    </div>
    <!-- 置顶按钮 -->
    <div @click="toTheUp" class="downDialog" v-show="gunDong">
      <img src="../../assets/meetingTransfer/up.png" />
      <span>返回顶部</span>
    </div>
    <!-- 置底按钮 -->
    <div @click="toTheBottom" class="downDialog" v-show="!gunDong">
      <img src="../../assets/meetingTransfer/down.png" />
      <span>返回底部</span>
    </div>
    <!-- 投屏退出 -->
    <Dialog
      title="投屏退出"
      okTxt="确定"
      noTxt="取消"
      width="5rem"
      :visible="isClose"
      :cancel="hideCloseWin"
      :upload="setWebProjection">
      <div style="margin-bottom: 0.6rem">
        <h6 style="font-weight: bold;margin-bottom: 0.1rem">确定退出投屏模式？</h6>
        <p>会议转写内容在'会议管理'中查看。</p>
      </div>
    </Dialog>
  </div>
</template>

<script>
require('../../js/rem');
import Global from '../../api/Global'
import Dialog from '../../components/dialog.vue'
import CardSetting from '../setting/components/cardSetting.vue'
import {escapeStringHTML} from '../../utils/util'//记得带上{}花括号
import { ask_getInfoByMeetingId, ask_setWebProjection, ask_uploadTempPhoto, ask_updateTransferText, ask_checkRecord } from '../../api/meeting'

export default {
  components:{
    CardSetting, Dialog
  },
  data: function () {
    return {
      id: this.$route.query.id || query,  //会议ID
      isClose: false, // 结束投屏框是否显示
      recordContent: [], //会议转写内容
      title: '', // 会议的title
      title1: '', // 会议的副标题
      userInfo: {
        name: '',
        job: ''
      }, // 用户信息
      maxLength: 140,//最大字数
      maxLength1: [138, 143, 148, 153],//不是全屏时,不同字体对应的最大字数
      maxLength2: [153, 158, 163, 168],//全屏时,不同字体对应的最大字数
      fontSize: 70, // 字体大小
      showInfo: '0', // 显示框
      showInfoStatus:{
        AllNone: '0', // 全部关闭
        userInfo: '1',
        BackgroundChange: '2', // 更换背景
        Typeface: '3', // 字体大小
      },
      quanping: false, // 是否为全屏
      isDarkBg: false,//深色背景改变class
      gunDong: true, // 会议是否自动滚动到最下面
      bgUrl: { //背景图
        bg01: 'url(' + require('../../assets/meetingProjection/bg_01.png') + ')',
        bg02: 'url(' + require('../../assets/meetingProjection/bg_02.png') + ')',
        bg03: 'url(' + require('../../assets/meetingProjection/bg_03.png') + ')',
        bg04: 'url(' + require('../../assets/meetingProjection/bg_04.png') + ')',
        bg05: 'url(' + require('../../assets/meetingProjection/bg_05.png') + ')',
        bg06: 'url(' + require('../../assets/meetingProjection/bg_06.png') + ')',
      },
      bg: 'url(' + require('../../assets/meetingProjection/bg_01.png') + ')', //默认背景
    }
  },
  mounted(){
    window.addEventListener('beforeunload', e => this.beforeunloadFn())
    window.addEventListener('unload', e => this.unloadFn())
    // 添加滚动条监听事件
    window.addEventListener('scroll', this.handleScroll, true)
    this.websocketTest()
    this.getMeetinginfo()
    this.getOldProjectionInfo()
  },
  destroyed() {
    // 离开该页面需要移除这个监听的事件，不然会报错
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('beforeunload', e => this.beforeunloadFn());
    window.removeEventListener('unload', e => this.unloadFn());
  },
  watch:{
    'recordContent': function () {
      // this.checkMaxLength(this.fontSize)
    },
    'fontSize': function() {
      if(this.fontSize == undefined){
        this.$nextTick(function () {
          this.$message.info("字体大小不能为空")
          this.fontSize = 70
        })
      }
      var num = (this.fontSize - 68) / 2
      this.maxLength = this.maxLength1[num]
      // this.$nextTick(function () {
      //   this.checkMaxLength(this.fontSize)
      // })
    },
    'quanping': function() {
      if (this.quanping) { // 如果是全屏
        var num = (this.fontSize - 68) / 2
        this.maxLength = this.maxLength2[num]
      } else { // 如果不是全屏
        var num = (this.fontSize - 68) / 2
        this.maxLength = this.maxLength1[num]
      }
    }
  },
  filters: {
    // 名称只取前14位
    titleCut: function (val) {
      return val.length > 14 ? val.substring(0, 14) : val
    }
  },
  methods:{
    // 保存滚动值，这是兼容的写法
    handleScroll () {
      if(this.$refs.transferContainer != undefined) {
        let all = this.$refs.transferContainer.scrollHeight; // 滚动条全长度
        let top = Math.ceil(this.$refs.transferContainer.scrollTop); // 滚条距上的长度
        let print = this.$refs.transferContainer.clientHeight; // 滚条长度
        if((all - top - print) <= 0) {
          this.gunDong = true
        } else {
          this.gunDong = false
        }
      }
    },

    // 跳到底部
    toTheBottom(){
      this.gunDong = true
      var target = this.$refs.transferContainer
      if (target) {
        target.scrollTop = target.scrollHeight
      }
    },

    // 跳到底部
    toTheUp(){
      this.gunDong = false
      var target = this.$refs.transferContainer
      if (target) {
        target.scrollTop = 0
      }
    },

    //双击编辑
    dbclickToEdit: function (item, e) {
      var target = $(e.target)
      target.attr('contentEditable', 'true').focus()
      target.css('outline', 'none')
      target.css('border-bottom', '1px solid #212c5e')
    },

    //失去焦点后自动保存
    blurToFinish: function (item, e) {
      var $target = $(e.target)
      $target.html(escapeStringHTML($target.html()))
      $target.removeAttr('contentEditable')
      $target.css('border-bottom', '0px')
      var form = new FormData()
      form.append("recordID", item.id)
      form.append("transferText", escapeStringHTML($target.html()))
      form.append("tagStatus", item.tagStatus)
      ask_updateTransferText(form)

      var form1 = new FormData()
      form1.append("recordID", item.id)
      form1.append("transferText", escapeStringHTML($target.html()))
      form1.append("meetingID", this.id)
      ask_checkRecord(form1)
    },

    unloadFn(){
      this._gap_time=new Date().getTime()-this._beforeUnload_time;
      if(this._gap_time <= 3){ // 关闭浏览器
        localStorage[this.id] = "关闭"
        // localStorage.setItem("touPingStatus", "关闭")
      } else { // 刷新浏览器
        // localStorage.setItem("touPingStatus", false)
      }
    },

    beforeunloadFn () {
      this._beforeUnload_time=new Date().getTime();
    },
      
    // 全屏展示
    requestFullScreen (e) {
      if (document.body.scrollHeight == window.screen.height) { // 已经是全屏了
        this.quanping = true
        return
      }
      this.quanping = false
      let element = document.body
      var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen
      if (requestMethod) {
        requestMethod.call(element)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        var wscript = new ActiveXObject('WScript.Shell')
        if (wscript !== null) {
          wscript.SendKeys('{F11}')
        }
      }
      if ($(element).style != undefined) {
        $(element).style.overflow = 'hidden'
      }
    },

    // 超过的字体裁剪掉
    // checkMaxLength: function (i) {
    //   var length = 0
    //   this.recordContent.forEach(value => length += value.transferText.length)
    //   if (length > this.maxLength) {
    //     var overTotalLength = length - this.maxLength
    //     var overLength = 23//默认减掉25个字符，包括标点
    //     if (i == 68) {
    //       overLength = 25
    //     }
    //     if (i == 70) {
    //       overLength = 24
    //     }
    //     var num = Math.ceil(overTotalLength / overLength)
    //     overLength = num * overLength
    //     while (overLength > 0) {
    //       var first = this.recordContent[0]
    //       if (first.transferText.length > overLength) {
    //         first.transferText = first.transferText.substring(overLength, first.transferText.length)
    //         break
    //       }
    //       var topText = this.recordContent.shift()
    //       overLength -= topText.transferText.length
    //     }
    //   }
    // },

    // 展示设置框
    changeShow(s) {
      if(s == 'userInfo' && this.showInfo !== '1') {
        this.showInfo = this.showInfoStatus.userInfo
      } else if(s == 'BackgroundChange' && this.showInfo !== '2'){
        this.showInfo = this.showInfoStatus.BackgroundChange
      } else if(s == 'Typeface' && this.showInfo !== '3'){
        this.showInfo = this.showInfoStatus.Typeface
      } else if(this.showInfo == this.showInfoStatus[s]){
        this.showInfo = this.showInfoStatus.AllNone
      }
    },

    // 关闭提示弹窗
    showCloseWin () {
      this.isClose = true
    },

    // 显示提示弹窗
    hideCloseWin () {
      this.isClose = false
    },

    // 获取原投影数据
    getOldProjectionInfo () {
      this.userInfo.name = window.oUser.userName
      this.userInfo.job = '' // 职位
    },

    // 连接websocket
    websocketTest() {
      let that = this;
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        this.socket = new WebSocket(Global.domain.replace("http", "ws") + "/projection/" + sessionStorage.cid);
        this.socket.onopen = function () {
          console.log("Socket 已打开");
        };
        //获得消息事件
        this.socket.onmessage = function (msg) {
          var data = JSON.parse(msg.data);
          switch (data.CMD) {
            case "transferText":
              that.subTransfer(data);
              break;
            case "clearRecord":
              that.subTransfer(data);
              break;
            case "updateProjectionInfo":
              that.getMeetinginfo()
              break;
            case "projectionText":
              that.subTransfer(data);
              break;
            default :
              break;
          }
        };
        //关闭事件
        this.socket.onclose = function () {
        console.log("Socket已关闭");
        };
        //发生了错误事件
        this.socket.onerror = function () {
          //此时可以尝试刷新页面
          that.websocketTest()
        }
      }
    },

    // 实时转写
    subTransfer(client) {
      var that = this
      var msg = client
      if (msg.CMD == 'transferText') {
        var flag = msg.resp == 'v2t'
        var word = msg.transferText
        if (!that.v2tFlag) {
          if (that.recordContent.length > 0) {
            that.recordContent.pop()
          }
        }
        that.recordContent.push({id: msg.recordID, transferText: word, v2t: msg.resp, tagStatus: msg.tagStatus})
        if (flag) {
          that.v2tFlag = true
        } else {
          that.v2tFlag = false
        }
      }
      else if (msg.CMD == 'projectionText') {
        that.name = msg.name
        that.job = msg.job
        that.introduce = msg.introduce
      } else if (msg.CMD == 'projectionHeadPhoto') {
        that.headPhotoPath = msg.httpPath
      } else if (msg.CMD == 'clearRecord') {
        that.recordContent = []
      } else if (msg.CMD == 'changeTransferText') {
        var word = msg.transferText
        var recordID = msg.recordID
        for (var recordContentElement of that.recordContent) {
          if (recordContentElement.id == recordID) {
            recordContentElement.transferText = word
          }
        }
      } else if (msg.CMD == 'closeProjection') {
        that.setWebProjection()
      }
      // 滚动到最底部
      if(that.gunDong) {
        that.$nextTick(function () {
          var target = that.$refs.transferContainer
          if (target) {
            target.scrollTop = target.scrollHeight
          }
        })
      }
    },

    /**
     * 获取会议内容
     */
    getMeetinginfo() {
      var form = {
        "meetingId": this.id
      }
      ask_getInfoByMeetingId(form).then(res => {
        console.log(res);
        if (res.success) {
          this.title = res.result.title
          if (res.result.title1 != '') { // 如果存在副标题
            this.title1 = res.result.title1
          } else {
            this.title1 = ''
          }
        }
      })
    },

    // 退出网页投影
    setWebProjection () {
      var form = new FormData()
      form.append("meetingId", this.id)
      form.append("status", false)
      ask_setWebProjection(form).then(res => {
        if (res.success) {
          localStorage[this.id] = "关闭"
          window.close()
        }
      })

    },

    // 改变背景图片
    changeBackGround (e) {
      let event = e || window.event
      let src = event.target.getAttribute('data-src')
      this.bg = this.bgUrl[src]
    },
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .dialog-footer{
    margin-left: 150px;
  }

  .card-bg {
    min-width: 1440px;
    position: relative;
    height: 100%;
    background-color: #273b71;
    .meetingCard{
      position: absolute;
    }
    .transfer-container{
      padding-left: 1rem;
      padding-right: 1rem;
      margin: 0 auto;
      height: 2.5rem;
      line-height: 2;
      width: 100%;
      height: calc(100% - 120px);
      overflow-y: auto;
      background-color: rgba(0, 0 , 0, 0.55);
      .transferSpan{
        color: #fff;
      }
    }
    
    .userInfoDialog{
      top: 90px;
      right: 230px;
      width: 300px;
      height: 250px;
      border-radius: 5px;
      background-color: #fff;
      .header{
        text-align: left;
        padding-left: 20px;
        padding-right: 20px;
        width: 100%;
        line-height: 60px;
        height: 60px;
        font-size: 20px;
        font-weight: 700;
        color: #363757;
        border-bottom: 1px solid #e3e3e9;
      }
      ::v-deep .el-form{
        margin-left: 20px;
      }
      ::v-deep .el-form-item{
        width: 250px;
        margin-bottom: 0px;
      }
      ::v-deep .el-form-item__content{
        width: 250px;
      }
    }

    .backgroundDialog{
      background-color: #fff;
      border-radius: 5px;
      top: 80px;
      width: 330px;
      right: 110px;
      .backgroundImg{
        padding: 10px;
        float: left;
        text-align: center;
      }
    }
    
    .typeFaceDialog{
      top: 80px;
      right: 165px;
      .content3{
        .cardSetting{
          height: 40px;
          ::v-deep .el-input-number{
            position: absolute;
            right: 0px;
          }
        }
      }
    }

    .downDialog{
      position: absolute;
      right: 0.4rem;
      bottom: 0.2rem;
      display: flex;
      font-size: 0.12rem;
      color: #7A7A87;
      background-color: #E5E5EB;
      width: 0.6rem;
      height: 0.6rem;
      line-height: 0.6rem;
      justify-content: center;
      cursor: pointer;
      img{
        position: absolute;
        height: 0.1rem;
        float: right;
        margin-top: 0.1rem;
      }
      span{
        position: absolute;
        float: right;
        margin-top: 0.1rem;
      }
    }

    .header{
      height: 120px;
      line-height: 120px;
      text-align: center;
      .titleSpan{
        line-height: 100px;
      }
      .title1Span{
        position: absolute;
        top: 30px;
      }
      .control{
        height: 120px;
        display: flex;
        align-items: center;
        top: 0px;
        right: 20px;
        position: absolute;
        .icon{
          cursor: pointer;
          display: flex;
          align-items: center;
          border-radius: 0.05rem;
          padding: 0 0.1rem;
          margin: 0 0.05rem;
          height: calc(100% - 70px);
          &:hover{
            background-color: #f0f2f740;
          }
        }
        .userInfo{
          font-size: 0.2rem;
          cursor: pointer;
          margin-right: 40px;
          height: 110px;
          line-height: 110px;
          float: left;
          padding-top: 5px;
          color: #fff;
          .el-icon-user{
            font-size: 25px;
          }
          .el-icon-caret-bottom{
            margin-left: 5px;
            color: #afb2c1;
          }
        }
      }
    }
  }
</style>
