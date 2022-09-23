<template>
  <div v-loading.fullscreen.lock="loading">
    <div class="banner">
      <el-carousel :interval="5000" type="card" height="300px">
        <el-carousel-item v-for="item in banner" :key="item.index">
          <img :src="item.url" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 每日推荐 -->
    <div class="dailyMusic">
      <div class="content">
        <el-badge value="new" :hidden="dotHidden" class="newDot">
          <div class="date">
            <div class="mouth">{{ mouth }}</div>
            <div class="day">{{ day }}</div>
          </div>
        </el-badge>
        <div class="info">每日推荐15首</div>
        <div class="topThree">
          <div
            class="topThreeList"
            v-for="(item, index) in dailyMusicTopThree"
            :key="index"
          >
            <div class="cell">
              <div class="index">{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="singers">
      <el-row>
        <el-col
          :span="3"
          v-for="(item, index) in cards"
          :key="index"
          :offset="index > 0 ? 2 : 0"
        >
          <el-card :body-style="{ padding: '0px' }">
            <img :src="item.imgUrl + '?t=234'" alt="" />
            <div style="padding: 14px; text-align: center">
              <span>{{ item.name }}</span>
              <div>
                <el-button
                  type="text"
                  class="button"
                  @click="showCardList(item, index)"
                  >让我看看</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 弹出列表框 -->
    <div>
      <el-dialog
        custom-class="listBody"
        style="margin-top: -100px"
        :visible="dialogVisible"
        :modal-append-to-body="false"
        :append-to-body="true"
        :lock-scroll="true"
        :destroy-on-close="true"
        @close="closeDialog"
      >
        <div class="title">{{ dialogTitle }}</div>

        <div class="dialogBanner">
          <div class="imgbox">
            <img :src="'' + cardBannerUrl" alt="" />
          </div>
        </div>
        <div class="pagination" v-if="showingList.length != 0">
          <el-pagination
            layout="prev, pager, next"
            :total="showingList.length"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
          >
          </el-pagination>
        </div>
        <!-- 列表 -->
        <el-table
          :data="
            showingList.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          @cell-dblclick="selectMusic"
          class="list"
        >
          <el-table-column
            width="390"
            property="musicName"
            label="歌名"
            align="left"
          ></el-table-column>
          <el-table-column
            width="250"
            align="center"
            property="musicAuthor"
            label="作者"
          ></el-table-column>
          <el-table-column width="100" align="center" label="喜欢">
            <!-- slot-scope可以在table中传值 -->
            <!-- 添加到我的喜欢列表 -->
            <template slot-scope="scope">
              <el-button
                icon="el-icon-star-on"
                :plain="scope.row.isFavourite ? false : true"
                :type="scope.row.isFavourite ? 'success' : 'info'"
                @click="addToFavouriteList(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="添加到播放列表">
            <!-- slot-scope可以在table中传值 -->
            <!-- 添加到我的播放列表 -->
            <template slot-scope="scope">
              <el-button
                icon="el-icon-plus"
                @click="addToPlayingList(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
export default {
  data() {
    return {
      dailyMusicList: [],
      dotHidden: false,
      mouth: "October",
      day: 30,
      cardBannerUrl: "Billboard_inner.png",
      currentPage: 1,
      pageSize: 6,
      dialogTitle: "歌单详情",
      loading: false,
      dialogVisible: false,
      banner: [
        {
          index: "1",
          url: require("../../static/banner_1.jpg"),
        },
        {
          index: "2",
          url: require("../../static/banner_2.jpg"),
        },
        {
          index: "3",
          url: require("../../static/banner_3.jpg"),
        },
        {
          index: "4",
          url: require("../../static/banner_4.jpg"),
        },
      ],
      cards: [],
      showingList: [],
    };
  },
  computed: {
    dailyMusicTopThree: {
      get() {
        return this.dailyMusicList.splice(0, 3);
      },
      set(val) {
        return val;
      },
    },
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
    },
    closeDialog() {
      this.dialogVisible = false;
      this.showingList = [];
    },
    addToPlayingList(item) {
      this.$store.dispatch("singleAdd", item);
    },
    addToFavouriteList(item) {
      this.$store.dispatch("singleAddToFavourite", item);
    },
    //列表双击播放
    selectMusic(item) {
      this.$bus.$emit("tempPlay", item);
    },
    //展示歌单
    showCardList(item, index) {
      var that = this;
      this.currentPage = 1;
      this.dialogTitle = item.name;
      this.loading = true;
      const placeId = index + 1;
      // console.log(placeId);
      switch (placeId) {
        case 1:
          this.cardBannerUrl = "pid1Inner.png";
          break;
        case 2:
          this.cardBannerUrl = "pid2Inner.png";
          break;
        case 3:
          this.cardBannerUrl = "pid3Inner.png";
          break;
        case 4:
          this.cardBannerUrl = "pid4Inner.png";
          break;
        case 5:
          this.cardBannerUrl = "pid5Inner.png";
          break;
      }
      axios({
        method: "post",
        url: "/findMusic/getCards/getInfos",
        params: { placeId },
        timeout: 10000,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.statusCode < 200) return Message.error("服务器返回出错");
          if (res.data.statusCode === 888)
            return Message.warning("此榜单暂无数据");
          that.showingList = res.data.showingList;
          that.showingList.forEach((item) => {
            item.isFavourite = false;
          });
          that.dialogVisible = true;
        })
        .catch((err) => {
          that.loading = false;
          console.log(err);
          Message.error("服务器返回出错", err);
        });
    },
  },

  beforeMount() {
    var that = this;
    axios({
      method: "get",
      url: "/findMusic/getCards",
      timeout: 10000,
    })
      .then((res) => {
        if (res.data.statusCode < 200) return Message.error("服务器返回出错");
        // console.log(res.data);
        that.cards = res.data.cards;
      })
      .catch((err) => {
        console.log(err);
        Message.error("服务器返回出错", err);
      });
  },
};
</script>

<style lang="less" scoped>
.dailyMusic {
  width: 100%;
  height: 130px;
  // background-color: pink;
  .content {
    display: flex;
    border-radius: 10px;
    width: 70%;
    height: 130px;
    background-color: yellow;
    background: url("../../static/dailyMusic.png");
    background-size: 100%;
    background-position: 0px 340px;
    margin: auto;
    .topThree {
      width: 500px;
      height: 110px;
      margin: 10px 20px;
      background-color: pink;
    }
    .info {
      width: 500px;
      height: 130px;
      // background-color: red;
      text-align: left;
      font-size: 50px;
      line-height: 130px;
      margin-left: 100px;
      color: #fff;
    }
    .newDot {
      margin-right: 40px;
    }
    .date {
      width: 130px;
      height: 130px;
      color: #fff;
      // background-color: green;
      .mouth {
        margin-top: 10px;
        text-align: center;
        font-size: 20px;
      }
      .day {
        text-align: center;
        line-height: 80px;
        font-size: 40px;
      }
    }
  }
}
.banner {
  height: 330px;
  // background-color: pink;
  margin-right: 30px;
  img {
    width: 100%;
    height: 100%;
  }
}
.singers {
  margin-top: 40px;
  img {
    width: 100%;
    height: 200px;
  }
}
.list {
  position: relative;
  width: 100%;
}
.listBody {
  position: relative;
  height: 1000px;
  .pagination {
    position: absolute;
    left: 50%;
    bottom: -30px;
    transform: translate(-50%, 0);
    padding-bottom: 30px;
    z-index: 9999999999999999999;
  }
}
.title {
  border: 3px solid rgb(194, 179, 181);
  border-radius: 10px;
  background-color: rgba(24, 20, 21, 0.5);
  position: absolute;
  top: -30px;
  left: 50%;
  color: #e4e4e4;
  transform: translate(-50%);
  font-size: 40px;
}
.dialogBanner {
  width: 100%;
  height: 360px;
  border-radius: 50px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>