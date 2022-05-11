<template>
  <div id="logo" class="logo">
    <div class="logo-img">
      <img class="logoimg" @click="goMain" v-if="showLeft" :src="logoimg" />
      <img class="menuimg" @click="show" :src="menu" />
    </div>
  </div>
</template>

<script>
export default {
  props:{
    showLeftMenu: Boolean
  },
  data() {
    return {
      logoimg: require('../../../assets/mainInterFace/ulang_logo.png'),
      menu: require('../../../assets/mainInterFace/menu.png'),
      showLeft: true
    }
  },
  watch:{
    'showLeftMenu'() {
      if (this.showLeftMenu) {
        setTimeout(() => {
          this.showLeft = this.showLeftMenu
        }, 500)
      } else {
        this.showLeft = this.showLeftMenu
      }
    }
  },
  methods:{
    goMain(){
      this.$router.push({'path': '/meeting/mainInterface'})
    },

    show(){
      this.$emit("clickShow")
    },
  }
}
</script>

<style lang="scss" scoped>
.logo{
  .logo-img{
    height: 0.8rem;
    border-bottom: 1px solid #465078;
    .logoimg{
      cursor: pointer;
      width: 1.61rem;
      margin-top: 0.25rem;
      margin-left: 0.25rem;
    }
    .menuimg{
      width: 0.3rem;
      cursor: pointer;
      float: right;
      margin-top: 0.32rem;
      margin-right: 0.34rem;
    }
  }
  ::v-deep .el-divider{
    background-color: #3c4872;
  }
}
</style>