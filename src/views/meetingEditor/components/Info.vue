<template>
  <div class="center">
    <div class="Info">
      <div class="infoHeader">
        <span>会议名称</span>
      </div>
      <div class="infoContent">
        <el-input @change="changeInfo" v-model="info.title"></el-input>
      </div>
    </div>
    <div class="Info">
      <div class="infoHeader">
        <span>会议主题</span>
      </div>
      <div class="infoContent">
        <el-input @change="changeInfo" v-model="info.summary"></el-input>
      </div>
    </div>
    <div class="Info" style="border-right: 1px solid #edeef2;">
      <div class="infoHeader">
        <span>会议时间</span>
      </div>
      <div class="infoContent" style="line-height: 30px !important">
        <span>{{info.startTime}}</span><br>
        <span>{{info.endTime}}</span>
      </div>
    </div>
    <div class="Info">
      <div class="infoHeader">
        <span>参会人员</span>
      </div>
      <div class="infoContent">
        <el-input @change="changeInfo" v-model="info.attendee"></el-input>
      </div>
    </div>
    <div class="Info">
      <div class="infoHeader">
        <span>会议地址</span>
      </div>
      <div class="infoContent">
        <el-input @change="changeInfo" v-model="info.address"></el-input>
      </div>
    </div>
    <div class="Info" style="border-right: 1px solid #edeef2;">
      <div class="infoHeader">
        <span>创建者</span>
      </div>
      <div class="infoContent">
        <span>{{userName}}</span>
      </div>
    </div>
    <div class="Info" style="border-right: 1px solid #edeef2; width: 100%">
      <div class="infoHeader">
        <span>会议标注</span>
      </div>
      <div class="infoContent" style="text-align: left; padding-left: 15px; overflow-y: auto; overflow-x: hidden;">
        <span>{{tagText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {ask_update} from '../../../api/meeting'
import {CheckMeetingName} from '../../../utils/util'//记得带上{}花括号

export default {
  props:{
    info: Object,
    userName: String,
    tagText: String,
  },

  beforeMount(){
    // console.log(this.info.tagText, "?!!");
  },
  methods: {
    // 表单验证，密码是否包含非法字符
    validatePass (value, callback) {
      // $('#pswbeforeerror').hide()
      if (value === '') {
        this.$message.info("会议名称不能为空")
        return false
      } else if (CheckMeetingName(value) === false) {
        this.$message.info("会议名称不能包含特殊字符")
        return false
      } else {
        return true
      }
    },

    // 修改会议信息
    changeInfo() {
      console.log(this.validatePass(this.info.title));
      if(this.validatePass(this.info.title)) {
        var form = new FormData()
        form.append("id", this.info.id)
        form.append("summary", this.info.summary ? this.info.summary : '')
        form.append("attendee", this.info.attendee ? this.info.attendee : '')
        form.append("address", this.info.address ? this.info.address : '')
        form.append("keyword", this.info.keyword ? this.info.keyword : '')
        form.append("title", this.info.title ? this.info.title : '')
        ask_update(form).then(res => {
          if (res.success) {
            this.$message.success(res.message)
          } else {
            this.$message.error('修改失败')
          }
          // this.$emit('getInfo', ['addWaterMarker', this.info.summary])
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.center{
  border-top: 1px solid #edeef2;
  height: 180px !important;
  margin-top: 20px;
  font-size: 15px;
  .Info{
    float: left;
    border-bottom: 1px solid #edeef2;
    height: 60px;
    width: 33.33%;
    .infoHeader{
      float: left;
      border: 1px solid #edeef2;
      border-top: none;
      background-color: #fafbfd;
      text-align: center;
      width: 1.8rem;
      height: 60px;
      line-height: 60px;
    }
    .infoContent{
      float: left;
      text-align: center;
      width: calc(100% - 1.8rem);
      height: 60px;
      line-height: 60px;
      .el-input{
        width: 100%;
      }
      ::v-deep .el-input__inner{
        border: 1px solid #fff !important;
        height: 0.49rem !important;
      }
    }
  }
}
</style>