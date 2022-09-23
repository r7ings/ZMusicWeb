<template>
  <div class="root">
    <!-- <div class="blurBox"></div> -->
    <el-container class="outerContainer">
      <el-header class="header">
        <Header />
      </el-header>
      <el-container class="container">
        <el-aside style="width: 240px" class="sideBar">
          <SideBar />
        </el-aside>
        <el-main class="routerView">
          <keep-alive exclude="userCenter,favourite,recentPlay">
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
      <el-footer class="footer">
        <Player />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Player from "../components/Player.vue";
import Header from "../components/Header.vue";
import SideBar from "../components/SideBar.vue";
export default {
  name: "LayOut",
  components: { Player, Header, SideBar },
};
</script>

<style lang="less" scoped>
.root {
  width: 100%;
  .blurBox {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(20px);
  }
  .container {
    width: 100%;
    height: 800px;
    .routerView {
      padding-top: 80px;
      width: 100%;
    }
  }
}
.header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 200px;
  // background-color: pink;
  z-index: 999;
  background: url("../../static/background.png");
}
.outerContainer {
  width: 100%;
}
.footer {
  position: fixed;
  bottom: 0px;
  left: 0px;
  // background-color: pink;
  width: 100%;
  height: 150px !important;
  z-index: 999;
  background: url("../../static/background.png");
}
</style>