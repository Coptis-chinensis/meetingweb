<template>
  <div class="spoke">
    <!-- 是否显示全部说话人 -->
    <div class="chooseAll">
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   :disabled="isVoicePrint"
                   @change="handleCheckAllChange">
        不选择发言人
      </el-checkbox>
    </div>
    <!-- 已经存在的声纹人员 -->
    <el-checkbox-group :disabled="isVoicePrint"
                       v-model="checkedCities"
                       @change="handleCheckedCitiesChange">
      <div class="spokemanCard" v-for="(spokemen,index) in spokeMen" :key="index">
        <!-- 当前说话人 -->
        <div class="yuan">
          <div class="firstName nowSpoke">
            <span>{{spokemen.spokeInfo[0].spokeMan.substring(0,1)}}</span>
          </div>
        </div>
        <div class="allName fff">
          <el-checkbox :label="index" :key="index">{{''}}</el-checkbox>
          <el-input :disabled="isVoicePrint"
                    @focus="inputFocus(index)"
                    @blur="inputBlur(index)"
                    v-model="spokemen.spokeInfo[0].spokeMan"
                    @change="changeSpokeman1(spokemen)"></el-input>
          <div v-if="!isVoicePrint" class="xiala" id="xiala">
            <div class="attendeCard" v-show="spokemen.spokeInfo[0].attendeShow"
                 v-for="(item, endex) in participantMen" :key="endex"
                 @click="chooseAttende(item, index)">
              <span class="attende">{{item}}</span>
            </div>
          </div>
        </div>
        <!-- 麦克风开启与否 -->
        <i v-if="spokemen.silent == 1 && !isVoicePrint" class="el-icon-turn-off-microphone" @click="setSlient(spokemen, 0)"></i>
        <i v-else-if="spokemen.silent != 1 && !isVoicePrint" class="el-icon-microphone" @click="setSlient(spokemen, 1)"></i>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import {ask_deleteSpokeman, ask_saveSpokeMan, ask_changeSpokeMan, ask_sendMessage} from '../../../api/meeting'

export default {
  props:{
    meetingId: Number, // 会议室ID
    spokeMen: Array, // 说话人列表
    participantMen: Array, // 参会人列表
    CID: String, // 麦克风id
    addSpokeman: Function, // 创建声纹人员
    meetingStatus: Number, // 会议状态（进行中，已暂停）
    isVoicePrint: Boolean, // 声纹是否开启
  },
  data(){
    return{
      isVoicing: true, // 是否可以点击麦克风开启关闭按钮
      checkAll: true,
      isIndeterminate: false, // 全选是否被勾选
      checkedCities: [], // 被选择的说话人序号
      chooseSpk: [], // 被选择的说话人名称
      sliderValue: 50, // 音量
      micimg: require('../../../assets/meetingTransfer/mic_logo.png'),
    }
  },
  watch:{
  },
  beforeMount: function(){
    for(let i = 0; i < this.spokeMen.length; i++) {
      this.checkedCities.push(i)
      this.chooseSpk.push(this.spokeMen[i].spokeInfo[0].spokeMan)
    }
    this.chooseContent()
  },
  methods:{
    handleCheckAllChange(val) {
      this.chooseSpk = []
      this.checkedCities = []
      if(val){ // 全选
        for(let i = 0; i < this.spokeMen.length; i++) {
          this.checkedCities.push(i)
          this.chooseSpk.push(this.spokeMen[i].spokeInfo[0].spokeMan)
          this.chooseContent()
        }
      } else { // 全不选
        this.chooseContent()
      }
    },

    handleCheckedCitiesChange(value) {
      this.chooseSpk = []
      for(let i = 0; i < value.length; i++) {
        this.chooseSpk.push(this.spokeMen[value[i]].spokeInfo[0].spokeMan)
      }
      this.chooseContent()
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.spokeMen.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.spokeMen.length;
    },

    // 筛选内容
    chooseContent(){
      this.$emit('chooseContent', this.chooseSpk)
    },

    // 焦点了input框
    inputFocus(index) {
      this.spokeMen[index].spokeInfo[0].attendeShow = true
      this.$set(this.spokeMen, index, this.spokeMen[index]);
    },

    // 离开了input框
    inputBlur(index) {
      var spokemen = this.spokeMen[index].spokeInfo
      spokemen[0].attendeShow = false
      // 为了让用户可以点击下拉框中的内容
      setTimeout(() => {
        this.$set(this.spokeMen, index, this.spokeMen[index]);
        // console.log(this.spokeMen[index].spokeMan);
      }, 150)
      // this.changeSpokeman(spokemen)
      // 意见类型
      // if (e.target.value !== '') {
      //   this.spokeMen[index].spokeMan = e.target.value
      //   this.$forceUpdate()   // 强制更新
      // }
    },


    chooseAttende(item, index){
      var spokemen = this.spokeMen[index].spokeInfo
      for(let i = 0; i < spokemen.length; i++){
        if(item == spokemen[i].spokeMan){
          this.$message.info("已有重复说话人")
          return
        }
      }
      spokemen[index].spokeMan = item
      this.changeSpokeman(spokemen[index])
    },

    querySearch(queryString, cb) {
      var participantMen = this.participantMen;
      var results = queryString ? participantMen.filter(this.createFilter(queryString)) : participantMen;
      if(results.value == undefined){
        for(let i = 0; i < results.length; i++){
          results[i] = {
            name: results[i],
            value: results[i]
          }
        }
      }
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    // 切换说话人名称
    changeSpokeman(item){
      var form = new FormData()
      form.append("meetingID", this.meetingId)
      form.append("id", item.spokeInfo[0].id)
      form.append("userStatus", item.spokeInfo[0].userStatus)
      form.append("channelID", item.channelID)
      form.append("spokeMan", item.spokeMan)
      ask_saveSpokeMan(form).then(res =>{
        if(res.success) {
          item.spokeInfo[0].spokeMan = item.spokeMan
        }
      })
    },

    // 修改说话人名称
    changeSpokeman1(item){
      console.log(item);
      var form = new FormData()
      form.append("meetingID", this.meetingId)
      form.append("id", item.spokeInfo[0].id)
      form.append("userStatus", item.spokeInfo[0].userStatus)
      form.append("channelID", item.channelID)
      form.append("spokeMan", item.spokeInfo[0].spokeMan)
      ask_saveSpokeMan(form)
    },

    // 麦克风开启与否
    setSlient(mic, status){
      console.log(status);
      if(!this.isVoicing) {
        this.$message.info('请稍等片刻操作')
        return
      }
      this.isVoicing = false
      setTimeout(() => {
        this.isVoicing = true
      }, 3000)
      this.$set(mic.spokeInfo[0], 'silent', status)
      var form = new FormData()
      form.append("CMD", "SetWorkMic")
      form.append("CID", this.CID)
      form.append("MeetingID", this.meetingId)
      var MIC = []
      MIC.push(mic)
      console.log(MIC);
      form.append("MicList", 
        JSON.stringify(MIC.map((item, index) => {
          return {
            id: item.spokeInfo[0].id + '',
            Channel: item.channelID + '',
            Silent: item.spokeInfo[0].silent == 0 ? 0 : 1,
            Volume: this.sliderValue + ''
          }
        })))
      ask_sendMessage(form).then(res =>{
        if (res.success) {
          this.$emit('getMicName', 'getMicName')
        }
      })
    },
  },
  mounted(){
  }
}
</script>

<style lang="scss" scoped>
  .spoke{
    .chooseAll{
      height: 0.3rem;
      line-height: 0.3rem;
      display: flex;
      justify-content: center;
      border-bottom: 0.02rem solid #283365;
    }
    .el-checkbox{
      position: relative;
      float: left;
    }
    ::v-deep .el-checkbox__inner{
      height: 0.12rem;
      width: 0.12rem;
      border: 0.01rem solid #EAEBEF;
      background-color: rgba(255, 255, 255, 0);
      &:hover{
        border: 0.01rem solid #B6C0F2;
      }
    }
    ::v-deep .el-checkbox__inner::after{
      border: 2px solid #fff;
      border-left: 0;
      border-top: 0;
    }
    ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #4258C0 !important;
      
    }
    ::v-deep .el-checkbox__label{
      padding-left: 0.05rem;
      font-size: 0.12rem;
      font-weight: 400;
      color: #B6C0F2;
    }
    i{
      position: relative;
      cursor: pointer;
      border-radius: 10px;
      float: right;
      font-size: 0.22rem;
      margin-right: 0.24rem;
    }
    .el-icon-remove-outline{
      background-color: #f5615f;
      color: #fff;
      margin-top: -0.88rem;
      
      opacity: 0;
      transition: opacity 0.5s;
    }
    .el-icon-microphone{
      color: #fff;
      margin-top: -0.5rem;
    }
    .el-icon-turn-off-microphone{
      color: #f5615f;
      margin-top: -0.5rem;
    }
    .spokemanCard{
      cursor: pointer;
      padding-top: 0.13rem;
      height: 1rem;
      border-bottom: 0.02rem solid #283365;
      transition: background-color 0.5s;
      
      .fff{
        ::v-deep .el-input__inner{
          color: #fff !important;
        }
        ::v-deep .el-input__inner:focus {
          border-bottom: 0.01rem solid #fff !important;
        }
      }
      .yuan{
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .allName{
        color: #b7bef2;
        text-align: center;
        margin-top: 0.05rem;
        font-size: 0.15rem;
        ::v-deep .el-checkbox__inner{
          position: absolute;
          bottom: -0.09rem;
          left: 0.1rem;
        }
        
        .xiala{
          position: absolute;
          width: 0.75rem;
          background-color: #fff;
          border-radius: 0.05rem;
          margin-left: 0.2rem;
          margin-top: 0.05rem;
          z-index: 2;
          .attendeCard{
            // display: none;
            transition: all 0.5s;
            line-height: 0.35rem;
            height: 0.35rem;
            color: #30353b;
            border-top: 0.01rem solid #e4e4e4;
            background-color: #fff;
            &:first-child{
              border-top: 0;
              border-top-left-radius: 0.05rem;
              border-top-right-radius: 0.05rem;
            }
            &:last-child{
              border-bottom-left-radius: 0.05rem;
              border-bottom-right-radius: 0.05rem;
            }
            &:hover{
              background-color: #f1f3f7;
            }
          }
        }
        .el-input{
          // caret-color: transparent;
          width: 0.64rem;
          height: 0.27rem;
        }
        ::v-deep .el-select__caret{
          color: rgba(33,44,94,0);
        }
        ::v-deep .el-input__inner{
          padding: 0;
          text-align: center;
          transition: all 0.5s;
          border: 1px solid #212c5e;
          background-color: #212c5e;
          color: #b7bef2;
          width: 0.64rem;
          height: 0.27rem;
          font-size: 0.15rem;
        }
        ::v-deep .el-input__inner:focus {
          border: 0.01rem solid #212c5e;
          border-bottom: 0.01rem solid #8491cb !important;
          outline: 0;
        }
      }
      .addName{
        cursor: pointer;
        font-size: 40px;
        background-color: #fff;
        color: #c1c1cc;
        border: 0.01rem dashed #dcdce2 !important; // 虚线
      }
      .firstName{
        cursor: pointer;
        width: 0.53rem;
        height: 0.53rem;
        line-height: 0.53rem;
        border-radius: 50%;
        text-align: center;
        font-weight: 700;
        font-size: 0.21rem;
        transition: background-color 0.5s;
        color: #88889f;
        background-color: #212c5e;
        border: 0.01rem solid #dcdce2;
      }
      .nowSpoke{
        border: 0.01rem solid #fff;
        color: #fff;
      }
    }
  }

  .spokemanCard:hover{
    background-color: #2a376e;
    .el-icon-remove-outline{
      opacity: 1;
    }
    .firstName{
      background-color: #2a376e;
    }
    .allName{
      ::v-deep .el-input__inner{
        border-color: #2a376e;
        background-color: #2a376e;
      }
      ::v-deep .el-input__inner:focus {
        border-top: 1px solid #2a376e !important;
        border-left: 1px solid #2a376e !important;
        border-right: 1px solid #2a376e !important;
      }
    }
  }
</style>