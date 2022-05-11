<template>
  <div class="export">
    <div class="exportCard" v-for="(item, index) in exportData" :key="index">
      <div v-if="item.id - 1 == radio">
        <div class="cardImg" style="border: 2px solid #495cab;">
          <el-image :src="item.imgPath" :preview-src-list="imgPath[index].path"></el-image>
        </div>
        <div class="cardInfo">
          <span class="span6">{{item.name}}</span>
          <div v-if="item.type == 'word'" class="word">
            <span class="span7">{{item.type}}</span>
          </div>
          <div v-else-if="item.type == 'txt'" class="txt">
            <span style="color: #44bcda" class="span7">{{item.type}}</span>
          </div><br>
          <el-radio v-model="radio" :label="item.id - 1">默认模板</el-radio>
        </div>
      </div>
      <div v-else>
        <div class="cardImg">
          <el-image :src="item.imgPath" :preview-src-list="imgPath[index].path"></el-image>
        </div>
        <div class="cardInfo">
          <span class="span6">{{item.name}}</span>
          <div v-if="item.type == 'word'" class="word">
            <span class="span7">{{item.type}}</span>
          </div>
          <div v-else-if="item.type == 'txt'" class="txt">
            <span style="color: #44bcda" class="span7">{{item.type}}</span>
          </div><br>
          <el-radio v-model="radio" :label="item.id - 1">默认模板</el-radio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props:{
    exportData: Array,
    type: String
  },
  data(){
    return{
      imgPath: [], // 大图地址
      radio: window.setUp 
             ? this.type == 'meeting' 
              ? parseInt(window.setUp.wordTemplate) - 1 : parseInt(window.setUp.fileWordTemplate) - 1
             : 0 ,
      imgVisible: false, // 大图显示弹框
    }
  },
  beforeMount(){
    for(let i = 0; i < this.exportData.length; i++){
      this.imgPath.push({
        path: [this.exportData[i].imgPath]
      })
    }
  },
  watch:{
    'radio'() {
      this.$emit("getRadio", this.exportData[this.radio].id)
    }
  },
  methods:{
    // 查看大图
    lookImg(text) {
      this.imgVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog__body{
    padding: 0.2rem;
  }

  .export{
    display: grid;
    justify-content: center;
    justify-items: center;
    margin-bottom: 0.2rem;
    grid-template-columns: repeat(4, 25%); //总共六列，每列列宽是14.4%;
    // grid-template-rows: repeat(1, 3rem); // 从上至下，每行高度为2rem;
    // row-gap: 0.3rem; // 上下间距
    // column-gap: 0.3rem; // 左右间距
    // gap:0 0.2rem; // 总间距
    .exportCard{
      text-align: center;
      .cardImg{
        background-color: #f7f7f7;
        border: 2px solid #f7f7f7;
        margin-bottom: 0.15rem;
        height: 1.6rem;
        .el-image{
          height: 100%;
          width: 100%
        }
      }
      .cardInfo{
        .word{
          display: inline-flex;
          border-radius: 0.03rem;
          padding: 0.02rem 0.05rem;
          background-color: #daf6ea;
        }
        .txt{
          display: inline-flex;
          border-radius: 0.03rem;
          padding: 0.02rem 0.05rem;
          color: #44bcda;
          background-color: #e7f6fa;
        }
        .el-radio{
          margin-top: 0.1rem;
        }
      }
    }
  }
  
</style>