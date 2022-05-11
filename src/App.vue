<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    // 通过声明reload方法，控制router-view的显示或隐藏，从而控制页面的再次加载
    
    name: 'App',
    provide () {
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        isShow: true
      }
    },
    methods: {
      reload () {
        this.isShow= false
        this.$nextTick(function () {
          this.isShow= true
        })
      }
    }
  }
</script>

<style lang="scss" src="./style/page.scss"></style>
<style lang="scss" src="./style/button.scss"></style>
<style lang="scss" src="./style/reset.scss"></style>
<style lang="scss" src="./style/span.scss"></style>

<style lang="scss" scoped>
#app {
  // user-select:none; // 双击不能选中
  height: 100%;
  font-family: Helvetica, Arial, 'Microsoft Yahei'  !important; // 设置字体
  -webkit-font-smoothing: antialiased; // 对字体抗锯齿的调整
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

// textarea字体变化
::v-deep .el-text__inner{
  font-family: Helvetica, Arial, 'Microsoft Yahei'  !important;
}

// ::v-deep .el-scrollbar_warp{
//   overflow:auto;
// }

</style>

<style>
.el-tooltip__popper{
  /* left: 0 !important; */
  max-width: calc(100% - 0.4rem);
  /* right: 0.2rem !important; */
}
/* ::-webkit-scrollbar {
  display: none;
} */

</style>