<template>
  <div class="abstract">
    <div class="abstractHeader">
      <i class="el-icon-edit-outline"></i>
      <span>会议摘要 ： </span>
    </div>
    <div class="summaries" v-for="(item, index) in meetingSummary" :key="index">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>

export default {
  props:{
    meetingSummary: Array,
  },
  mounted(){
    console.log(this.meetingSummary);
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.abstract{
  width: 100%;
  margin-top: 10px;
  height: 50px;
  line-height: 50px;
  color: #41a28f;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .abstractHeader{
    float: left;
    i{
      font-weight: 700;
      margin-right: 10px;
      font-size: 20px;
      float: left;
      margin-top: 15px
    }
  }
  .summaries{
    max-width: 1.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
    margin-top: 8px;
    margin-bottom: 8px;
    padding: 0 10px;
    float: left;
    border: 0.02rem solid #a2d3ca;
    border-radius: 15px;
    height: 30px;
    line-height: 30px;
  }
}
</style>