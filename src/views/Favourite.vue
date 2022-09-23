<template>
  <div>
    <!-- 已登录 -->
    <div v-show="isLogin" class="loged">
      <div class="header">
        <div class="title">
          <h1>我喜欢的歌曲</h1>
        </div>
        <el-button type="success" @click="playFavouriteList"
          >播放我喜欢的歌曲列表</el-button
        >
      </div>
      <!-- 表格主体 -->
      <div class="table">
        <el-table
          :data="
            favouriteList.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          size="small"
          stripe
          style="width: 100%"
          @cell-dblclick="selectMusic"
        >
          <el-table-column
            align="left"
            prop="musicName"
            label="歌名"
            width="600"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="musicAuthor"
            label="歌手"
            width="300"
          >
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="singleAddBtn(scope.row)" round
                >添加到播放列表</el-button
              >
              <el-button type="warning" round @click="cancelLike(scope.row)"
                >取消喜欢</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="favouriteList.length"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 未登录 -->
    <div v-show="!isLogin" class="unLoged">
      <div class="content">
        <div class="imgBox">
          <img :src="require('../../static/unLogin.gif')" alt="" />
        </div>
        <div class="text">
          <h1 style="font-size: 40px">请您先登陆！</h1>
          <el-button @click="refresh" type="success"
            >若已经自动登录成功 点我以获取信息</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "favourite",
  data() {
    return {
      isLogin: false,
      favouriteList: [],
      currentPage: 1,
      pageSize: 8,
    };
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
    },
    selectMusic(item) {
      this.$bus.$emit("tempPlay", item);
    },
    singleAddBtn(item) {
      // console.log(item);
      this.$store.dispatch("singleAdd", item);
    },
    //自动登陆后刷新页面的函数
    refresh() {
      if (!this.$store.state.isLogin)
        return Message.warning("没登陆就是没登陆 不要骗人");
      this.isLogin = true;
      this.$store.dispatch("getFavouriteList");
    },
    playFavouriteList() {
      this.$store.dispatch("playFavouriteList");
    },
    cancelLike(item) {
      this.$store.dispatch("cancelLike", item);
    },
  },
  beforeMount() {
    if (!this.$store.state.isLogin) return;
    this.isLogin = true;
    let account = this.$store.state.userAccount;
    this.$store.dispatch("getFavouriteList", account);
  },
  watch: {
    "$store.state.favouriteList": {
      deep: true,
      handler(val) {
        this.favouriteList = val;
      },
    },
  },
  // computed: {
  //   favouriteList() {
  //     return this.$store.state.favouriteList;
  //   },
  // },
  updated() {
    this.favouriteList = this.$store.state.favouriteList;
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
.unLoged {
  .imgBox {
    float: left;
    margin: 200px 0 0 500px;
  }
  .text {
    float: left;
    margin: 100px 0 0 200px;
  }
}
</style>