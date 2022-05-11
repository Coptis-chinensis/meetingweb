<template>
  <div id="elmenu" class="elmenu">
    <el-menu
      router
      :default-active = "mainMenu"
      background-color="#202c5e"
      text-color="#fff"
      active-text-color="#fff"
      :unique-opened = uniqueOpened
    >
      <el-menu-item v-for="(item, index) in menus" :key="index" :index="item.path" :id="item.path">
        <img style="float: left; width: 0.23rem; margin-top: 0.25rem" :src="item.icon">
        <span v-if="showMenu" class="span2" slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>

export default {
  props: {
    showLeftMenu: Boolean
  },
  mounted() {
    if(window.oUser.userName == 'admin' && sessionStorage.getItem("meetingType") == 'web') {
      this.menus = [
        {name: '首页', icon: require('../../../assets/mainInterFace/logo1.png'), path: '/meeting/mainInterface'},
        {name: '会议转写', icon: require('../../../assets/mainInterFace/logo2.png'), path: '/meetingTransfer'},
        {name: '会议管理', icon: require('../../../assets/mainInterFace/logo3.png'), path: '/meeting/meetingManagement'},
        {name: '任务管理', icon: require('../../../assets/mainInterFace/logo7.png'), path: '/task/taskManagement'},
        // {name: '音频转写', icon: require('../../../assets/mainInterFace/logo4.png'), path: '/meeting/voiceTransfer'},
        // {name: '音频管理', icon: require('../../../assets/mainInterFace/logo5.png'), path: '/meeting/voiceManagement'},
        {name: '会议室列表', icon: require('../../../assets/mainInterFace/logo8.png'), path: '/roomList'},
        {name: '设置', icon: require('../../../assets/mainInterFace/logo6.png'), path: '/setting'},
      ]
    } else {
      this.menus = [
        {name: '首页', icon: require('../../../assets/mainInterFace/logo1.png'), path: '/meeting/mainInterface'},
        {name: '会议转写', icon: require('../../../assets/mainInterFace/logo2.png'), path: '/meetingTransfer'},
        {name: '会议管理', icon: require('../../../assets/mainInterFace/logo3.png'), path: '/meeting/meetingManagement'},
        {name: '任务管理', icon: require('../../../assets/mainInterFace/logo7.png'), path: '/task/taskManagement'},
        // {name: '音频转写', icon: require('../../../assets/mainInterFace/logo4.png'), path: '/meeting/voiceTransfer'},
        // {name: '音频管理', icon: require('../../../assets/mainInterFace/logo5.png'), path: '/meeting/voiceManagement'},
        {name: '设置', icon: require('../../../assets/mainInterFace/logo6.png'), path: '/setting'},
      ]
    }
  },
  data() {
    return {
      settingUrl: '', // 设置的url
      settingUrl1: '', // 同上
      // path: '/register',
      uniqueOpened: true, // 是否只保持一个菜单打开
      showMenu: true, // 菜单栏缩小时 是否现实菜单名字
      menus: [] // 菜单栏
    }
  },
  computed: {
    mainMenu() {
      const route = this.$route
      const { meta, path } = route
      // 可以在路由配置文件中设置自定义的路由路径到meta.mainMenu属性中，来控制菜单自定义高亮显示
      if (meta.mainMenu) {
        return meta.mainMenu
      }
      return path
    }
  },
  methods:{
    getSettingUrl(){
      this.menus[5].path = this.$route.path
    }
    
  },
  watch:{
    'showLeftMenu'() {
      if (this.showLeftMenu) {
        setTimeout(() => {
          this.showMenu = this.showLeftMenu
        }, 500)
      } else {
        this.showMenu = this.showLeftMenu
      }
      if(!this.showLeftMenu) {
        document.getElementById('elmenu').style.width = 0.95 + 'rem'
      } else {
        document.getElementById('elmenu').style.width = 3 + 'rem'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .elmenu{
    width: 3rem;
    transition:width 1s;
    .el-menu{
      border: none; // 解决菜单右边不对齐的问题
    }
    // 小菜单被焦点以及点击时
    ::v-deep .el-menu-item:hover{
      background-color: #364387 !important;
      border-left: 0.04rem solid #35bfe4;
      .span2{
        color: #fff;
      }
    }
    ::v-deep .el-menu-item:focus{ // 焦点
      background-color: #364387 !important;
      border-left: 0.04rem solid #35bfe4;
    }
    ::v-deep .el-menu-item.is-active{ // 被点击以后
      background-color: #364387 !important;
      border-left: 0.04rem solid #35bfe4;
      .span2{
        color: #fff;
      }
    }
    ::v-deep .el-menu-item {
      height: 0.67rem !important;
      line-height: 0.67rem;
      img{
        padding-left: 0.1rem;
      }
      
    }
  }
</style>