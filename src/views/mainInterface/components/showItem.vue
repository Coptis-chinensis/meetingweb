<template>
  <div class="showInfo">
    <div class="showItem" v-for="(item, index) in voiceStatis" :key="index">
      <span class="totalNum">{{item.num}}</span><br>
      <div class="dian" :style="{backgroundColor:item.color}"></div>
      <span>{{item.data}}</span>
    </div>
 </div>
  
</template>

<script>
export default {
  props:{
    voiceStatis: Array, // 音频统计信息
  },
  mounted(){
  }
}
</script>

<style lang="scss" scoped>
.showInfo{
  position: absolute;
  bottom: 0.3rem;
  width: 100%;
  height: 0.6rem;
  display:table-cell;
  text-align:center;
  vertical-align:middle;
  .showItem{
    display: inline-block;
    width: 33.33%;
    .totalNum{
      font-size: 0.35rem;
    }
    .dian{
      display: inline-block;
      border-radius: 50%;
      width: 0.08rem;
      height: 0.08rem;
      margin-right: 0.05rem;
    }
  }
}

</style>