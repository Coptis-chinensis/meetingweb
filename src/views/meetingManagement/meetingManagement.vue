<template>
  <div class="page">
    <Header title="会议管理"></Header>
    <div class="contentCard">
      <!-- 筛选和操作 -->
      <div class="top">
        <div class="chooseInput">
          <el-select v-model="selectSearch.quanwenjiansuo">
            <el-option
              v-for="item in searchInputList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :command="item.value">
            </el-option>
          </el-select>
        </div>
        <el-input class="searchInput" v-model="searchVal" placeholder="请输入关键词"
                  @keyup.enter.native="SearchRequest" clearable
                  style="margin-right: 0.1rem;">
        </el-input>
        <el-date-picker v-model="dateValue" type="daterange" range-separator="→" class="datePicker"
                        start-placeholder="开始日期" end-placeholder="结束日期" @change="SearchRequest"
                        :default-time="['00:00:00', '23:59:59']"
                        unlink-panels :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div class="btnDiv">
        <div class="btn btn3" style="margin-left: 0.05rem" @click="reset">重置</div>
        <div class="btn btn3" @click="SearchRequest">搜索</div>
        <div class="btn btn1" v-if="multipleSelection.length" @click="deleteRecorder">删除</div>
        <div class="btn btn1" v-if="multipleSelection.length" @click="exportShow">导出</div>
      </div>
      <!-- 表单内容 -->
      <div class="content">
        <el-table style="width: 100%" :data="meetingData" :span-method="arraySpanMethod"
                  highlight-current-row stripe v-loading="isSearching"
                  @row-dblclick="editRow2" @selection-change="handleSelectionChange"
                  :header-cell-style="{background:'#F0F2F7', color:'#606266'}">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="会议名称">
            <template slot-scope="scope">
              <span v-html="scope.row.title"></span>
            </template>
          </el-table-column>
          <el-table-column label="会议时间" width="300">
            <template slot-scope="props">
              {{props.row.startTime | timeFormat}}
              <span>至</span>
              {{props.row.endTime | timeFormat}}
            </template>
          </el-table-column>
          <el-table-column label="创建者" width="150">
            <template slot-scope="scope">
              <span v-html="scope.row.userName"></span>
            </template>
          </el-table-column>
          <el-table-column label="会议主题">
            <template slot-scope="props">
              <span v-html="props.row.summary"></span>
            </template>
          </el-table-column>
          <el-table-column label="会议内容" show-overflow-tooltip>
            <template slot-scope="props">
              <span v-html="props.row.transferText"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" class="operation" align="center">
            <template slot-scope="props">
              <div class="opDiv">
                <img class="opImg" src="../../assets/export.png">
                <el-tooltip effect="dark" content="导出" placement="top">
                  <img class="opImg" src="../../assets/export1.png" @click="exportShow(props.row)">
                </el-tooltip>
              </div>
              <div class="opDiv">
                <img class="opImg" src="../../assets/edit.png">
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <img class="opImg" src="../../assets/edit1.png"
                      @click="goEdit(props.row)">
                </el-tooltip>
              </div>
              <div class="opDiv">
                <img class="opImg" src="../../assets/delete.png">
                <el-tooltip effect="dark" content="删除" placement="top">
                  <img class="opImg" src="../../assets/delete1.png" 
                        @click="Delete(props.row.meetingID)">
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="meetingData.length"
          background
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :pager-count="5"
          layout="prev, pager, next, jumper"
          :total="meetingtotal">
        </el-pagination>
      </div>
    </div>
    <!-- 导出框 -->
    <Dialog
      titleIcon="1"
      title="导出"
      width="7.5rem"
      okTxt="确认"
      noTxt="取消"
      :visible="isExportShow"
      :cancel="cancelExport"
      :upload="uploadExport">
      <div>
        <span class="span15">导出名称</span><br><br>
        <el-input v-model="exportName" placeholder="选填"></el-input>
      </div><br><br>
      <div>
        <span class="span15">导出内容</span><br><br>
        <el-checkbox-group v-model="checkedcontents">
          <el-checkbox v-for="radio in contents" :label="radio" 
                      :key="radio">
            {{radio}}
          </el-checkbox>
        </el-checkbox-group>
      </div><br><br>
      <div v-if="checkedcontents.indexOf('会议记录') != -1">
        <span class="span15">会议记录模板</span>
        <span>（待完善部分）</span><br><br>
        <!-- 模板内容 -->
        <div>
          <ExportCard v-if="exportData.length"
                      type="meeting"
                      :exportData="exportData"
                      v-on:getRadio="getRadio">
          </ExportCard>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Header from '../../components/header'
import Global from '../../api/Global' //引用文件
import Dialog from '../../components/dialog.vue'
import ExportCard from './components/exportCard.vue'
import {ask_searchMeeting, ask_checkMark, ask_deleteMeeting} from '../../api/meeting'
import {ask_checkAudio} from '../../api/voice'
import {ask_getWordTemplate} from '../../api/subsection'

  export default {
    components:{
      Header, Dialog, ExportCard
    },
    data() {
      return {
        checkedcontents: [], // 被选中的导出内容
        exportData: [], // 导出信息
        meetingData:[], // 音频信息
        multipleSelection: [], // 多选会议ID
        multipleSelection1: [], // 用于获取导出名称
        multipleSelection2: [], // 操作中的导出
        isExportShow: false, // 导出框的显示与否
        isSearching: false, //是否开始搜索
        radio: '0', // 导出内容
        exportName: '', // 导出名称
        dateValue: '', // 会议筛选的时间
        searchVal: '', //搜索词
        meetingtotal: 0, // 会议总数
        currentpagebak: 1, // 当前页码
        pagesize: 7, // 每页条目数
        selectSearch: {
          quanwenjiansuo: '0',
          sttStatus: '',
          language: '', // 0 中文 1 英文
          creator: '',
        },
        searchInputList: [ //转写状态列表
          {label: "按名称", value: "0"}, 
          {label: "按内容", value: "1"},
        ],
        contents: ["会议记录", "原始记录", "标记结果", "会议音频"],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    mounted() {
      this.SearchRequest()
    },
    methods: {
      // 路由跳转
      goRouter(row){
        this.$router.push({path: '/meeting/meetingEditor/' + row.meetingID})
        sessionStorage.edit = "会议管理"
        sessionStorage.edit1 = "会议编辑"
      },

      // 查询所有导出模板
      SearchExport() {
        var form = {
          "type": 0
        }
        ask_getWordTemplate(form).then(res => {
          this.exportData = res.result
        })
      },

      // 合并列
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (row.dateDay) {
          return [1, 99];
        }
      },

      /*分页*/
      handleCurrentChange(val) {
        this.currentpagebak = val
        this.SearchRequest()
      },

      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = [];
        this.multipleSelection1 = [];
        this.multipleSelection1 = val
        for (let i = 0; i < val.length; i++) {
          if (this.multipleSelection.indexOf(val[i].meetingID) === -1 && val[i].meetingID != null) {
            this.multipleSelection.push(val[i].meetingID)
          }
        }
      },

      // 编辑 双击
      editRow2: function (row, column, event) {
        this.goRouter(row)
      },

      // 重置查询
      reset(){
        this.searchVal = ''
        this.selectSearch = {
          quanwenjiansuo: '0',
          sttStatus: '',
          language: '',
          creator: '',
        }
        this.dateValue = ''
        this.SearchRequest()
      },

      // 会议记录查询
      SearchRequest() {
        var stm = '', etm = ''
        if (this.dateValue != null && this.dateValue[0] != '' && this.dateValue[0] != null != '' && this.dateValue[0] != undefined) {
          var btime = new Date(this.dateValue[0])
          stm = btime.getFullYear() + '-' + (btime.getMonth() + 1) + '-' + btime.getDate() + ' ' + '00:00:00'
        }
        if (this.dateValue != null && this.dateValue[1] != '' && this.dateValue[1] != null != '' && this.dateValue[1] != undefined) {
          var etime = new Date(this.dateValue[1])
          etm = etime.getFullYear() + '-' + (etime.getMonth() + 1) + '-' + etime.getDate() + ' ' + '23:59:59'
        }
        if (stm.length > 0 && etm.length > 0) {
          if (this.dateValue[0] > this.dateValue[1]) {
            this.$message.info('结束时间晚于开始时间')
            return
          }
        }
        // 查询会议列表
        var form = new FormData()
        form.append("type", this.selectSearch.quanwenjiansuo == "0" ? 0 : 1)
        form.append("currPage", this.currentpagebak)
        form.append("pageSize", this.pagesize)
        form.append("orderBy", JSON.stringify({createTime: 'desc'}))
        form.append("searchVar", this.searchVal)
        form.append("startTime", stm)
        form.append("endTime", etm)
        ask_searchMeeting(form).then(res => {
          if (res.success) {
            res = res.result
            this.meetingtotal = res.totalCount
            this.meetingData = res.content

            // 如果所查的页码 > 总页数，则查第一页的数据
            if (res.currPage > res.totalPage && res.totalPage > 0) {
              this.currentpagebak = 1
              this.SearchRequest()
            }
          }
        })
      },

      // 跳转到编辑页面
      goEdit(row){
        this.goRouter(row)
      },

      // 删除会议
      Delete(ID) {
        this.$confirm('确认删除所选会议？', '删除会议', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'meeting_confirm',
          cancelButtonClass: 'confirm_cancel',
          confirmButtonClass: 'confirm_btn'
        }).then(() => {
          var IDS = []
          IDS.push(ID)
          let id = _.compact(IDS)
          var form = new FormData()
          form.append("meetingID[]", id)
          ask_deleteMeeting(form).then(res => {
            var isSuccess = res.success
            if(isSuccess){
              this.$message.success(res.message)
              this.SearchRequest()
            } else {
              this.$message.error(res.message)
            }
          })
        })
      },

      // 删除会议
      deleteRecorder() {
        let id = _.compact(this.multipleSelection)
        if (id.length == 0) {
          this.$message.warning('未勾选任何会议')
          return
        }
        this.$confirm('确认删除所选会议？', '删除会议', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'meeting_confirm',
          cancelButtonClass: 'confirm_cancel',
          confirmButtonClass: 'confirm_btn'
        }).then(() => {
          this.deleteMeeting()
        })
      },

      // 删除会议
      deleteMeeting() {
        // compact数组去空
        let id = _.compact(this.multipleSelection)
        // var id = this.multipleSelection.meetingID;
        if (this.multipleSelection.length == 0) {
          this.$message.warning('未勾选任何会议')
          return
        }
        var form = new FormData()
        form.append("meetingID[]", id)
        ask_deleteMeeting(form).then(res => {
          var isSuccess = res.success
          if(isSuccess){
            this.$message.success(res.message)
            this.SearchRequest()
          } else {
            this.$message.error(res.message)
          }
        })
      },

      // 导出弹框
      exportShow(val) {
        if(val.title){ // 操作中的导出按钮
          this.multipleSelection2 = []
          this.multipleSelection2.push(val)
          this.exportName = val.title
        } else {
          this.exportName = this.multipleSelection1[0].title
        }
        this.SearchExport()
        this.isExportShow = true
      },

      // 获取导入模板radio
      getRadio(item){
        this.radio = item
      },

      // 提交导出
      uploadExport(){
        if(this.checkedcontents.length == 0) {
          this.$message.info("请选择导出内容")
          return
        }
        var needWord = false, needOriginal = false,
            needAudio = false, needTagText = false
        for(let i = 0; i < this.checkedcontents.length; i++){
          if(this.checkedcontents[i] == '会议记录'){
            needWord = true
          } else if (this.checkedcontents[i] == '原始记录'){
            needOriginal = true
          } else if (this.checkedcontents[i] == '标记结果'){
            needTagText = true
          } else if (this.checkedcontents[i] == '会议音频'){
            needAudio = true
          }
        }
        if(this.multipleSelection2.length > 0) { // 操作栏导出
          var url = Global.domain + '/meeting/exportAnything?meetingID[]=' + this.multipleSelection2[0].meetingID
                    + '&exportName=' + this.exportName + '&needWord=' + needWord 
                    + '&needOriginal=' + needOriginal + '&needTagText=' + needTagText
                    + '&needAudio=' + needAudio + '&templateId=' + this.radio
        } else {
          var url = Global.domain + '/meeting/exportAnything?meetingID[]=' + this.multipleSelection
                    + '&exportName=' + this.exportName + '&needWord=' + needWord 
                    + '&needOriginal=' + needOriginal + '&needTagText=' + needTagText
                    + '&needAudio=' + needAudio + '&templateId=' + this.radio
        }
        window.open(url)
        this.cancelExport()
      },

      // 取消导出
      cancelExport(){
        this.exportName = ''
        this.checkedcontents = []
        this.isExportShow = false
      },
    },
    filters: {
      //时间戳精确到秒
      timeFormat: function (val) {
        val = val || ''
        return val.length > 16 ? val.substring(0, 16) : val
      }
    },
  }
</script>

<style lang="scss" scoped>
  .page{
    .contentCard{
      .top{
        display: flex;
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
