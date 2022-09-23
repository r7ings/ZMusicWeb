<template>
  <div id="root">
    <div class="container">
      <el-drawer
        title="播放列表"
        :visible.sync="newVisible"
        :direction="direction"
        :modal="false"
        :before-close="close"
        size="380px"
      >
        <el-button plain type="primary" style="float: left" @click="refresh"
          >刷新列表</el-button
        >
        <el-button
          type="warning"
          plain
          style="float: right"
          @click="clearAllPlayingList"
          >移除所有</el-button
        >
        <!-- 列表 -->
        <div>
          <el-table
            :data="playingList"
            @cell-dblclick="selectMusic"
            highlight-current-row
            style="width: 100%"
            ref="list"
          >
            <el-table-column prop="musicName" label="歌名" width="300px">
            </el-table-column>
            <el-table-column prop="musicName" label="移除" width="50px">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  @click="removeFromList(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      direction: "rtl",
      newVisible: false,
      playingList: [],
    };
  },
  methods: {
    refresh() {
      this.$store.dispatch("getPlayingList");
    },
    clearAllPlayingList() {
      this.$store.dispatch("clearAllPlayingList");
    },
    close() {
      //   console.log("close");
      this.$bus.$emit("closeList");
    },
    selectMusic(musicInfo) {
      this.$bus.$emit("changeMusicFromDrawer", musicInfo);
    },
    removeFromList(musicInfo) {
      // console.log(musicInfo);
      this.$bus.$emit("removeMusicFromListFromDrawer", musicInfo);
    },
  },
  props: ["visible", "highLightIndex"],
  computed: {},
  watch: {
    highLightIndex: {
      handler(index) {
        if (!this.$refs.list) return;
        this.$refs.list.setCurrentRow(this.playingList[index]);
      },
    },
    visible: {
      handler(val) {
        if (val) return (this.newVisible = true);
        this.newVisible = false;
      },
    },
    "$store.state": {
      immediate: true,
      deep: true,
      handler() {
        this.playingList = this.$store.state.playingList;
      },
    },
  },
};
</script>

<style scoped>
</style>