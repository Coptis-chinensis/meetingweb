<template>
  <div>
    <span class="span3">{{hello}}好，{{oUser.userName}}</span>
    <div style="padding-top: 10px;" ><span class="span3">欢迎使用优浪语音转写助手</span></div>
    <div style="padding-top: 20px">
      <span style="font-size: 0.21rem; color: #C1DFFF;">{{time}}</span>
    </div>
    
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data: function(){
    return {
      oUser: window.oUser ? window.oUser : '', // 用户信息
      hello: '您',
      time: '',
      currentInterval: null //跳秒循环
    }
  },

  created(){
    this.getTime()
  },

  beforeDestroy: function(){
    clearInterval(this.currentInterval)
	},

  methods: {
    getTime() {
      var time = moment().format('HH');
      if(time > 6 && time <= 13) {
        this.hello = '早上'
      } else if (time > 13 && time < 18){
        this.hello = '下午'
      } else {
        this.hello = '晚上'
      }

      var year = moment().format('YYYY');
      var mouth = moment().format('MM');
      var data = moment().format('DD');
      var week = moment().format('d');
      
      if (week == 1) { week = '一' }
      else if(week == 2) {week = '二'}
      else if(week == 3) {week = '三'}
      else if(week == 4) {week = '四'}
      else if(week == 5) {week = '五'}
      else if(week == 6) {week = '六'}
      else if(week == 0) {week = '天'}
      this.time = "今天是" + year + "年" + mouth + "月" + data + "日，星期" + week
      this.setCurrentTime()
    },
    /**
		 * 重复获取时间
		 */
		setCurrentTime: function(){
			this.currentInterval = setInterval(() => {
        var time = moment().format('HH');
        if(time > 6 && time <= 13) {
          this.hello = '早上'
        } else if (time > 13 && time <= 18){
          this.hello = '下午'
        } else {
          this.hello = '晚上'
        }

				var year = moment().format('YYYY');
				var mouth = moment().format('MM');
				var data = moment().format('DD');
			  var week = moment().format('d');
        if (week == 1) { week = '一' }
        else if(week == 2) {week = '二'}
        else if(week == 3) {week = '三'}
        else if(week == 4) {week = '四'}
        else if(week == 5) {week = '五'}
        else if(week == 6) {week = '六'}
        else if(week == 0) {week = '天'}
        this.time = "今天是" + year + "年" + mouth + "月" + data + "日，星期" + week
			}, 1000)
    }
  }
}
</script>