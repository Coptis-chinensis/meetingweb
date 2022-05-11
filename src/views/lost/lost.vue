<template>
  <div class="lost_bg">
    <div class="lost_img">
      <img src="../../assets/lost_logo.png" />
    </div>
    <div class="lost_span">
      <span>抱歉，您访问的网页不存在</span><br><br>
      <el-button @click="goIndex">返回首页</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
      }
    },
    methods: {
      goIndex: function () {
        this.$router.push({'path': `/?Device=` + sessionStorage.getItem("cid") + `&Name=` + sessionStorage.getItem("cName")})
      }
    }
  }
</script>
<style lang="scss">
  .lost_bg{
    padding: 10%;
    width: 100%;
    height: 100%;
    background-color: #F5F8FB;
    .lost_img{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .lost_span{
      padding-top: 40px;
      text-align: center;
      color: #4E678C;
      font-size: 48px;
      .el-button{
        color: #FFFFFF;
        height: 60px;
        width: 250px;
        background-color: #4359C3;
      }
    }
  }
</style>

