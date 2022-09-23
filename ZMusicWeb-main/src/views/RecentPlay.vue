<template>
  <div>
    <div class="header">
      <div class="title">
        <h1>最近播放</h1>
      </div>
      <div class="buttonBox">
        <el-button class="addAll" type="primary" size="small" plain disabled
          >全部添加至播放列表</el-button
        >
        <el-button
          class="clearAll"
          type="warning"
          size="small"
          plain
          @click="clearRecentPlay"
          >清空记录</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table
        :data="
          recentPlay.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        stripe
        style="width: 100%"
        @cell-dblclick="selectMusic"
      >
        <el-table-column prop="musicName" label="歌名" width="900">
        </el-table-column>
        <el-table-column prop="musicAuthor" label="歌手" width="300">
        </el-table-column>
        <el-table-column prop="time" label="时间"> </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="recentPlay.length"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "recentPlay",
  data() {
    return {
      recentPlay: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    clearRecentPlay() {
      this.recentPlay = [];
      this.$bus.$emit("clearRecentPlay");
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
    },
    selectMusic(item) {
      this.$bus.$emit("tempPlay", item);
    },
  },
  beforeMount() {
    if (!localStorage.getItem("recentPlay")) return;
    this.recentPlay = JSON.parse(localStorage.getItem("recentPlay"));
  },
};
</script>

<style lang="less" scoped>
.header {
  .title {
    h1 {
      font-size: 28px;
    }
  }
  .buttonBox {
    position: relative;
    .clearAll {
      position: absolute;
      right: 50px;
    }
  }
}
.pagination {
  position: fixed;
  bottom: 180px;
  left: 50%;
}
</style>