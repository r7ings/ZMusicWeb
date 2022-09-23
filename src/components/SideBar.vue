<template>
  <div class="root">
    <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :default-active="activeMenu"
      @select="menuSeleted"
      style="height: 750px; width: 230px; text-align: center"
    >
      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu> -->
      <el-menu-item class="space" index="99" disabled> </el-menu-item>
      <el-menu-item index="1">
        <i class="el-icon-zoom-in"></i>
        <span>发现音乐</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-headset"></i>
        <span slot="title">最近播放</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-star-on"></i>
        <span slot="title">我的喜欢</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">我的列表</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-0" style="font-size: 12px"
            >默认列表</el-menu-item
          >
          <el-menu-item
            v-for="(item, index) in userMusicList"
            :key="index"
            :index="`4-${item.index}`"
            style="font-size: 12px"
            >{{ item.title }}</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="5">
        <i class="el-icon-user"></i>
        <span slot="title">个人中心</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      activeMenu: "0",
      userMusicList: [
        {
          index: 1,
          title: "喜羊羊与灰太狼",
        },
        {
          index: 2,
          title: "国宝机甲",
        },
        {
          index: 3,
          title: "大耳朵图图",
        },
        {
          index: 4,
          title: "成龙历险记",
        },
      ],
    };
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    menuSeleted(index, indexArr) {
      if (indexArr[0] == 4) {
        this.$router.push({
          name: "MusicListPage",
          query: {
            index: indexArr[1],
          },
        });
      }
      switch (index) {
        case "1":
          this.$router.push({
            name: "FindMusic",
          });
          break;
        case "2":
          this.$router.push({
            name: "RecentPlay",
          });
          break;
        case "3":
          this.$router.push({
            name: "Favourite",
          });
          break;
        case "5":
          this.$router.push({
            name: "UserCenter",
          });
          break;
      }
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        switch (val.name) {
          case "FindMusic":
            this.activeMenu = "1";
            break;
          case "RecentPlay":
            this.activeMenu = "2";
            break;
          case "Favourite":
            this.activeMenu = "3";
            break;
          case "UserCenter":
            this.activeMenu = "5";
            break;
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
.root {
  height: 750px;
  .space {
    cursor: default;
  }
}
</style>