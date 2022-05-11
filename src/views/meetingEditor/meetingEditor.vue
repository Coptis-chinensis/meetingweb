<template>
  <div class="page">
    <Header :title="edit" :title1="edit1"
            urlSrc1="/meeting/meetingManagement"></Header>
    <!-- 音频播放/暂停 音频播放时间 -->
    <div class="Wave">
      <!-- 上一段 -->
      <img style="float: left; padding-top: 0.16rem; margin-left: 0.2rem; margin-right: 0.2rem" @click="lastParagraph"
            src="../../assets/last_logo.png"/>
      <!-- 继续会议 -->
      <img style="float: left" v-if="!isPlaying" @click="playOrPause"
            src="../../assets/play_logo.png"/>
      <!-- 暂停会议 -->
      <img style="float: left"  v-else
            src="../../assets/pause_logo.png" @click="playOrPause"/>
      <!-- 下一句 -->
      <img style="float: left; padding-top: 0.16rem; margin-left: 0.2rem; margin-right: 0.2rem" @click="nextParagraph"
            src="../../assets/next_logo.png"/>
      <div class="WaveSurfer" id="WAVE" v-loading="isLoadingWave"></div>
      <span class="currentSpan">{{ currentTime }}</span>
    </div>
    <div class="contentCard">
      <!--操作 -->
      <div class="top">
        <div class="topOperation" @click="changeShow('Search')" slot="reference">
          <img src="../../assets/meetingEditor/search_logo.png" />
          <span>查找</span>
        </div>
        <div v-if="showInfo == '1'" class="popoverContent" v-draw>
          <el-tabs type="border-card">
            <el-tab-pane label="查找">
              <div style="width: 1rem; display: inline-block; text-align: center; margin-bottom: 0.2rem">
                <span>查找内容：</span>
              </div>
              <el-input
                placeholder="请输入查找内容"
                v-model="searchText"
                @input="changeSearchNodeInput"
                @keyup.enter.native="searchAchange('down')"
                @keyup.down.native="searchAchange('down')"
                @keyup.up.native="searchAchange('up')"
                >
                <template slot="suffix" v-if="totalNum > 0">
                  <span style="margin-right: 10px">{{nowNum + 1}}/{{totalNum}}</span>
                </template>
              </el-input>
              <div style="position: absolute; right: 0.2rem; bottom: 0.1rem">
                <el-button style="margin-right: 5px" class="btn btn1 btn" @click="searchAchange('up')">上一个</el-button>
                <el-button style="margin-right: 5px" class="btn btn1 btn" @click="searchAchange('down')">下一个</el-button>
                <el-button style="margin-right: 5px" class="btn btn1 btn" @click="closeReplace">关闭</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="替换">
              <div style="width: 1rem; display: inline-block; text-align: center; margin-bottom: 0.2rem">
                <span>查找内容：</span>
              </div>
              <el-input
                placeholder="请输入查找内容"
                v-model="searchText"
                @input="changeSearchNodeInput"
                @keyup.enter.native="searchAchange('down')"
                @keyup.down.native="searchAchange('down')"
                @keyup.up.native="searchAchange('up')"
                >
                <template slot="suffix" v-if="totalNum > 0">
                  <span style="margin-right: 10px">{{nowNum + 1}}/{{totalNum}}</span>
                </template>
              </el-input>
              <div>
                <div style="width: 1rem; display: inline-block; text-align: center;">
                  <span>替换为:</span>
                </div>
                <el-input
                  placeholder="请输入替换内容"
                  v-model="replaceText">
                </el-input>
              </div>
              <div style="position: absolute; right: 0.2rem; bottom: 0.1rem">
                
                <el-button style="margin-right: 5px" class="btn btn1" @click="searchAchange('up')">上一个</el-button>
                <el-button style="margin-right: 5px" class="btn btn1" @click="searchAchange('down')">下一个</el-button>
                <el-button style="margin-right: 5px" class="btn btn1" @click="closeReplace">关闭</el-button>
                <el-button style="float: right; margin-right: 5px" class="btn btn2" @click="Replace('All')">全部替换</el-button>
                <el-button style="float: right; margin-right: 5px" class="btn btn2" @click="Replace('One', nowNum + 1)">单个替换</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="shutiao"></div>
        <!-- 会议数据 -->
        <div class="topOperation" @click="changeShow1('info')">
          <div style="float: left">
            <img v-if="showInfo1 == '3'" style="padding-top: 0.02rem" src="../../assets/meetingEditor/info_logo_open.png" />
            <img v-else style="padding-top: 0.02rem" src="../../assets/meetingEditor/info_logo_close.png" />
          </div>
          <span>会议信息</span>
        </div>
        <div class="shutiao"></div>
        <div class="topOperation" @click="changeShow1('keyword')" slot="reference">
          <div style="float: left; margin-top: 0.02rem">
            <img src="../../assets/meetingEditor/keyword.png" />
          </div>
          <span>关键要素</span>
        </div>
        <div class="shutiao"></div>
        <el-popover
          :offset="0"
          @after-leave="closePopover()"
          placement="bottom"
          trigger="click">
          <div class="topOperation" slot="reference">
            <div style="float: left; margin-top: 0.02rem">
              <img src="../../assets/meetingEditor/voice_logo.png" />
            </div>
            <span>音量</span>
          </div>
          <div class="popoverContent volume-div">
            <img v-if="volume > 0" style="width: 0.21rem; margin-right: 10px" src="../../assets/meetingEditor/voice_logo.png" />
            <img v-else style="width: 0.21rem; margin-right: 10px" src="../../assets/meetingEditor/voice_logo_none.png" />
            <el-slider style="width: 1.5rem; display: inline-block; margin-right: 10px" v-model="volume"></el-slider>
            <span>{{volume}}</span>
          </div>
        </el-popover>
        <div class="shutiao"></div>
        <div class="topOperation" @click="voiceInput" slot="reference">
          <div style="float: left; margin-top: -0.02rem">
            <img v-if="!voiceStatus" style="margin-top: 0.02rem;" src="../../assets/meetingEditor/voiceInput_close.png" />
            <img v-else style=" width: 0.4rem; margin-left: -0.1rem" src="../../assets/meetingEditor/voiceInput_open.gif" />
          </div>
          <span v-if="!voiceStatus">语音输入</span>
          <span v-else>停止输入</span>
        </div>
        <span class="span17">提示：选中内容鼠标右击可以添加声纹和标记</span>
        <div style="float: right; margin-top: -0.1rem" class="btn btn1" @click="closePopover('save')">
          <span>保存</span>
        </div>
        <div style="float: right; margin-top: -0.1rem" class="btn btn1" @click="exportShow">
          <span>导出</span>
        </div>
        
      </div>
      <!-- 会议信息 -->
      <div v-if="showInfo1 == '3'" class="center" style="height: 180px">
        <MeetingInfo :info="meeting" :userName="users.userName" :tagText="tagText"></MeetingInfo>
      </div>
      <!-- 关键要素 -->
      <div v-if="showInfo1 == '4'" class="center" style="height: 250px">
        <el-tabs class="tabs_two" v-model="activeName">
          <el-tab-pane label="文章摘要" name="1">
            <div class="tabs_input">
              <span>{{meeting.abstracts}}</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关键词" name="2">
            <div class="tabs_input" v-if="keyWords != []">
              <span v-for="(item, index) in keyWords" :key="index" style="cursor: pointer"
                     @click="searchKeyword(item, 'keyword')">
                     {{item.split('(')[0]}}
                     <span style="color: #B6B7E0">({{item.split('(')[1]}}</span>；
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="人名" name="3">
            <div class="tabs_input" v-if="elementKey !=  null">
              <span  v-for="(etem, index) in elementKey.people" :key="index"
                @click="searchKeyword(etem.name)">{{etem.name}}
                <span style="color: #B6B7E0">({{etem.number}}次)</span>；
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="地名" name="4">
            <div class="tabs_input" v-if="elementKey !=  null">
              <span v-for="(etem, index) in elementKey.place" :key="index"
                @click="searchKeyword(etem.name)">{{etem.name}}
                <span style="color: #B6B7E0">({{etem.number}}次)</span>；
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="机构" name="5">
            <div class="tabs_input" v-if="elementKey !=  null">
              <span v-for="(etem, index) in elementKey.organization" :key="index"
                @click="searchKeyword(etem.name)">{{etem.name}}
                <span style="color: #B6B7E0">({{etem.number}}次)</span>；
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="时间" name="6">
            <div class="tabs_input" v-if="elementKey !=  null">
              <span v-for="(etem, index) in elementKey.time" :key="index"
                @click="searchKeyword(etem.name)">{{etem.name}}
                <span style="color: #B6B7E0">({{etem.number}}次)</span>；
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="物品" name="7">
            <div class="tabs_input" v-if="elementKey !=  null">
              <span v-for="(etem, index) in elementKey.goods" :key="index"
                @click="searchKeyword(etem.name)">{{etem.name}}
                <span style="color: #B6B7E0">({{etem.number}}次)</span>；
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="数字" name="8">
            <div class="tabs_input" v-if="elementKey !=  null">
              <span v-for="(etem, index) in elementKey.number" :key="index"
                @click="searchKeyword(etem.name)">{{etem.name}}
                <span style="color: #B6B7E0">({{etem.number}}次)</span>；
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="证件号码" name="9">
            <div class="tabs_input" v-if="elementKey !=  null">
              <span v-for="(etem, index) in elementKey.idNum" :key="index"
                @click="searchKeyword(etem.name)">{{etem.name}}
                <span style="color: #B6B7E0">({{etem.number}}次)</span>；
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="keyword_again" @click="keyElements">
          <img style=" width: 0.24rem; margin-right: 0.05rem" src="../../assets/meetingEditor/again.png" />
          <span class="span14">重新提取</span>
        </div>
      </div>
      <!-- 音频摘要 -->
      <!-- <Abstract style="float: left" v-if="meetingSummary.length > 0" :meetingSummary="meetingSummary"></Abstract> -->
      <!-- 音频内容 -->
      <div class="editContainer" id="editContainer" @keydown="submit1($event)" @keyup="submit1($event)" @scroll="handleScroll">
        <ul class="edit_container" id="edit_container" ref="edit_container" >
          <li v-for="(item, index) in recordContent" :key="index">
            <div class="transferSpanDiv" style="outline: none;" contentEditable="true"
                 @focus="closePopover()">
              <el-input @change="spokemanChange(item.micName, index)" v-model="item.micName" 
                        :style="{width:textWidth(item.micName)}"
                        v-if="item.micName != '' || isShowSpk">
                {{item.micName}}
              </el-input><br v-if="item.micName != '' || isShowSpk">
              <template v-for="(text, textIndex) in item.textList">
                <template v-if="(text.tagStatus && textIndex > 0)">
                  <br v-show="text.transferText != ''" :key="text.textIndex">
                  <span v-show="text.transferText != ''" :key="text.textIndex" style="margin-left: 32px"></span>
                </template>
                <template v-if="(textIndex == 0)">
                  <span v-show="text.transferText != ''" :key="text.textIndex" style="margin-left: 32px"></span>
                </template>
                <template>
                  <!-- <span v-else contentEditable="false">&ensp;&ensp;&ensp;</span> -->
                  <span :starttime="text.startTime" :endtime="text.endTime" :startsecond="text.startsecond" :recordid="text.recordID" 
                        :tagStatus="text.tagStatus" :key="text.recordID"
                        ref="transferSpan" id="transferSpan" class="transferSpan" @click="chooseSpan(text.recordID, $event)"
                        v-html="changeColor(text.transferText)" @dblclick="checkTime(text.startsecond,$event)"
                        @click.right.prevent="biaozhu(text,index,textIndex,$event)">
                  </span>
                </template>
                
              </template>
            </div>
              
          </li>
        </ul>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-popover
      placement="top"
      v-model="isPopover1"
      visible-arrow="true"
      :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }"
      id="popover1">
      <el-button @click="biaozhuit">
        <div style="float: left; margin-right:0.1rem; margin-top: -0.02rem">
          <img style="width: 0.18rem" src="../../assets/meetingEditor/biaoji_logo.png" />
        </div>
        标记结果
      </el-button><br>
      <el-button @click="addNewCustomWords">
        <div style="float: left; margin-right:0.1rem; margin-top: -0.02rem">
          <img style="width: 0.18rem" src="../../assets/meetingEditor/shengwen_logo.png" />
        </div>
        添加声纹
      </el-button>
    </el-popover>

    <!-- 取消标注框 -->
    <el-popover
      placement="top"
      v-model="isPopover2"
      visible-arrow="true"
      id="popover2"
      ref="unbiaozhu">
      <el-button @click="unbiaozhuit">
        <i class="el-icon-collection-tag"></i>
        取消标记
      </el-button><br>
    </el-popover>

    <!-- 选择声纹人员 -->
    <Dialog
      title="选择声纹人员"
      okTxt="确定"
      noTxt="取消"
      width="3.8rem"
      :visible="addCustom"
      :cancel="closeAddCustom"
      :upload="addCustomWords">
      <span>声纹人员名称：</span><br><br>
      <el-autocomplete
        width="4rem"
        v-model="voiceName"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect"
        @blur="handleChange"
      ></el-autocomplete><br><br><br>
    </Dialog>
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
          <ExportCard v-if="exportData.length > 0" 
                      :exportData="exportData"
                      type="meeting"
                      v-on:getRadio="getRadio">
          </ExportCard>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import Header from "../../components/header";
import Dialog from '../../components/dialog.vue'
import Abstract from './components/abstract.vue'
import MeetingInfo from "./components/Info.vue";
import ExportCard from '../meetingManagement/components/exportCard.vue'
import Global from "../../api/Global";
import WaveSurfer from "wavesurfer.js";
import RecordRTC from 'recordrtc'
import { ask_exportMeetingWord, ask_getRecordByMeetingId, ask_update, ask_list, ask_save, ask_updateTransferText,
         ask_checkMark, ask_updateAllTransfertext, ask_updateContent, ask_updateAbstracts, ask_getTagText,
         ask_findElements}from "../../api/meeting";
import { ask_findClusterList, ask_addVoicePrint, ask_findClusterdbList, ask_addClusterdbr } from "../../api/cluster";
import { ask_checkAudio } from "../../api/voice";
import { ask_getWordTemplate } from '../../api/subsection'

export default {
  components: {
    Header, MeetingInfo, Dialog, Abstract, ExportCard
  },
  data() {
    return {
      cursor: 0, // 当前操作的序号
      nowNum: 0, // 当前查询的序号
      totalNum: 0, // 查询文字的总序号
      currFile: 1,
      startsecond: -1,
      currentSecond: 0,  // 当前是在第几秒的位置播放
      duration: 0, // 秒数
      parentIndex: -1, // 第几段
      index: -1, // 第几句
      select_num: null, // 选择内容的位置
      choose_num: null, // 框柱内容的位置
      current_id: null, // 选择的内容
      recorder: null, // 录音
      // stream: MediaStream,
      stream: null,
      volume: 50, // 音量大小
      innerHTML: '', // 内容
      tagText: '', // 会议标注
      RID: '', // 当前选择的语音id
      exportName: '', // 导出名称
      voiceName: '', // 选择的声纹人员名称
      clusterId: '', //选择的声纹人员id
      voiceId: '', // 
      voicedbID: '', // 声纹库ID
      searchText: '', // 搜索的内容
      replaceText: '', // 替换的内容
      after: '', // 没收到最终结果之前的
      activeName: '1', // 会议信息中关键要素上方菜单栏
      textAlign: 'left', //文字对齐方向
      currentTime: "00:00:00", // 当前音频播放的时间
      isShowSpk: false, // 是否显示已经为空的说话人
      isSave: true, // 说话人是否为空
      isExportShow: false, // 导出框的显示与否
      chooseBiaoji: false, // 标记结果不可被语音输入
      isClick: false, // 是否可以重复点击
      isOpen: false, // 是否可以重复开启
      addCustom: false, // 添加声纹人员弹窗
      isPopover1: false, //标注弹出层
      isPopover2: false,//取消标注弹出层
      wavesurfer: null, //wavesurfer插件
      visible: false, // 替换框的显示与否
      visable: true, // 是否启用上下按钮
      isPlaying: false, // 音频是否在播放中
      isPlaying1: false, // 音频是否已加载完
      isLoadingWave: false, // 是否在加载音频文件
      voiceStatus: false, // 语音输入图标切换
      users: {}, // 创建人信息
      currentEvent: '', // 鼠标
      currentEventPath: '',
      tongbu: '', // 循环
      edit: '会议管理', // 头部标题主名字
      edit1: '会议编辑', // 头部标题副名字
      showInfo: '3', // 显示框
      showInfo1: '3', // 会议信息
      radio: '0', // 导出内容
      showInfoStatus:{
        AllNone: '0', // 全部关闭
        Search: '1', // 搜索
        SearchAndReplace: '2', // 替换
        info: '3', // 会议信息
        voice: '4' // 音量
      },
      meeting: {
        //会议记录表单信息
        id: this.$route.params.id,
        title: "",
        address: "",
        attendee: "",
        endTime: "",
        keyword: "",
        startTime: "",
        status: "",
        summary: "",
      },
      contents: ["会议记录", "原始记录", "标记结果", "会议音频"],
      checkedcontents: [], // 被选中的导出内容
      exportData: [], // 导出信息
      keyWords: [], // 关键词
      uploadFileInfo: {}, // 上传文件信息
      elementKey: {}, // 人名地名机构等
      searchNum: [], // 单个句子关键词出现的位置
      doNum: [], // 撤回暂存keyNode的数组 用于判定是否是中文
      restaurants: [], // 声纹人员列表
      meetingSummary: [], // 会议摘要
      Summaries: [], // 摘要的句子
      historyContent: [], // 历史操作记录
      audioFiles: [], // 音频段数
      recordContent: [{ textList: {} }], // 转写记录列表
      recordContent1: [], // 转写记录列表1
      intervalTime: window.setUp ? window.setUp.time : '',
    };
  },
  created(){
    var lett = this
    // document.onkeydown = function (e) {
    //   if (window.event.ctrlKey && window.event.keyCode == 90 && $(e.target).attr('contentEditable')) {//ctrl+z
    //     lett.cursor--
    //     console.log(lett.cursor);
    //     return
    //   }
    // }
    //全局点击绑定关闭标注浮层
    document.onclick = function (e) {
      var popover1 = $('#popover1')
      var popover2 = $('#popover2')
      if (popover1 !== e.target && popover1.has(e.target).length == 0) {
        lett.isPopover1 = false
      }
      if (popover2 !== e.target && popover2.has(e.target).length == 0) {
        lett.isPopover2 = false
      }
    }
  },
  mounted() {
    document.addEventListener('paste',this.paste)
    //禁止拖入
    document.getElementById("editContainer").addEventListener("drop",function(event){
      event.preventDefault();
    })
    if (this.wavesurfer != null) {
      this.wavesurfer && this.wavesurfer.destroy();
      $("#WAVE").html("");
    }
    
    this.edit = sessionStorage.edit
    this.edit1 = sessionStorage.edit1
    this.getMeetingContent();
  },
  destroyed() {
    // 离开该页面需要移除这个监听的事件，不然会重复粘贴
    // location.reload()
    
    document.removeEventListener('paste',this.paste)
    // window.('paste', this.handleScroll)
  },
  watch:{
    '$route'(from, to) { // 页面跳转停止播放音频
      this.wavesurfer && this.wavesurfer.destroy()
      this.recordContent = []
    },
    'volume'(){
      this.wavesurfer.setVolume(this.volume / 100)
    },
    'isPlaying'(){
      if(this.isPlaying){
        this.tongbu = setInterval(() =>{
          this.muiltiTransfer()
        },500)
      } else {
        clearInterval(this.tongbu)
      }
    }
  },
  beforeDestroy: function () { // 页面刷新停止播放音频
    this.wavesurfer && this.wavesurfer.destroy()
    this.recordContent = []

  },
  methods: {
    // 禁止回车
    submit1(event){
      this.isShowSpk = true
      // 禁用回车
      document.onkeypress = function() {
        if (event.keyCode == 13)
          return false;
      }
    },

    // 复制粘贴
    paste() {
      // 获取解析粘贴的文本
      // console.log("黏贴了？");
      // let text = (event.clipboardData || window.clipboardData).getData('text');
      event.preventDefault();
      var text;
      var clp = (event.originalEvent || event).clipboardData;
      console.log(clp);
      // 兼容针对于opera ie等浏览器
      if (clp === undefined || clp === null) {
        text = window.clipboardData.getData("text") || "";
        if (text !== "") {
          if (window.getSelection) {
          // 针对于ie11 10 9 safari
            var newNode = document.createElement("span");
            newNode.innerHTML = text; 
            window.getSelection().getRangeAt(0).insertNode(newNode);
          } else {
            // 兼容ie10 9 8 7 6 5
            document.selection.createRange().pasteHTML(text);
          }
        }
      } else {
        // 兼容chorme或hotfire
        text = clp.getData('text/plain') || "";
        if (text !== "") {
            document.execCommand('insertText', false, text);
        }
      }
    },

    //监听滚动条事件
    handleScroll() {
      this.isPopover1 = false
      this.isPopover2 = false
    },

    textWidth (value) {
      var n = 0 // 有几个数字
      var m = 0 // 有几个字母
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      var zimuReg = /^[a-zA-Z]+$/
      var zimuRe = new RegExp(zimuReg)
      if (value == '' || value == 0 || value == undefined) {
        return '0.3rem'
      } else {
        for(let i = 0; i < String(value).length; i++) {
          if(numRe.test(String(value)[i])) { // 是数字
            n++
          } else if (zimuRe.test(String(value)[i])){ // 是字母
            m++
            // console.log("字母");
          }
        }
        return (0.3 + ((String(value)).length - n - m) * 0.17 + n * 0.095 + m * 0.082) + 'rem'
      }
    },

    // 展示设置框
    changeShow(s) {
      this.closePopover()
      if(s == 'Search' && this.showInfo !== '1') { // 搜索
        this.showInfo = this.showInfoStatus.Search
      } else if(this.showInfo == this.showInfoStatus[s]){
        this.showInfo = this.showInfoStatus.AllNone
      }
    },

    changeShow1(s) {
      if (s == 'info' && this.showInfo1 !== '3') { // 音频信息
        this.showInfo1 = '3'
        document.getElementById('editContainer').style.height = 'calc(100% - 240px)'
      } else if(s == 'keyword' && this.showInfo1 !== '4'){ // 关键要素
        this.showInfo1 = '4'
        document.getElementById('editContainer').style.height = 'calc(100% - 310px)'
      } else {
        this.showInfo1 = '0'
        document.getElementById('editContainer').style.height = 'calc(100% - 40px)'
      }
    },

    // 关键词检索
    keyElements(){
      if(this.isSearch) {
        this.$message.info('正在重新提取关键词，请勿重复操作，稍作等待！')
        return
      }
      this.isSearch = true
      // 弹出框
      this.instance = this.$notify({
        title: '消息',
        message: '关键要素提取中，请稍后...',
        duration: 0
      });
      var form = {
        'meetingId': this.meeting.id
      }
      ask_findElements(form).then(res =>{
        this.isSearch = false
        if(res.success) {
          this.instance.close()
          this.elementKey = res.result
        }
      })
    },

    // 点击选择的内容
    chooseSpan(index, e){
      let select = window.getSelection()
      if(select.anchorOffset > select.extentOffset){
        this.choose_num = select.extentOffset
      } else {
        this.choose_num = select.anchorOffset
      }
      console.log(select, "??");
      if(this.voiceStatus) { // 如果正在语音输入中
        return
      } else if ((e.target.className && e.target.className == 'biaozhu') || 
                 (e.currentTarget.children.length && e.currentTarget.children[0].className == 'biaozhu')) {
        // 不在有标注的地方语音输入
        this.current_id = null
        this.select_num = null
        this.choose_num = null
        this.chooseBiaoji = true
        return
      }
      this.chooseBiaoji = false
      this.current_id = index
      this.select_num = select.anchorOffset
    },

    // 语音输入
    voiceInput(){
      if(this.isClick) {
        if(this.voiceStatus) {
          if(this.isOpen) {
            this.$message.info('请在三秒后再关闭语音输入')
          } else {
            this.$message.info('正在停止语音输入，请稍后')
          }
        }
        return
      }
      if(this.current_id == undefined && this.select_num == undefined) {
        if(!this.chooseBiaoji){
          this.$message.info('请将鼠标点击输入位置')
          return
        } else {
          this.$message.info('当前选择的句子有标记结果，请重新选择输入位置')
          return
        }
      }
      this.isClick = true
      // 正在语音输入
      if(this.voiceStatus) {
        this.stopRecord() // 停止输入
      } else { // 开启语音输入
        for(let i = 0; i < this.recordContent.length; i++){
          for(let j = 0; j < this.recordContent[i].textList.length; j++){
            if(this.recordContent[i].textList[j].recordID == this.current_id) {
              this.recordContent[i].textList[j].transferText = 
                this.recordContent[i].textList[j].transferText.slice(0, this.select_num) + '<i></i>' + 
                this.recordContent[i].textList[j].transferText.slice(this.select_num);
              this.after = this.recordContent[i].textList[j].transferText
            }
          }
        }
        this.websocketTest()
      }
    },

    // 插入语句
    insertStr(id, start, newStr){
      for(let i = 0; i < this.recordContent.length; i++){
        for(let j = 0; j < this.recordContent[i].textList.length; j++){
          if(this.recordContent[i].textList[j].recordID == id) {
            this.recordContent[i].textList[j].transferText = 
              this.after.slice(0, start) + newStr + this.after.slice(start);
            this.after = this.recordContent[i].textList[j].transferText
          }
        }
      }
      this.select_num += newStr.length
    },

    // 插入语句
    insertStr1(id, start, newStr){
      for(let i = 0; i < this.recordContent.length; i++){
        for(let j = 0; j < this.recordContent[i].textList.length; j++){
          if(this.recordContent[i].textList[j].recordID == id) {
            this.recordContent[i].textList[j].transferText = 
              this.after.slice(0, start) + newStr + this.after.slice(start);
          }
        }
      }
    },

    // 连接websocket
    websocketTest() {
      let that = this;
      this.startRecord()
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        this.socket = new WebSocket('ws://' + '192.168.0.215:6555' + '/stt/realtime'+ '?lang=ZH');
        // this.socket = new WebSocket(Global.domain.replace("http", "ws") + "/projection/" + sessionStorage.cid);
        this.socket.onopen = function () {
          that.isOpen = true
          setTimeout(() => {
            that.isClick = false
            that.isOpen = false
          },3000)
          that.voiceStatus = true
          for(let k = 0; k < $(".transferSpanDiv").length; k++) {
            // 取消能编辑的功能
            $(".transferSpanDiv")[k].setAttribute('contentEditable', false)
          }
          console.log("Socket 已打开");
        };
        //获得消息事件
        this.socket.onmessage = function (msg) {
          var data = JSON.parse(msg.data);
          switch (data.Msg) {
            case "getstatus":
              that.socket.send(`{"Msg":"getstatus","Type":"response","Seq":0,"Passive":true,"Status":1000,"Device":"` + sessionStorage.getItem("cid") + `","Name":"Passive-ldy2","ChannelList":[{"ChannelID":0,"IsOnline":true}],"CodecList":["pcm"],"Version":"v1.2","TextWanted":true}`)
              break;
            case "start":
              that.socket.send('{"Msg":"start","Type":"response","Seq":1,"ChannelList":[0],"Status":1000}')
              var aaa = new FormData
              // that.socket.send('{"byte[328]"}')
              break;
            case "realtime":
              if(!data.Tmp){ // 最终结果
                that.insertStr(that.current_id, that.select_num, data.Text)
              } else { // 临时结果
                that.insertStr1(that.current_id, that.select_num, data.Text)
              }
              break;
            case "error":
              console.log(data);
              break;
            default :
              break;
          }
        };
        //关闭事件
        this.socket.onclose = function () {
          console.log("Socket已关闭");
          that.isClick = false
          that.voiceStatus = false
          for(let i = 0; i < that.recordContent.length; i++){
            for(let j = 0; j < that.recordContent[i].textList.length; j++){
              if(that.recordContent[i].textList[j].transferText.indexOf('<i></i>') != -1) {
                var n = that.recordContent[i].textList[j].transferText.replace('<i></i>', '')
                that.recordContent[i].textList[j].transferText = n
              }
            }
          }
          for(let k = 0; k < $(".transferSpanDiv").length; k++) {
            // 恢复能编辑的功能
            $(".transferSpanDiv")[k].setAttribute('contentEditable', true)
          }
        };
        // //发生了错误事件
        // this.socket.onerror = function () {
        //   //此时可以尝试刷新页面
        //   that.websocketTest()
        // }
      }
    },

    // 开始录音
    startRecord(){
      var that = this
      // mediaDevices可提供对相机和麦克风等媒体输入设备的连接访问
      window.navigator.mediaDevices.getUserMedia({
        audio: {echoCancellation:true},
        video: false
      }).then((stream) => {
        this.stream = stream;
        this.recorder = RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/wav',
          recorderType: RecordRTC.StereoAudioRecorder,
          desiredSampRate: 16000, 
          numberOfAudioChannels: 1,
          timeSlice: 1000,
          bufferSize: 16384,
          ondataavailable: this.sendData,
        });
        this.recorder.startRecording();
        console.log('Start recording!');
      }).catch(function(err) {
        console.log('当前浏览器不支持开启麦克风!');
        that.voiceStatus = false
      });
    },
    
    // 结束录音
    stopRecord(){
      this.$message.info('正在停止语音输入，预计需要5s')
      if (this.recorder != null) {
        console.log('Stop recording!');
        let recorder = this.recorder
        recorder.stopRecording();
        this.socket.send('{"Msg":"stop","Type":"request","Seq":0}')
        let stream = this.stream;
        stream.getAudioTracks().forEach(track => track.stop()); 
      }
    },

    // 给WS发送信息
    sendData(blob) {
      blob.arrayBuffer().then(buffer => {
        let raw = buffer.slice(44);
        this.socket.send(raw);
      });
    },

     // 说话人变了
    spokemanChange(spokeman, i) {
      this.isSave = true
      if(spokeman == ''){
        this.isSave = false
        this.$message.info("说话人不可为空")
        return
      } else if (spokeman.length > 20) {
        this.isSave = false
        this.$message.info("说话人不可超过20位")
      }
    },

    //保存当前编辑内容
    savehtml() {
      if(!this.isSave){
        this.$message.info("说话人为空或超出20位")
        return
      }
      this.closePopover()
      var RC = this.recordContent
      // 弹出框
      this.instance = this.$notify({
        title: '消息',
        message: '会议保存中，请稍后...',
        duration: 0
      });
      $(".transferSpan").removeClass("curr_span")
      if (!this.meeting.id) {
        return
      }
      let ul = document.getElementById("edit_container");
      let lis = ul.getElementsByTagName("li");
      let n = 0; // 判断是否是前三句
      let TT = ""
      let recordIDs = [] // 全部ID
      let recordIDs1 = [] // 除了空内容以外的ID、
      let fenduan = false
      let meetingInfo = new Array
      let spokeman = ''
      let haveSpk = -1
      // 拿到全部的ID
      for (let l = 0; l < RC.length; l++) {
        for(let k = 0; k < RC[l].textList.length; k++) {
          recordIDs.push(RC[l].textList[k].recordID)
        }
      }
      for (let j = 0; j < lis.length; j++) {
        for (let i = 0; i < lis[j].children.length; i++) {
          for(let k = 0; k < lis[j].children[i].children.length; k++) {
            this.innerHTML = ''
            this.innerHTML = lis[j].children[i].children[k].innerHTML
            if(this.innerHTML.indexOf("</span>") != -1){
              // 当前更改后的会议内容 拿不到数据！！！！！！！
              this.returnInnerHTML(this.innerHTML)
            }
            var recordid = lis[j].children[i].children[k].getAttribute("recordid") // 当前这句话的id
            if(lis[j].children[i].children[k].getAttribute('class') == 'el-input') { // children为说话人
              haveSpk = 0
              spokeman = this.recordContent[j].micName
            } else if (lis[j].children[i].children[k].getAttribute('class') == null){ // 段落分段
              k++
              fenduan = true
            } else {
              if(haveSpk == 0 && k == 1 && recordid != null && this.innerHTML != '') { // 每个说话人的第一句必分段
                recordIDs1.push(parseInt(recordid))
                meetingInfo.push({
                  'recordid': parseInt(recordid),
                  'transferText': this.innerHTML,
                  'tagStatus': 1,
                  "spokeman": spokeman
                })
                n++
                TT = TT + this.innerHTML
              } else if (haveSpk == 0 && k == 1 && recordid == null) { // 整段内容被删除后重新添加一句话
                recordIDs1.push(recordIDs[j])
                let tagStatus = (fenduan == true ? 1 : (i == 0 ? 1 : 0))
                meetingInfo.push({
                  "recordid": recordIDs[j],
                  "transferText": this.innerHTML,
                  "tagStatus": tagStatus,
                  "spokeman": spokeman
                })
                fenduan = false
              } else if (k != 1 && this.innerHTML == "") { // 内容被直接删除
                fenduan = false
              } else {
                if(recordid == null) {
                  meetingInfo[meetingInfo.length - 1].transferText += this.innerHTML
                } else {
                  recordIDs1.push(parseInt(recordid))
                  let tagStatus = (fenduan == true ? 1 : 0)
                  fenduan = false
                  meetingInfo.push({
                    "recordid": parseInt(recordid),
                    "transferText": this.innerHTML,
                    "tagStatus": tagStatus,
                    "spokeman": spokeman
                  })
                  if(n < 3) {
                    TT = TT + this.innerHTML
                  }
                  n++
                }
              }
            }
          }
        }
      }
      let recordIDs2 = recordIDs.filter(item=>{ // 内容都被删了的ID
        return recordIDs1.every(item2=>{
          return item != item2;
        })
      })
      for(let y = 0; y < recordIDs2.length; y++){
        meetingInfo.push({
          "recordid": recordIDs2[y],
          "transferText": null,
          "tagStatus": 0,
          "spokeman": null
        })
      }
      console.log(meetingInfo);
      // 保存会议内容
      var form = {
        'meetingInfo': meetingInfo
      }
      ask_updateAllTransfertext(form).then(res => {
        this.instance.close()
        if(res.success){
          this.$message.success("会议保存成功!")
          // 前三句上传
          var form2= new FormData
          form2.append("meetingId", this.meeting.id)
          form2.append("transferText", TT)
          ask_updateContent(form2)
          this.getMeetingContent();
        } else {
          this.$message.error("会议保存失败!")
        }
      })
    },

    // 有标注的内容
    returnInnerHTML(innerHTML, index){
      var isNewBiaozhu = innerHTML.indexOf("", index ? index : 0)
      if(isNewBiaozhu != -1){
        var before = "<span style=\"background-color: rgb(247, 234, 160);\">"
        var after = "<span style=\"background-color: #f7eaa0\" class=\"biaozhu\">"
        innerHTML = innerHTML.replaceAll(before, after)
      }
      var isBiaozhu = innerHTML.indexOf("</span>", index ? index : 0)
      if(isBiaozhu != -1){
        innerHTML = innerHTML.slice(0,isBiaozhu + 7) + "&#8239;"
                    + innerHTML.slice(isBiaozhu + 8);
        this.returnInnerHTML(innerHTML, isBiaozhu + 7)
      } else {
        this.innerHTML = innerHTML
      }
    },

    // 查找关键词
    searchKeyword(item, s){
      this.closePopover()
      if(s == 'keyword'){
        this.searchText = item.split('(')[0]
      } else {
        this.searchText = item
      }
    },

    // 查找改变颜色
    changeColor(item) {
      if(this.searchText == ''){
        return item
      }
      let searchText = this.searchText;  //获取动态变化的搜索词
      if (searchText !== '') { //若搜索词不为空，对搜索词进行替换
        return item.replace(new RegExp(searchText, 'g'), '<a class="aChange" style="background-color: yellow" >' + searchText + '</a>');
      } else {
        return item;
      }
    },

    // 改变搜索框中的值
    changeSearchNodeInput (value) {
      this.nowNum = 0
      setTimeout(() => {
        this.searchAchange("find")
      }, 1)
    },

    // 弹出框隐藏时
    closePopover(s) {
      this.searchText = ''
      this.replaceText = ''
      this.nowNum = 0
      this.totalNum = 0
      if(s == 'save') {
        setTimeout(() =>{
          this.savehtml()
        },100)
      }
    },

    // 搜索
    searchAchange(s) {
      this.totalNum = $(".aChange").length;  //获取所有a标签的数量，这个页面所有的a标签都是由查询替换获得的，所以a标签的数量可以当场查询到关键词的数量
      if(this.totalNum != 0){ //如果查询关键词存在，跳到第一个关键词的位置，标头增1，走满一圈归0
        this.visable = false
        // scrollIntoView方法只在原生document中可以使用，jquery中没有这个方法，参数默认是true，将这个元素置于页面第一行（如果页面可以滑动函数才生效）
        for(let i = 0; i < this.totalNum; i++){
          $(".aChange")[i].style.backgroundColor = 'yellow'
        }
        if(s == 'down'){ // 搜索下一个
          if(this.nowNum < (this.totalNum - 1)) {
            this.nowNum += 1;
          } else if(this.nowNum == (this.totalNum - 1)) {
            this.nowNum = 0;
          }
          $(".aChange")[this.nowNum].style.backgroundColor = 'orange'
          $(".aChange")[this.nowNum].scrollIntoView(); 
        } else if(s == 'up') { // 搜索上一个
          if(this.nowNum > 0) {
            this.nowNum -= 1;
          } else if(this.nowNum == 0) {
            this.nowNum = this.totalNum - 1;
          }
          $(".aChange")[this.nowNum].style.backgroundColor = 'orange'
          $(".aChange")[this.nowNum].scrollIntoView(); 
        } else if (s == 'find'){
          $(".aChange")[this.nowNum].style.backgroundColor = 'orange'
          $(".aChange")[this.nowNum].scrollIntoView(); 
        }
      }
    },

    // 替换
    Replace(s, num){
      if (this.searchText != '') {
        this.visible = false
        if(s == 'All') { // 全部替换
          this.ReplaceAll(this.searchText, this.replaceText)
        }else if (s == 'One') { // 单个替换
          this.ReplaceOne(this.searchText, this.replaceText, num)
        }
        this.totalNum = 0
        this.searchNum = []
        this.searchText = ''
        this.replaceText = ''
      } else {
        this.$message.info('查找词不能为空')
      }
    },

    // 单个替换
    ReplaceOne(search, replace, num) {
      // num 为当前要替换的
      var n = 0 // 用于确定当前句和num所在的句子是同一句
      var num1 = 0 // $('.transferSpan')中num所在的句子序号
      var RC = this.recordContent
      var trans = $('.transferSpan')
      for(let k = 0; k < trans.length; k++){
        this.searchNum = []
        if(trans[k].innerText.indexOf(search) != -1){ // 文本中有搜索的内容
          this.searchNum.push(trans[k].innerText.indexOf(search))
          this.moreSearch(trans[k].innerText, search, trans[k].innerText.indexOf(search) + 1)
          if(this.searchNum.length > 1) { // 在单句话中查询词出现了多次
            if(n < num && num <= (n + this.searchNum.length)) {
              num1 = k 
              $('.aChange')[num - 1].innerHTML = replace
            }
            n = n + this.searchNum.length
          } else{ //在单句话中查询词只出现了一次
            n++
            if(n == num) {
              num1 = k
              $('.aChange')[num - 1].innerHTML = replace
            }
          }
        }
      }
      for(let i = 0; i < RC.length; i++) {
        for(let j = 0; j < RC[i].textList.length; j++){
          if(RC[i].textList[j].recordID == trans[num1].getAttribute('recordid')) {
            RC[i].textList[j].transferText = trans[num1].innerText
            return
          }
        }
      }
    },

    // 判断单句话中是否有多个查询词
    moreSearch(sentence, search, num){
      var m = num
      if(sentence.indexOf(search, m) != -1) {
        m = sentence.indexOf(search, m)
        this.searchNum.push(m)
        this.moreSearch(sentence, search, m + 1)
      } else {
        return
      }
    },

    // 共用的替换方法
    ReplaceAll(search, replace) {
      var RC = this.recordContent
      for(let i = 0; i < RC.length; i++) {
        for(let j = 0; j < RC[i].textList.length; j++){
          if(RC[i].textList[j].transferText.indexOf(search) != -1){
            RC[i].textList[j].transferText = RC[i].textList[j].transferText.replaceAll(search,replace)
          }
        }
      }
    },

    // 关闭替换框
    closeReplace() {
      this.showInfo = ""
      this.closePopover()
    },

    // 初始化WaveSurfer
    initWaveSurfer(id) {
      var that = this;
      var wavesurfer = (this.wavesurfer = WaveSurfer.create({
        audioRate: this.rate, // 播放速度
        container: "#WAVE",
        waveColor: "#cccccc", // 波纹颜色
        progressColor: "#4777e7", // 已播放的波纹颜色
        hideScrollbar: false, //隐藏波纹的横坐标
        height: 74,
      }));
      wavesurfer.on("ready", () => {
        that.isPlaying1 = true
        if (that.isPlaying && that.startsecond >= 0) {
          that.wavesurfer.play(that.startsecond);
        }
        // var currIndex = that.audioFiles.indexOf(that.currFile)
        // if (currIndex < that.audioFiles.length - 1) {
        //   that.currFile = that.audioFiles[currIndex + 1]
        //   that.wavesurfer.load(Global.domain + '/meeting/audio?meetingId=' + this.meeting.id + '&count=' + that.audioFiles[currIndex + 1])
        // }
      });
      wavesurfer.on("error", (msg) => {});
      wavesurfer.on("finish", (progress) => {
        that.isPlaying1 = false
        var currIndex = that.audioFiles.indexOf(that.currFile);
        if (currIndex < that.audioFiles.length - 1) {
          that.currFile = that.audioFiles[currIndex + 1];
          that.wavesurfer.load(
            Global.domain +
              "/meeting/audio?meetingId=" +
              this.meeting.id +
              "&count=" +
              that.audioFiles[currIndex + 1]
          );
          that.startsecond = 0;
          that.isPlaying = true;
        } else if (currIndex == that.audioFiles.length - 1){
          that.currFile = 1;
          that.wavesurfer.load(Global.domain + "/meeting/audio?meetingId=" + this.meeting.id + "&count=" + that.audioFiles[0]);
          that.startsecond = 0;
          that.isPlaying = false;
          that.currentTime = "00:00:00"
        }
      });
      wavesurfer.on("play", () => {
        this.isPlaying = true;
      });
      wavesurfer.on("audioprocess", () => {
        // 获取当前播放的时间
        var currIndex = that.audioFiles.indexOf(that.currFile);
        this.currentTime = this.changeTime(that.wavesurfer.getCurrentTime(), currIndex);
        // that.muiltiTransfer()
      });
      wavesurfer.on("interaction", () => {
        // 获取当前播放的时间
        var currIndex = that.audioFiles.indexOf(that.currFile);
        setTimeout(() => {
          this.currentTime = this.changeTime(that.wavesurfer.getCurrentTime(), currIndex);
        }, 1);
      });

      // TODO 采集端会将每个会议的音频合成为一个文件，所以只需要加载一次。
      wavesurfer.load(Global.domain + "/meeting/audio?meetingId=" + this.meeting.id + "&count=" + that.audioFiles[0]);
      // wavesurfer.load('../static/1.wav')
      //this.isLoadingWave = true
    },

    // 格式化当前播放音频的时间
    changeTime(seconds, duan) {
      seconds = Number(seconds) + duan * 120; // 第几段乘以分段时间
      // 不足两位数补零
      var hour = Math.floor(seconds / 60 / 60)
        .toString()
        .padStart(2, "0"); // 小时
      var min = Math.floor(seconds / 60 - hour * 60)
        .toString()
        .padStart(2, "0"); // 分钟
      var second = Math.floor(seconds - min * 60 - hour * 3600)
        .toString()
        .padStart(2, "0"); // 秒数
      var time = hour + ":" + min + ":" + second;
      return time;
    },

    // 修改当前播放的字体颜色
    muiltiTransfer() {
      var now = this.currentSecond = this.wavesurfer.getCurrentTime() + (this.currFile - 1) * this.audioTime
      now = now * 1000
      var trans = $('.transferSpan')
      trans.removeClass('curr_span')
      $('.transferSpan').each(function () {
        var tran = $(this)
        var starttime = parseInt(tran.attr('starttime'))
        if(starttime <= now) {
          var endtime = parseInt(tran.attr('endtime'))
          if(endtime >= now) {
            var scrollTo = tran
            var container = $('.edit_container')
            scrollTo.addClass('curr_span')
            container.scrollTop(
              scrollTo.offset().top - container.offset().top + container.scrollTop() - 5
            )
          }
        }
      })
    },

    binarySearch(arr, left, right, findVal) {
      //当left>right时，就没找到，结束
      if (left > right) {
        return -1
      } 
      else if(left + 1 >= right) {
        return left
      }
      let mid = Math.floor((left + right) / 2);
      let midVal = arr[mid].getAttribute('starttime');
      console.log('正在查询' + left + '-' + right + '条', '我想查找的是' + findVal, );
      if (findVal > midVal) {
        //向右递归
        return this.binarySearch(arr, mid + 1, right, findVal);
      } else if (findVal < midVal) {
        //向左递归
        return this.binarySearch(arr, left, mid - 1, findVal);
      } else {
        return mid;
      }
    },

    binarySearch1(arr, left, right, findVal) {
      //当left>right时，就没找到，结束
      if (left > right) {
        return -1
      } 
      else if(left + 1 == right || left == right) {
        return left
      }
      let mid = Math.floor((left + right) / 2);
      let midVal = arr[mid].getAttribute('endtime');
      // console.log('正在查询' + left + '-' + right + '条', '我想查找的是' + findVal, '本次最大是' + arr[left], '最小是' + arr[right], '中值是' + arr[mid]);
      if (findVal > midVal) {
        //向右递归
        return this.binarySearch(arr, mid + 1, right, findVal);
      } else if (findVal < midVal) {
        //向左递归
        return this.binarySearch(arr, left, mid - 1, findVal);
      } else {
        return mid;
      }
    },

    //播放或暂停
    playOrPause() {
      if(!this.isPlaying1) {
        return
      }
      this.isPlaying = !this.isPlaying;
      this.wavesurfer && this.wavesurfer.playPause();
    },

    // 音频切换到上一段
    lastParagraph() {
      if(!this.isPlaying1) {
        return
      }
      var currIndex = this.audioFiles.indexOf(this.currFile);
      if (currIndex == 0) {
        this.$message.info("已经是第一段音频了！");
      } else if (currIndex < this.audioFiles.length + 1) {
        this.currFile = this.audioFiles[currIndex - 1];
        this.wavesurfer.load(
          Global.domain +
            "/meeting/audio?meetingId=" +
            this.meeting.id +
            "&count=" +
            this.audioFiles[currIndex - 1]
        );
        this.startsecond = 0;
      }
    },

    // 音频切换到上一段
    nextParagraph() {
      if(!this.isPlaying1) {
        return
      }
      var currIndex = this.audioFiles.indexOf(this.currFile);
      if (currIndex == this.audioFiles.length - 1) {
        this.$message.info("已经是最后一段音频了！");
      } else if (currIndex < this.audioFiles.length - 1) {
        this.currFile = this.audioFiles[currIndex + 1];
        this.wavesurfer.load(
          Global.domain +
            "/meeting/audio?meetingId=" +
            this.meeting.id +
            "&count=" +
            this.audioFiles[currIndex + 1]
        );
        this.startsecond = 0;
      }
    },

    //单击直接播放当前句
    checkTime(startsecond, e) {
      if (
        startsecond > this.currFile * this.audioTime ||
        startsecond < (this.currFile - 1) * this.audioTime
      ) {
        var num = Math.ceil(startsecond / this.audioTime);
        this.currFile = num;
        if (this.audioFiles.indexOf(num) >= 0) {
          this.wavesurfer.load(Global.domain + "/meeting/audio?meetingId=" + this.meeting.id + "&count=" + num);
          this.isPlaying = true;
          startsecond -= (this.currFile - 1) * this.audioTime;
          this.startsecond = startsecond;
          return;
        }
      }
      startsecond -= (this.currFile - 1) * this.audioTime;
      this.startsecond = startsecond;
      this.wavesurfer.play(startsecond);
    },

    // 查询会议摘要
    getTagText(){
      var form = {
        meetingID: this.meeting.id,
      };
      ask_getTagText(form).then(res => {
        if (res.success) {
          this.tagText = res.result.tagText
        }
      })
    },

    // 获取会议内容
    getMeetingContent(s) {
      let that = this;
      // if(mid!=''){
      //   this.meeting.id = mid
      // }
      if (this.wavesurfer != null) {
        this.wavesurfer && this.wavesurfer.destroy();
        $("#WAVE").html("");
      }
      var form = {
        meetingId: this.meeting.id,
      };
      // 查询会议内容
      ask_getRecordByMeetingId(form).then((res) => {
        if (res.success) {
          console.log(res, "res");
          res = res.result;
          var meetingInfo = this.meeting = res.meetingInfo;
          this.elementKey = res.elementKey
          this.uploadFlag = meetingInfo.flag;
          this.keyWords = res.keyWords
          var recordContent = res.recordcontent || [];
          // recordContent = [
          //   {
          //     "recordID": 24700,
          //     "meetingID": null,
          //     "channelID": 0,
          //     "duration": 3,
          //     "startTime": 5940,
          //     "endTime": 9750,
          //     "transferText": "哈喽哈喽，",
          //     "tagStatus": true,
          //     "comment": null,
          //     "micname": "说话人1",
          //     "startsecond": 5.94,
          //     "spokeman": "说话人1",
          //     "endsecond": 9.75
          //   },
          //   {
          //     "recordID": 24701,
          //     "meetingID": null,
          //     "channelID": 0,
          //     "duration": 4,
          //     "startTime": 12090,
          //     "endTime": 16740,
          //     "transferText": "你好，",
          //     "tagStatus": true,
          //     "comment": null,
          //     "micname": "说话人2",
          //     "startsecond": 12.09,
          //     "spokeman": "说话人2",
          //     "endsecond": 16.74
          //   }
          // ]
          if (recordContent && recordContent.length > 0) {
            this.zimucontent = recordContent[0].transferText;
          }
          if (res.htmlbody != "") {
            this.$refs.edit_container.innerHTML = res.htmlbody;
            $(".transferSpan").each(function () {
              var time = $(this).attr("starttime");
              $(this).click(function () {
                that.wavesurfer.play(time);
              });
            });
          } else {
            this.recordContent = []
            setTimeout(() => {
              this.recordContent = this.formatMeetingText(recordContent);
            }, 1)
            
            // this.addParagraphTag()
          }
          if (res.users.length > 0) {
            this.users = res.users[0];
          }
          this.audioFiles = res.fileNum;
          this.audioTime = res.audioTime;
          // 音频时长
          if(recordContent.length > 0){
            var endTime = recordContent[recordContent.length - 1].endTime
            if(endTime) {
              this.duration = parseInt(endTime / 1000);
            }
          }
          // 总段数
          this.segNumbers = Math.ceil(this.duration / this.audioTime);
          // 音频宽：防止音频过短，渲染不完
          let dWidth = Math.round(this.duration * 20);
          this.waveContainerWidth =
            this.wrapperWidth > dWidth ? this.wrapperWidth : dWidth;
          if (this.audioFiles.length == 0) {
            for (let k = 0; k < this.segNumbers; k++) {
              this.audioFiles[k] = k + 1;
            }
          }
          // console.log("文件数量-----" + this.audioFiles);
          this.initWaveSurfer(meetingInfo.audioFilePath);
          // this.addWaterMarker(meetingInfo.summary);
        }
      });
      this.getTagText()
    },

    // 为了能显示成气泡样式，将会议内容转换为二位数组
    formatMeetingText(recordList) {
      var list = [];
      var index = -1;
      var preMicName = "";
      for (var i = 0, length = recordList.length; i < length; i++) {
        var record = recordList[i];
        var mic = record.micname;
        if (preMicName == mic && mic != '') {
          list[index].textList.push(record);
        } else if (record.transferText == ''){ // 如果内容为空,则过滤掉
          continue
        } else {
          index++;
          list[index] = {
            micNum: index,
            micName: mic,
            textList: [record],
          };
          preMicName = mic;
        }
      }
      return list;
    },

    // 导出弹框
    exportShow() {
      this.SearchExport()
      this.exportName = this.meeting.title
      this.isExportShow = true
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
      var url = Global.domain + '/meeting/exportAnything?meetingID[]=' + this.meeting.id
                + '&exportName=' + this.exportName + '&needWord=' + needWord 
                + '&needOriginal=' + needOriginal + '&needTagText=' + needTagText
                + '&needAudio=' + needAudio + '&templateId=' + this.radio
      window.open(url)
      this.cancelExport()
    },

    // 取消导出
    cancelExport(){
      this.exportName = ''
      this.checkedcontents = []
      this.isExportShow = false
    },

    // 选择选定文本+ 弹出标注按钮
    biaozhu(item, parentIndex, index, e) {
      this.currentEvent = window.event || e;
      this.currentEventPath = this.currentEvent.path || (this.currentEvent.composedPath && this.currentEvent.composedPath());
      this.parentIndex = parentIndex;
      this.index = index;
      
      var oEvent = e || event;
      this.isPopover1 = false
      this.isPopover2 = false;
      if (window.getSelection() != '' && item.transferText.indexOf(window.getSelection()) != -1) {
        // 标记框
        if(this.currentEventPath[0].className != 'biaozhu') {
          this.isPopover1 = true
          // console.log(oEvent.clientY, 'clientY');
          // console.log((oEvent.clientY - 100));
          // console.log(oEvent.clientX, 'clientX');
          // console.log((oEvent.clientX - 10));
          if(oEvent.clientY > 640) {
            $('.el-popover').css({'top': oEvent.clientY - 70 + 'px', 'left': oEvent.clientX - 10 + 'px'})
          } else {
            $('.el-popover').css({'top': oEvent.clientY + 15 + 'px', 'left': oEvent.clientX - 30 + 'px'})
          }
        } else{
          // 取消标记框
          this.isPopover2 = true
          if(oEvent.clientY > 640) {
            $('.el-popover').css({'top': oEvent.clientY - 70 + 'px', 'left': oEvent.clientX - 15 + 'px'})
          } else {
            $('.el-popover').css({'top': oEvent.clientY + 15 + 'px', 'left': oEvent.clientX - 30 + 'px'})
          }
        }
      } else if (item.transferText.indexOf('#3da38c') != -1 || item.transferText.indexOf('#f7eaa0') != -1) {
        if(this.currentEventPath[0].className == 'biaozhu') {
          // 取消标记框
          this.isPopover2 = true
          if(oEvent.clientY > 640) {
            $('.el-popover').css({'top': oEvent.clientY - 70 + 'px', 'left': oEvent.clientX - 15 + 'px'})
          } else {
            $('.el-popover').css({'top': oEvent.clientY + 15 + 'px', 'left': oEvent.clientX - 30 + 'px'})
          }
        } else{
          return
        }
      } else if (window.getSelection() != '' && item.transferText.indexOf(window.getSelection()) == -1 &&
                 window.getSelection().baseNode == window.getSelection().extentNode) { // 标记未保存的内容
        // console.log(window.getSelection().baseNode == window.getSelection().extentNode);
        if(window.getSelection)
        this.$message.info('请先保存后再标记');
      } else {
        this.$message.error('暂不能跨句标记');
        return;
      }
      this.RID = ''
      this.RID = item.recordID
    },

    // 添加声纹人员
    addNewCustomWords() {
      this.isPopover1 = false
      var form = {
        "query": '', // 搜索内容
      }
      // 获取声纹人员
      ask_findClusterList(form).then(res => {
        this.restaurants = res.result
      })
      this.addCustom = true
    },

    // 关闭添加声纹人员弹框
    closeAddCustom() {
      this.addCustom = false
      this.voiceName = ''
    },

    // 返回数据
    querySearch(queryString, cb) {
      let restaurants = []
      for (let i = 0; i < this.restaurants.length; i++) {
        restaurants.push({value: this.restaurants[i].voiceName + "(" + this.restaurants[i].id + ")"})
      }
      // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    // 筛选数据
    createFilter(queryString) {
      return (restaurant) => {
        // toLowerCase() 方法用于把字符串转换为小写。
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    // 选择后触发的方法
    handleSelect(item) {
      this.voiceName = item.value.split("(")[0]
      this.clusterId = item.value.match(/\(([^)]*)\)/)[1]
    },
    
    // 失去焦点后触发的方法
    handleChange(){
      this.clusterId = ''
    },

    // 选择好声纹对象后添加
    addCustomWords() {
      this.addCustom = false
      // 获取声纹库Id
      ask_findClusterdbList().then(res => {
        if(res.result.length > 0){
          this.voicedbID = res.result[0].voicedbId
          this.addCuster()
        } else {
          // 如果没有声纹库 则添加
          ask_addClusterdbr().then(res =>{
            ask_findClusterdbList().then(res =>{
              this.voicedbID = res.result[0].voicedbId
              this.addCuster()
            })
          })
        }
      })
    },

    // 给声纹库添加音频
    addCuster(){
      var form = new FormData()
      form.append("voiceName", this.voiceName)
      form.append("clusterId", this.clusterId)
      form.append("voiceDbId", this.voicedbID)
      form.append("meetingId", this.meeting.id)
      form.append("recordId", this.RID)
      ask_addVoicePrint(form).then(res => {
        if(res.success){
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
      this.voiceName = ''
      this.clusterId = ''
    },
    

    //标注
    biaozhuit() {
      let Selectedlength = window.getSelection() ? window.getSelection().toString().length : document.selection.createRange() ? document.selection.createRange().text.length : 0
      if (Selectedlength === 0) {
        return
      }
      // 修改所选区域的样式
      var choiceText = window.getSelection().toString()
      var currentItem = this.recordContent[this.parentIndex].textList[this.index]
      currentItem.transferText = currentItem.transferText.slice(0, this.choose_num)
        + currentItem.transferText.slice(this.choose_num).replace(choiceText, '<span style="background-color: #f7eaa0" class="biaozhu">'
        + choiceText + '</span>&#8239;')
      console.log(currentItem.transferText);
      // return
      this.blurToFinish()
      this.isPopover1 = false
    },

    //取消标注
    unbiaozhuit() {
      var currentItem = this.recordContent[this.parentIndex].textList[this.index]
      if(currentItem.transferText){
        currentItem.transferText = currentItem.transferText.replace(this.currentEventPath[0].outerHTML + '&#8239;', this.currentEventPath[0].innerHTML)
      }
      this.blurToFinish()
      this.isPopover2 = false
    },

    // 标注(或者取消标注)后自动保存
    blurToFinish: function () {
      var currentItem = this.recordContent[this.parentIndex].textList[this.index]
      var form = new FormData()
      form.append("recordID", currentItem.recordID)
      form.append("transferText", currentItem.transferText)
      form.append("tagStatus", currentItem.tagStatus)
      ask_updateTransferText(form).then(res => {
        if(res.success) {
          this.getTagText()
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/page.scss";
@import "../../style/span.scss";
@import "../../style/button.scss";

.volume-div{
  width: 2.3rem;
  display: flex;
  align-items: center;
}

::v-deep .el-input-group>.el-input__inner{
  height: 0.46rem;
  // width: 2rem;
}

::v-deep .el-input-group__append {
  width: 0.3rem;
}

::v-deep .el-input{
  height: 0.46rem;
  width: calc(100% - 1.1rem);
}

::v-deep .el-input__inner{
  height: 0.46rem;
}

.page {
  .Wave {
    margin-top: 1px;
    background-color: #fff;
    border-bottom: 1px solid #e9eaee;
    height: 75px;
    img{
      cursor: pointer;
      margin-top: 0.22rem;
    }
    .WaveSurfer {
      float: left;
      width: calc(100% - 4.05rem);
    }
    .currentSpan {
      height: 75px;
      line-height: 75px;
      margin-left: 0.1rem;
      margin-right: 0.2rem;
      float: right;
      width: 1.4rem;
      font-size: 0.35rem;
      color: #303247;
    }
  }
  .contentCard {
    min-height: 580px;
    height: calc(100% - 180px);
    .center{
      position: relative;
      box-shadow: 0 0.05rem 0.2rem 0.05rem #EAEBEF;
      height: 180px;
      margin-top: 20px;
      font-size: 15px;
      ::v-deep .el-tabs__content{
        width: 100% !important;
        height: 100% !important;
      }
      .keyword_again{
        top: 20px;
        right: 20px;
        position: absolute;
        display: flex;
        align-items: center;
        align-content: center;
        cursor: pointer;
      }
      ::v-deep .el-tabs__item{
        padding: 0 30px;
        height: 62.5px;
        line-height: 62.5px;
        text-align: center;
      }
      .tabs_two{
        .tabs_input{
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px;
          height: 172.5px;
        }
        ::v-deep .el-tabs__item{
          color: #AFB2C1;
          padding: 0 30px;
          height: 62.5px;
          line-height: 62.5px;
          text-align: center;
        }
        ::v-deep .el-tabs__item.is-active {
          color: #4158c4 !important;
        }
        ::v-deep .el-tabs__active-bar{
          background-color: #4158c4;
        }
      }
    }
    .top {
      height: 0.25rem;
      line-height: 0.25rem;
      color: #777688;
      .popoverContent{
        position: relative;
        top: calc(50% - 1.8rem);
        left: calc(50% - 2.5rem);
        width: 6rem;
        .el-input{
          width: calc(100% - 1rem);
        }
        ::v-deep .el-input__inner{
          width: 100%; 
        }
        ::v-deep .el-tabs__content{
          height: 1.8rem;
        }
      }
      .topOperation{
        cursor: pointer;
        float: left;
        img{
          width: 0.2rem;
          margin-right: 0.1rem;
        }
      }
      .el-button{
        margin-top: -0.1rem;
      }
    }
    
    .editContainer{
      margin-top: 20px;
      width: 100%;
      height: calc(100% - 240px);
      overflow-y: auto;
      .curr_span {
        color: #3098fe !important;
      }
      .edit_container{
        padding-top: 0.05rem;
        padding-left: 0.2rem;
        padding-right: 0.2rem;
        height: 100%;
        line-height: 2.5em;
        ::v-deep .el-input__inner{
          text-align:center;
          padding: 0 10px;
          border: #8e97c0;
          color: #fff;
          background-color: #8e97c0;
          max-width: 300px;
          height: 0.35rem;
        }
        ::v-deep .el-input__inner:focus {
          border-color: #fff !important;
        }
        .spokeman1{
          color: #30353b;
          background-color: #fff;
        }
        .spokeman{
          padding: 0.05rem 0.1rem;
          border-radius: 0.05rem;
          margin-bottom: 0.05rem;
          font-size: 15px;
          color: #fff;
          background-color: #8e97c0;
        }
        .transferSpanDiv{
          // letter-spacing: 1px;
          // color: #30353b;
          // .el-input{
          //   display: block;
          // }
          .transferSpan{
            cursor: pointer;
            letter-spacing: 1px;
            // user-select:none; // 取消双击选中文字
            // padding-top: 0.1rem;
            white-space: normal;
            word-break: break-word; // 字母数字自动换行
            color: #30353b;
            ::v-deep i{
              margin-bottom: 2px;
              vertical-align:middle;
              display: inline-block;
              width: 2px;
              height: 1.2em;
              background-color: #090;
            }
            ::v-deep .biaozhu{ // 防止被标注的span左边也出现空白区域
              margin-left: 0px;
            }
            ::v-deep span:first-child{ // 防止标注内容清空以后重新添加 又有空白区域
              margin-left: 0px;
            }
          }
          // ::v-deep #text:first-child{
          //   margin-left: 32px;
          // }
          ::v-deep span:first-child{
            margin-left: 32px;
          }
          
        }
      }
    }
  }
  .SearchDialog{
    background-color: pink;
    width: 200px;
    height: 100px;
    top: 230px;
    left: 300px;
  }
  ::v-deep .el-popover{
    padding: 0px;
    min-width: 0px;
    .el-button{
      border: 0px;
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
