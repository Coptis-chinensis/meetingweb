<template>
  <div class="layout-wrapper">
    <!-- 左侧菜单栏 -->
    <div id="menu" class="layout-menu" >
      <Logo :showLeftMenu="showLeftMenu" v-on:clickShow="clickShow"></Logo>
      <User :showLeftMenu="showLeftMenu"></User>
      <Menu :showLeftMenu="showLeftMenu"></Menu>
    </div>
    <div class="right-contain">
      <!-- 内容 -->
      <div class="router-com">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from './menu/menu'
import Logo from './logo/logo'
import User from './UserInfo/userInfo'

export default {
  components: {Menu, Logo, User},
  data() {
    return {
      showLeftMenu: true
    }
  },
  mounted() {
  },
  methods: {
    clickShow() {
      this.showLeftMenu = !this.showLeftMenu
      if(!this.showLeftMenu) {
        document.getElementById('menu').style.width = 0.95 + 'rem'
      } else {
        document.getElementById('menu').style.width = 3 + 'rem'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .layout-wrapper {
    height: 100%;
    display: flex;
    .layout-menu {
      height: 100%;
      width: 3rem;
      background-color: #202c5e;
      box-shadow: 0 1px 10px rgba(0,21,41,0.08);
      transition:width 1s;
    }
    .right-contain{
      height: 100%;
      flex: 1;
    }
    .router-com {
      height: 100%;
      overflow-y: auto;
      background-color: #f1f2f7;
    }
  }
</style>