<template>
  <div class="showSpan">
    <!-- <div class="left"></div> -->
    <span>{{title}}</span>
    <div v-if="urlSrc" class="more" @click="goRoute">
      <span class="moreSpan">更多 ></span>
    </div>
    
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    urlSrc: String
  },
  methods: {
    goRoute(){
      this.$router.push({path: this.urlSrc})
    }
  }
}
</script>

<style lang="scss" scoped>
  .showSpan{
    position: relative;
    height: 0.6rem;
    line-height: 0.6rem;
    color: #2C3149;
    font-size: 0.20rem;
    padding-left: 0.25rem;
    // border-bottom: 0.01rem solid #EAEBEF;
    .more{
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0.35rem;
      .moreSpan{
        font-size: 0.14rem;
        color: #212C5E;
        &:hover{
          color: #5690fc;
        }
      }
    }
    .left{
      float: left;
      margin-top: 0.23rem;
      margin-left: 0.3rem;
      width: 0.04rem;
      height: 0.21rem;
      background-color: #5690fc;
    }
  }
</style>
