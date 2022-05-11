<template>
  <div class="page">
    <!-- 上半部分 -->
    <div class="topContent Content">
      <!-- 会议转写 -->
      <div class="top_left">
        <div class="meetingTransfer">
          <div class="transferSpan">
            <Time></Time>
          </div>
        </div>
      </div>
      <!-- 最近会议 -->
      <div class="top_right">
        <div class="showCard">
          <ShowSpan title="最近会议" urlSrc="/meeting/meetingManagement"></ShowSpan>
          <table v-if="meetingData.length" class="showTable">
            <tr class="tables" v-for="(item, index) in meetingData" :key="index" @click="goEdit(item)">
              <td class="dian">●</td>
              <td class="table_title" :title="item.title">{{item.title}}</td>
              <td class="table_time" :title="item.title">{{item.startTime.substring(0, item.startTime.length - 3)}}</td>
            </tr>
          </table>
          <table v-else class="showTable">
            <tr class="tables noData">
              <td>暂无数据</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- 下半部分 -->
    <div class="bottomContent Content">
      <!-- 任务管理 -->
      <div class="bottom_left">
        <div class="showCard">
          <ShowSpan title="任务管理" urlSrc="/task/taskManagement"></ShowSpan>
          <el-table style="width: calc(100% - 0.4rem); margin-left: 0.2rem; margin-top: 0.2rem" :data="audioData" :span-method="arraySpanMethod"
                    highlight-current-row stripe v-loading="isSearching"
                    @row-dblclick="editRow2"
                    :header-cell-style="{background:'#F0F2F7', color:'#606266'}">
            <el-table-column label="任务名称" how-overflow-tooltip show-overflow-tooltip>
              <template slot-scope="props">
                <span v-html="props.row.name"></span>
              </template>
            </el-table-column>
            <el-table-column label="转写状态" align="center">
              <template slot-scope="props">
                <span>{{statusFormat(props.row.sttStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="50" align="center">
              <template slot-scope="scope">
                <span v-html="scope.row.uploadFileList.length"></span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span v-html="scope.row.createTime"></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 下边的右边部分 -->
      <div class="bottom_right">
        <!-- 数据统计 -->
        <div class="bottom_right_top">
          <!-- hidden是为了鼠标移上去echarts不闪烁 -->
          <div class="showCard" style="overflow:hidden">
            <ShowSpan title="数据统计"></ShowSpan>
            <div class="eCharts" id="myCharts" v-on-echart-resize></div>
          </div>
        </div>
        <!-- 操作日志 -->
        <div class="bottom_right_bottom">
          <div class="showCard">
            <ShowSpan title="操作日志" urlSrc="/setting/sysLog"></ShowSpan>
            <table v-if="sysLogData.length" class="showTable">
              <tr class="tables" v-for="(item, index) in sysLogData" :key="index">
                <td class="table_title" :title="item.title">{{item.operation}}</td>
                <td class="table_time" :title="item.title">{{item.createDate.substring(0, item.createDate.length - 3)}}</td>
              </tr>
            </table>
            <div v-else class="showTable">
              <div class="tables noData">
                暂无数据
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import moment from 'moment'
import Time from './components/time'
import ShowSpan from './components/showSpan'
import ShowItem from './components/showItem'
import Dialog from '../../components/dialog'
import {createCode} from '../../utils/createCode' // 随机四位数
import {CheckMeetingName} from '../../utils/util'//记得带上{}花括号
import {ask_searchMeeting, ask_getUserMeetingInfo, ask_findSingleRoom} from '../../api/meeting'
import { ask_search } from '../../api/administr'
import { ask_getTaskList } from '../../api/uploadTask'
import {debounce} from '../../utils/fangdou.js'; // 防止echarts抖动
import '../../js/charts.resize'
let elementResizeDetectorMaker = require("element-resize-detector")

export default {
  components:{
    ShowSpan, Dialog, Time, ShowItem,
  },
  data() {
    return {
      radio: 0, // 单选框默认为空
      voiceNum: 0, // 音频总数量
      meetingNum: 0, // 会议总数量
      taskNum: 0, // 任务总数量
      yNum: 0, // y轴最大值
      yNum_kedu: 0, // y轴刻度
      showLeft: true, // 左边菜单伸缩
      meetingTransferBtn: '开始会议转写', // 会议转写按钮文字
      meetingId: '', // 会议Id
      Date: '', // 当前时间
      formLabelWidth: '100',
      myChart: '', // 数据统计的图
      title: '', // 随机的会议名称
      inputValue: '', // 新建参会人的名字
      voiceStatis:[// 统计的开会数量信息
        {
          num: 0,
          data: '今天',
          color: '#2cbca9'},
        {
          num: 0,
          data: '近一周',
          color: '#1aa7e8'},
        {
          num: 0,
          data: '近一月',
          color: '#3f57ca'}
      ], 
      xAxis: [], // 会议信息x轴
      meetingMouth: [], // 会议音频
      taskMouth: [], // 任务音频
      voiceData: [], // 总音频数据
      data: [], // 音频信息数据集
      audioData:[], // 音频信息
      sysLogData: [], // 日志信息
      meetingData: [], // 近期七次会议
      echartsData: [], // 会议信息x数据集s
      transferStatusList: [ //转写状态列表
        {label: "上传中", value: "0"}, 
        {label: "转写中", value: "1"},
        {label: "已完成",value: "2"},
      ],
      isSearching: false, // 是否搜索完成
      inputVisible: false, // 是否显示新建参会人的input框
      createMeetingShow: false, // 新建会议弹框的显示与否
      oUser: window.oUser ? window.oUser : '', // 用户信息
      meetingForm: {
        title: '',
        title1: '',
        summary: '',
        attendee: []
      },
      meetingRules: {},
    }
  },
  watch:{
  },
  mounted() {
    this.Date = new Date();
    this.searchMeeting()
    this.searchTasking()
    this.searchTask()
    this.searchSysLog()
    var form  = new FormData()
    form.append("pageSize", 5)
    form.append("currPage", 1)
    form.append("type", 0) // 查询类型（0普通搜索，1全局搜索）
    form.append("orderBy", JSON.stringify({createTime: 'desc'}))
    ask_searchMeeting(form).then(res =>{
      if(res.success) {
        this.meetingData = res.result.content
      }
    })
  },
  methods: {
    // 表单验证，密码是否包含非法字符
    validatePass: function (rule, value, callback) {
      // $('#pswbeforeerror').hide()
      if (value === '') {
        callback(new Error('会议名称为空'));
      } else if (CheckMeetingName(value) === false) {
        callback(new Error('会议名称含有非法字符'));
      } else {
        callback();
      }
    },

    // 查询任务列表
    searchTask(callback) {
      var form = {
        'currPage': 1,
        'pageSize': 7,
      }
      ask_getTaskList(form).then(res => {
        if (res.success) {
          res = res.result
          this.audioData = res.content
        } else {
          this.$message.error(res.message)
        }
        setTimeout(() => {
          this.isSearching = false
        }, 300)
      })
    },

    // 搜索日志信息
    searchSysLog() {
      this.isSearching = true
      var form = new FormData()
      form.append("currPage", 1)
      form.append("pageSize", 4)
      ask_search(form).then(res => {
        var isSuccess = res.success
        if (isSuccess) {
          res = res.result;
          this.sysLogData = res.content;
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 查询会议列表
    searchMeeting() {
      ask_getUserMeetingInfo().then(res => {
        if (res.success) {
          res = res.result
          this.meetingNum = res.length
          this.getMeetingSource(res)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 查询任务列表
    searchTasking() {
      var form = {
        'currPage': 1,
        'pageSize': 100000,
      }
      ask_getTaskList(form).then(res => {
        if (res.success) {
          res = res.result
          this.taskNum = res.length
          
          if(this.meetingNum != undefined && this.taskNum != undefined){
            this.yNum = (this.meetingNum > this.taskNum 
              ? this.meetingNum : this.taskNum)
            this.yNum_kedu = (this.meetingNum > this.taskNum 
              ? parseInt(this.meetingNum / 0.5) * 1000 : parseInt(this.taskNum / 0.5) * 1000)
          } else if (this.meetingNum != undefined && this.taskNum == undefined){
            this.yNum = this.meetingNum
            this.yNum_kedu = parseInt(this.meetingNum / 0.5) * 1000
          } else if (this.meetingNum == undefined && this.taskNum != undefined){
            this.yNum = this.taskNum
            this.yNum_kedu = parseInt(this.taskNum / 0.5) * 1000
          } else {
            this.yNum = 0
            this.yNum_kedu = 0
          }
          console.log(this.yNum, this.yNum_kedu);
          this.getTaskSource(res.content)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    handleClose(tag) {
      this.meetingForm.attendee.splice(this.meetingForm.attendee.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue.length > 20) {
        this.$message.info("参会人名称不能超过20位")
        this.inputVisible = false;
        this.inputValue = '';
        return
      }
      if (inputValue) {
        if(this.meetingForm.attendee.length == 0){
          this.meetingForm.attendee.push(inputValue);
          this.inputVisible = false;
          this.inputValue = '';
          return
        }
        for(let i = 0; i < this.meetingForm.attendee.length; i++) {
          if(inputValue == this.meetingForm.attendee[i]) {
            this.$message.info("已有重复参会人")
            this.meetingForm
            this.inputVisible = false;
            this.inputValue = '';
            return
          }
        }
        this.meetingForm.attendee.push(inputValue);
        this.inputVisible = false;
        this.inputValue = '';
      }
    },

    //转写状态文字化
    statusFormat: function (val) {
      var statusList = this.transferStatusList;
      for (let obj of statusList) {
        if (obj.value == val) {
          return obj.label;
        }
      }
    },

    // 跳转到会议编辑页面
    goEdit(row){
      this.$router.push({path: '/meeting/meetingEditor/' + row.meetingID})
      sessionStorage.edit = "会议管理"
      sessionStorage.edit1 = "会议编辑"
    },

    // 编辑 双击
    editRow2: function (row, column, event) {
      this.$router.push({path: '/task/taskDetails/' + row.id})
    },

    // 合并列
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      if (row.dateDay) {
        return [1, 99];
      }
    },

    // 获取某一天的日期
    getData(data) {
      if(data.getMonth() + 1 < 10 && data.getDate() > 10) { // 月份为个位数
        var time = data.getFullYear().toString() + '0' + (data.getMonth() + 1).toString() + data.getDate().toString()
      } else if(data.getMonth() + 1 > 10 && data.getDate() < 10) { // 日期为个位数
        var time = data.getFullYear().toString() + (data.getMonth() + 1).toString() + '0' + data.getDate().toString()
      } else if(data.getMonth() + 1 < 10 && data.getDate() < 10){ // 月份和日期都是个位数
        var time= data.getFullYear().toString() + '0' + (data.getMonth() + 1).toString() + '0' + data.getDate().toString()
      } else {
        var time = data.getFullYear().toString() + (data.getMonth() + 1).toString() + data.getDate().toString()
      }
      return time
    },

    // 给图像的x数据集赋值
    getMeetingSource(MeetingData) {
      for(let k = 0; k < 12; k++) {
        this.meetingMouth[k] = 0
      }
      var data = new Date()
      var nowYear = data.getFullYear()
      var nowMouth = data.getMonth() + 1
      var n = 11
      for(let m = nowMouth; m > 0; m--) {
        this.echartsData[n] = m + '月'
        n--
      }
      for(let k = 12; k > nowMouth; k--){
        this.echartsData[n] = k + '月'
        n--
      }
      for(let i = 0; i < MeetingData.length; i++) {
        var mouth = parseInt(MeetingData[i].createtime.substring(5,7)) // 月份
        var year = parseInt(MeetingData[i].createtime.substring(0,4)) // 年份
        var m = 11
        if(nowYear == year){ // 都是今年
          for(let j = nowMouth; j > 0; j--) {
            if(j == mouth) { // 同月份
              this.meetingMouth[m]++
            }
            m--
          }
        } else if ((nowYear - 1) == year) { // 去年
          for(let j = 12; j > nowMouth; j--){
            if(j == mouth) {
              this.meetingMouth[m]++
            }
            m--
          }
        }
      }
      this.draw()
    },

    // 获取任务音频
    getTaskSource(TaskData){
      for(let k = 0; k < 12; k++) {
        this.taskMouth[k] = 0
      }
      var data = new Date()
      var nowYear = data.getFullYear()
      var nowMouth = data.getMonth() + 1
      for(let i = 0; i < TaskData.length; i++) {
        var mouth = parseInt(TaskData[i].createTime.substring(5,7)) // 月份
        var year = parseInt(TaskData[i].createTime.substring(0,4)) // 年份
        var m = 11
        if(nowYear == year){ // 都是今年
          for(let j = nowMouth; j > 0; j--) {
            if(j == mouth) { // 同月份
              this.taskMouth[m]++
            }
            m--
          }
        } else if ((nowYear - 1) == year) { // 去年
          for(let j = 12; j > nowMouth; j--){
            if(j == mouth) {
              this.taskMouth[m]++
            }
            m--
          }
        }
      }
      this.draw()
    },

    // 绘制数据表格
    draw(){
      if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
        this.myChart.dispose();//销毁
      }
      // 初始化echarts实例, devicePixelRatio调整清晰度
      this.myChart = echarts.init(document.getElementById('myCharts'))
      var option;
      // 绘制图表
      option = {
        tooltip: {
          confine: true, // 不超出图表
          trigger: 'item'
        },
        grid: {
          left: 55,
          top: 60,
          right: 20,
          bottom: 40,
          containLabel: false,
          borderWidth: 1,
          borderColor: '#ccc',
        },
        legend: {
          top: '6%',
          right: '5%',
          icon: 'rect', // 样式
          data: ['会议音频', '任务音频']
        },
        xAxis: [
          {
            type: 'category',
            data: this.echartsData,
            splitLine:{ show:false }, //去除网格线
            axisLine:{ // x轴颜色
              lineStyle:{
                color:'#F1F2F7',
                width:1,//这里是为了突出显示加上的
              }
            },
            axisLabel:{ // x轴字体
              textStyle:{
                color: '#72738D',
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: this.yNum,
            interval: this.yNum_kedu + 1, // 刻度
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {show: false}, //去除网格线
            axisLine:{ // x轴颜色
              lineStyle:{
                color:'#F1F2F7',
                width:1,//这里是为了突出显示加上的
              }
            },
            axisLabel:{ // x轴字体
              textStyle:{
                color: '#72738D',
              }
            }
          },
        ],
        series: [
          {
            name: '会议音频',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            sampling: 'average',
            itemStyle: {
              color: '#34CB90'
            },
            stack: 'a',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#CCE7EC'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ])
            },
            data: this.meetingMouth
          },
          {
            name: '任务音频',
            type: 'line',
            smooth: true,
            stack: 'b',
            symbol: 'circle',
            symbolSize: 5,
            sampling: 'average',
            itemStyle: {
              color: '#5964FF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#E2E4FF'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ])
            },
            data: this.taskMouth
          }
        ],
      };
      //防止越界，重绘canvas
      // let erd = elementResizeDetectorMaker()
      // let that = this
      // console.log(document.getElementById("myCharts"));
      // erd.listenTo(document.getElementById("myCharts"), debounce(function () {
      //   that.$nextTick(function () {
      //     that.myChart.resize();
      //   })
      // }))
      this.myChart.clear()
      this.myChart.setOption(option);//设置option
    },

    // 创建会议
    createMeeting(str) {
      if (str == '继续会议转写') {
        this.$router.push({path: '/meetingTransfer'})
      } else{
        this.createMeetingShow = true
        if(this.title) {
          this.meetingForm.title = this.title
        } else {
          var code = createCode()
          var time = moment().format("YYYYMMDDHHmm");
          this.meetingForm.title = "会议" + time.toString() + code
        }
      }
      
    },
    
    // 取消
    cancelAdd() {
      this.createMeetingShow = false
      this.title = this.meetingForm.title
    },
    // 确定
    uploadAdd() {
      this.$refs.createmeetingRef.validate((isValid) => {
        if (isValid) {
          this.$router.push({
            path: '/meetingTransfer',
            //携带需要传递的参数
            query: {
              title: this.meetingForm.title,
              title1: this.meetingForm.title1,
              summary: this.meetingForm.summary,
              address: this.meetingForm.address,
              attendee: this.meetingForm.attendee}
          })
        }
      })
      
    }
  }
}
</script>

<style lang="scss" scoped>
  .attendee{
    ::v-deep .el-input__inner{
      width: 6.8rem;
    }
  }

  .page{
    padding: 0.4rem;
    display: grid;
    grid-template-rows: repeat(1, 1fr 1.8fr);
    grid-row-gap: 0.16rem;
    align-content: center;
    .Content{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      overflow: auto;
      justify-content: center;
      column-gap: 0.16rem;
    }
    .topContent{
      .top_left{
        height: 100%;
        .meetingTransfer{
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          background-image: url("../../assets/mainInterFace/meetingTransfer.png");
          background-size:100% 100%;
        }
        .transferSpan{
          padding-left: 0.56rem;
          .el-button{
            width: 2.1rem;
            color: #046EEA;
          }
        }
      }
      .top_right{
        .showCard{
          .showTable{
            display: grid;
            overflow: auto;
            grid-template-rows: repeat(5, 1fr);
          }
        }
      }
    }
    .bottomContent{
      .bottom_left{
        height: 100%;
      }
      .bottom_right{
        height: 100%;
        display: grid;
        overflow: auto;
        grid-template-rows: 1.2fr 1fr;
        row-gap: 0.16rem;
        .bottom_right_top{
          height: 100%;
          .showCard{
            .eCharts{
              display: flex;
              justify-content: center;
              margin-top: -0.6rem;
              height: 100%;
              width: 100%;
              ::v-deep div:first-child{
                height: 100% !important;
                widows: 100% !important;
              }
              ::v-deep canvas {
                height: 100% !important;
                widows: 100% !important;
              }
            }
          }
        }
        .bottom_right_bottom{
          .showTable{
            display: grid;
            grid-template-rows: repeat(4, 1fr);
            .table_title{
              margin-left: 0.05rem;
              width: 5.1rem;
            }
          }
        }
      }
    }

    .showCard{
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: 0.1rem;
    }
    .showTable{
      height: calc(100% - 0.8rem);
      align-items: center;
      .noData{
        cursor: auto !important;
        font-size: 0.14rem;
        color: #909399;
        justify-content: center;
        border-bottom: 0.01rem solid #F1F2F7 !important;
      }
      .tables{
        cursor: pointer;
        display: flex;
        padding: 0 0.2rem;
        height: 100%;
        color: #adb1bd;
        border-bottom: 0.01rem solid #F1F2F7;
        align-items: center;
        .table_title{
          font-size: 0.16rem;
          color: #72738D;
          margin-left: 0.2rem;
          width: 4.7rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .table_time{
          text-align: right;
          margin-left: 0.5rem;
          width: 1.4rem;
          font-size: 0.15rem;
          color: #aeaeb6;
        }
        &:hover{
          background-color: #f7f8fc;
          color: #5c72dc;
          .table_title{
            color: #5c72dc;
          }
          .table_time{
            color: #5c72dc;
          }
        }
        &:last-child{
          border-bottom: none;
        }
      }
    }
    
  }

  @media screen and (max-width: 1440px) and (min-width: 1367px) {
  }

  @media screen and (max-width: 1366px) and (min-width: 1025px) {
  }

  @media screen and (max-width: 1024px) {
  }
</style>