<template>
  <div>
    <div class="blurBoxP"></div>
    <div class="audioDiv">
      <audio ref="audio" :src="playingMusicUrl"></audio>
    </div>
    <div class="myControlBar">
      <!-- 歌曲信息框 -->
      <div class="musicInfo" @click="showScrollLycie">
        <div id="title">{{ musicName }}</div>
        <hr />
        <div id="author">
          {{ author }}
        </div>
        <el-button
          v-if="isFavourite"
          class="favourite"
          type="primary"
          icon="el-icon-star-on"
          @click.stop="removePlayingFromFavourite"
          circle
        ></el-button>
        <el-button
          v-if="!isFavourite"
          class="favourite"
          icon="el-icon-star-off"
          @click.stop="addPlayingToFavourite"
          circle
        ></el-button>
      </div>

      <!-- 行内歌词 -->
      <div class="lyric" @click="showScrollLycie">
        <Lyric />
        <el-dialog
          custom-class="myDialog"
          :visible.sync="scrollView"
          fullscreen
          :before-close="scrollHandleClose"
          append-to-body
        >
          <ScrollLyric
            :musicName="musicName"
            :author="author"
            :myPlay="myPlay"
            :lastMusicBtn="lastMusicBtn"
            :nextMusicBtn="nextMusicBtn"
            :isPlaying="isPlaying"
            :progress="musicProgress"
          />
        </el-dialog>
      </div>
      <!--播放模式 前一首 下一首 播放 静音 音量滑块 歌曲列表 -->
      <div class="buttonBoxP" style="display: inline-block">
        <!-- 切换播放模式 -->
        <el-tooltip
          class="item"
          effect="dark"
          :content="modeTip"
          placement="top"
        >
          <el-button
            type="primary"
            size="mini"
            :icon="playModeIcon"
            circle
            plain
            @click="changePlayMode"
          ></el-button>
        </el-tooltip>
        <!-- 上一首 -->
        <el-button
          type="primary"
          size="mini"
          plain
          icon="el-icon-arrow-left"
          @click="lastMusicBtn"
          circle
        ></el-button>
        <!-- 播放 -->
        <el-button
          type="primary"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          v-loading.fullscreen="loading"
          :icon="isPlaying ? 'el-icon-video-pause' : 'el-icon-caret-right'"
          circle
          @click="myPlay"
        ></el-button>
        <!-- 下一首 -->
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-arrow-right"
          @click="nextMusicBtn"
          plain
          circle
        ></el-button>
        <!-- 静音 -->
        <el-button
          type="primary"
          size="mini"
          :icon="isMuted ? 'el-icon-close-notification' : 'el-icon-bell'"
          circle
          plain
          @click="myMute"
        ></el-button>
        <!-- 音量滑块 -->
        <el-slider v-model="voiceValue" class="slider"></el-slider>
        <!-- 播放列表 -->
        <el-button
          id="musicList"
          type="primary"
          size="mini"
          icon="el-icon-tickets"
          circle
          plain
          @click="listShow"
        ></el-button>
      </div>
      <!-- 歌曲播放进度条 -->
      <div class="progressP">
        <span id="now">{{ now | formatTime }}</span>
        <el-slider
          v-model="musicProgress"
          :show-tooltip="false"
          :step="0.00001"
          @change="endSlid"
        ></el-slider>
        <span id="end">{{ end | formatTime }}</span>
      </div>
      <keep-alive>
        <PlayingList :visible="listVisible" :highLightIndex="highLightIndex" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
import { Notification } from "element-ui";
import Lyric from "./Lyric.vue";
import PlayingList from "../components/PlayingList.vue";
import ScrollLyric from "../components/ScrollLyric.vue";
export default {
  name: "Player",
  data() {
    return {
      // 1.defaultList,2.singleLoop,3.ListLoop,4.ListRandom
      isFavourite: false,
      scrollView: false,
      playingMid: 0,
      playMode: 2,
      musicName: "没有正在播放的歌曲",
      author: "",
      voiceValue: 50,
      musicProgress: 0,
      isPlaying: false,
      isMuted: false,
      now: 0,
      end: 0,
      playingMusicUrl: "",
      playingList: [],
      listIndex: 0,
      listVisible: false,
      loading: false,
      recentPlay: [],
      playingLyricUrl: "",
      musicStatus: undefined,
    };
  },
  components: {
    PlayingList,
    Lyric,
    ScrollLyric,
  },
  computed: {
    musicInfoObj() {
      return {
        mid: this.playingMid,
        musicName: this.musicName,
        musicAuthor: this.author,
        musicLyricUrl: this.playingLyricUrl,
        musicUrl: this.playingMusicUrl,
        musicStatus: this.musicStatus,
      };
    },
    highLightIndex: {
      // console.log(this.listIndex);
      get() {
        return this.listIndex - 1;
      },
      set(val) {
        return val;
      },
    },
    playModeIcon() {
      let iconName = "el-icon-warning";
      switch (this.playMode) {
        case 1:
          iconName = "el-icon-platform-eleme";
          break;
        case 2:
          iconName = "el-icon-eleme";
          break;
        case 3:
          iconName = "el-icon-delete-solid";
          break;
        case 4:
          iconName = "el-icon-warning";
          break;
      }
      return iconName;
    },
    modeTip() {
      let tip = "";
      switch (this.playMode) {
        case 1:
          tip = "顺序播放";
          break;
        case 2:
          tip = "单曲循环";
          break;
        case 3:
          tip = "列表循环";
          break;
        case 4:
          tip = "列表随机";
          break;
      }
      return tip;
    },
  },
  methods: {
    addPlayingToFavourite() {
      if (!this.$store.state.isLogin) return Message.warning("请先登录");
      if (!this.playingMid) return Message.warning("无法获取播放歌曲");
      this.$store.dispatch("singleAddToFavourite", this.musicInfoObj);
    },
    removePlayingFromFavourite() {
      if (!this.$store.state.isLogin) return Message.warning("请先登录");
      if (!this.playingMid) return Message.warning("无法获取播放歌曲");
      // console.log(this.playingMid);
      this.$store.dispatch("cancelLike", this.musicInfoObj);
    },
    scrollHandleClose() {
      this.scrollView = false;
    },
    showScrollLycie() {
      this.scrollView = true;
      this.$bus.$emit("initLyricMain");
    },
    // 格式化时间戳 为recentPlay
    getFormtTime(dateTime, flag) {
      if (dateTime != null) {
        //若传入的dateTime为字符串类型，需要进行转换成数值，若不是无需下面注释代码
        var time = parseInt(dateTime);
        var date = new Date(time);
        //获取年份
        var YY = date.getFullYear();
        //获取月份
        var MM =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        //获取日期
        var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        if (flag) {
          //flag为true，显示时分秒格式
          //获取小时
          var hh =
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          //获取分
          var mm =
            date.getMinutes() < 10
              ? "0" + date.getMinutes()
              : date.getMinutes();
          ///获取秒
          var ss =
            date.getSeconds() < 10
              ? "0" + date.getSeconds()
              : date.getSeconds();
          //返回时间格式： 2020-11-09 13:14:52
          return YY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;
        } else {
          //返回时间格式： 2020-11-09
          return YY + "-" + MM + "-" + DD;
        }
      } else {
        return "";
      }
    },
    listShow() {
      this.listVisible = true;
      // console.log(this.listVisible);
    },
    lastMusicBtn() {
      // console.log("上一首");
      this.listIndex -= 2;
      this.getNextMusic();
    },
    nextMusicBtn() {
      // console.log("下一首");
      this.getNextMusic();
    },
    changePlayMode() {
      this.playMode < 4 ? this.playMode++ : (this.playMode = 1);
      localStorage.setItem("playMode", this.playMode);
      if (this.playMode === 4 && !this.randomList) {
        //播放模式为随机播放 且 没有生成过随机列表 保存原播放列表顺序 生成随即列表
        this.oldList = [];
        this.playingList.forEach((item) => {
          this.oldList.push(item);
        });
        let list = this.playingList;
        //打乱
        for (let a = 0; a < list.length + 10; a++) {
          let random = Math.floor(Math.random() * list.length);
          list.push(list[random]);
          list.splice(random, 1);
        }
        this.randomList = list;
      } else if (this.playMode === 4 && this.randomList) {
        //播放模式为随机播放 且 有随机播放列表 将随机播放列表赋值给播放列表
        this.$store.commit("SET_PLAYINGLIST", this.randomList);
        // this.listIndex = 0;
      } else {
        // 播放模式不是随机播放 查询是否有保存的原列表 有的话赋值给播放列表 没有的话不进行操作
        if (this.oldList) {
          this.$store.commit("SET_PLAYINGLIST", this.oldList);
        }
      }
    },
    myPlay() {
      this.isPlaying ? this.$refs.audio.pause() : this.$refs.audio.play();
      this.isPlaying = !this.isPlaying;
    },
    myMute() {
      this.isMuted
        ? (this.$refs.audio.muted = false)
        : (this.$refs.audio.muted = true);
      this.isMuted = !this.isMuted;
    },
    endSlid(val) {
      let nowTime = (this.$refs.audio.duration / 100) * val;
      this.$refs.audio.currentTime = nowTime;
    },
    init() {
      //最近播放数据支持
      let recentObj = {
        musicName: this.musicName,
        musicAuthor: this.author,
        musicUrl: this.playingMusicUrl,
        mid: this.playingMusicUrl.split("/")[5],
        time: this.getFormtTime(Date.now(), true),
      };
      this.playingMid = this.playingMusicUrl.split("/")[5];
      // console.log(recentObj);
      if (this.recentPlay && this.recentPlay.length >= 50) {
        this.recentPlay.pop();
      }
      this.recentPlay.unshift(recentObj);
      localStorage.setItem("recentPlay", JSON.stringify(this.recentPlay));
      //tmp为musicProgress提供数据支持
      let tmp;
      this.isPlaying = false;
      // this.isMuted = false;
      this.musicProgress = 0;
      axios({
        url: "/checkStatus",
        method: "post",
        timeout: 10000,
        params: { mid: this.playingMid },
      })
        .then((res) => {
          if (res.data.statusCode === 299) {
            this.isPlaying = false;
            return Message.error("歌曲状态异常");
          }
          this.$nextTick(() => {
            //开始加载音频数据
            this.$refs.audio.onloadstart = () => {
              this.now = 0;
              //域名下来之前先不要开Loading 以供调试
              //--------------------------------------
              this.loading = true;
              this.timeoutTimer = setTimeout(() => {
                this.loading = false;
                Message.error("歌曲资源加载超时");
              }, 15000);
            };
            //结束加载音频数据
            this.$refs.audio.onloadedmetadata = () => {
              clearTimeout(this.timeoutTimer);
              this.loading = false;
              this.end = this.$refs.audio.duration;
              this.now = 0;
              for (let i = 0; i < this.playingList.length; i++) {
                if (this.playingList[i].mid === this.musicInfoObj.mid) {
                  this.listIndex = i + 1;
                }
              }
            };
            //绑定音频进度更新的回调函数
            this.$refs.audio.ontimeupdate = () => {
              this.$bus.$emit("updateLyric", this.$refs.audio.currentTime);
              this.$refs.audio.currentTime
                ? (this.now = this.$refs.audio.currentTime)
                : (this.now = 0);

              let progress =
                this.$refs.audio.currentTime / this.$refs.audio.duration;
              //取小数点后两位 作为musicProgress的百分比
              progress = progress.toFixed(5);
              if (progress != tmp && progress != 1) {
                // console.log(progress);
                this.musicProgress = progress * 100;
                tmp = progress;
              } else if (progress == 1.0) {
                this.finishPlay();
              }
            };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    finishPlay(index) {
      console.log("播放完成");
      //记录播放完成歌曲
      // axios({
      //   url: "checkStatus",
      //   method: "post",
      //   timeout: 10000,
      //   params: { mid: this.playingMid },
      // }).catch((err) => {
      //   console.log(err);
      // });
      //单曲循环的单独处理
      if (this.playMode === 2) {
        //如果Index===undefined 代表此函数是系统自动触发
        //如果有Index 代表此函数是用户点击了某些按钮触发
        if (index === undefined) {
          this.init();
          this.$refs.audio.play();
          this.isPlaying = true;
        } else {
          this.musicName = this.playingList[index].musicName;
          this.author = this.playingList[index].musicAuthor;
          this.playingMid = this.playingList[index].mid;
          this.playingMusicUrl = this.playingList[index].musicUrl;
          this.$bus.$emit("getLyric", this.playingMid);
          this.listIndex++;
          this.init();
          this.$nextTick(() => {
            this.$refs.audio.play();
            this.isPlaying = true;
          });
        }
      } else {
        this.getNextMusic();
      }
      //按列表顺序播放下一首
    },
    getNextMusic() {
      // 1.顺序播放 2.单曲循环 3.列表循环 4.列表随机
      if (!this.$store.state.isLogin) return (this.isPlaying = false);
      this.playingList = this.$store.state.playingList;
      var cb = () => {
        this.musicName = this.playingList[this.listIndex].musicName;
        this.author = this.playingList[this.listIndex].musicAuthor;
        this.playingMid = this.playingList[this.listIndex].mid;
        this.playingMusicUrl = this.playingList[this.listIndex].musicUrl;
        this.$bus.$emit("getLyric", this.playingMid);
        this.listIndex++;
        this.init();
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.isPlaying = true;
        });
      };
      switch (this.playMode) {
        // 1.顺序播放
        case 1:
          if (this.listIndex + 1 > this.playingList.length) {
            this.isPlaying = false;
            Notification({
              title: "(●'◡'●)",
              message: "已经是最后一首",
              duration: 0,
            });
          } else if (this.listIndex < 0) {
            this.listIndex = 1;
            Notification({
              title: "(●'◡'●)",
              message: "已经是第一首",
              duration: 0,
            });
          } else cb();
          break;
        //2.单曲循环
        case 2:
          if (this.listIndex + 1 > this.playingList.length) {
            this.listIndex = 0;
          } else if (this.listIndex < 0) {
            this.listIndex = this.playingList.length - 1;
          }
          this.finishPlay(this.listIndex);
          break;
        //3.列表循环
        case 3:
          if (this.listIndex + 1 > this.playingList.length) {
            this.listIndex = 0;
          } else if (this.listIndex < 0) {
            this.listIndex = this.playingList.length - 1;
          }
          cb();
          break;
        //4.列表随机
        case 4:
          if (this.listIndex + 1 > this.playingList.length) {
            this.listIndex = 0;
          } else if (this.listIndex < 0) {
            this.listIndex = this.playingList.length - 1;
          }
          cb();
          break;
      }
    },
  },
  watch: {
    //监测播放歌曲Mid变化 来判断这首歌是否存在于收藏列表 用来渲染收藏按钮样式
    playingMid: {
      handler(mid) {
        let favouriteList = this.$store.state.favouriteList;
        for (let i = 0; i < favouriteList.length; i++) {
          if (favouriteList[i].mid === mid) return (this.isFavourite = true);
        }
        this.isFavourite = false;
      },
    },
    //监测音量滑块
    voiceValue: {
      handler(val) {
        localStorage.setItem("playerVoice", val / 100);
        this.$refs.audio.volume = val / 100;
      },
    },
    //检测音乐进度滑块
    musicProgress: {
      handler(val) {
        // console.log(val, this.$refs.audio.duration);
        let nowTime = (this.$refs.audio.duration / 100) * val;
        this.now = nowTime;
        // this.$refs.audio.currentTime = val
      },
    },
    "$store.state.favouriteList": {
      deep: true,
      handler(val) {
        for (let i = 0; i < val.length; i++) {
          if (val[i].mid === this.playingMid) return (this.isFavourite = true);
        }
        this.isFavourite = false;
      },
    },
    "$store.state.playingList": {
      deep: true,
      handler(val) {
        //每次全局的正在播放列表变化 都在这里处理
        //将播放列表交给player组件
        this.playingList = this.$store.state.playingList;
        //归零列表计数器
        // this.listIndex = 0;
        // console.log(this.playingList);
        //如果列表确实有歌曲 那么就调用getListFirstMusic获取列表第一首歌曲
        // if (this.playingList.length > 0) {
        //   this.getListFirstMusic();
        // }
      },
    },
  },
  filters: {
    //格式化时间的过滤器
    formatTime(time) {
      if (time / 3600 > 1) {
        let h = Math.trunc(time / 3600);
        time -= h * 3600;
        let m = Math.trunc(time / 60);
        let s = Math.trunc(time % 60);
        return (
          (h > 9 ? h : "0" + h.toString()) +
          ":" +
          (m > 9 ? m : "0" + m.toString()) +
          ":" +
          (s > 9 ? s : "0" + s.toString())
        );
      } else {
        let m = Math.trunc(time / 60);
        let s = Math.trunc(time % 60);
        return (
          (m > 9 ? m : "0" + m.toString()) +
          ":" +
          (s > 9 ? s : "0" + s.toString())
        );
      }
    },
  },
  beforeMount() {
    // 读取最近播放
    this.recentPlay = JSON.parse(localStorage.getItem("recentPlay")) || [];
    //初始化音量
    localStorage.getItem("playerVoice")
      ? (this.voiceValue = localStorage.getItem("playerVoice") * 100)
      : (this.voiceValue = 50);
  },
  mounted() {
    //旋转唱片
    this.$refs.audio.onplaying = () => {
      this.$bus.$emit("startRoute");
    };
    //结束播放和暂停播放 都停止旋转唱片
    this.$refs.audio.onended = () => {
      this.$bus.$emit("endRoute");
    };
    this.$refs.audio.onpause = () => {
      this.$bus.$emit("endRoute");
    };
    //读取默认播放模式 强制转换为数字格式
    let m = localStorage.getItem("playMode") * 1;
    m ? (this.playMode = m) : (this.playMode = 1);
    if (this.playMode === 4) {
      this.playMode = 3;
    }
    //清空最近播放
    this.$bus.$on("clearRecentPlay", () => {
      this.recentPlay = [];
      localStorage.setItem("recentPlay", JSON.stringify([]));
      Message.success("已清空听歌记录");
    });
    //其他组件需要播放某一首歌的事件
    this.$bus.$on("tempPlay", (item) => {
      this.isPlaying = false;
      var that = this;
      if (!item.mid) return Message.error("mid获取错误 请联系开发者");
      this.playingMid = item.mid;
      axios({
        method: "post",
        url: "/defaultPlay/checkStatus",
        params: { mid: item.mid },
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.musicStatus != 0) return Message.error("歌曲状态异常");
          that.musicStatus = res.data.musicStatus;
          that.playingMusicUrl = res.data.musicUrl;
          that.musicName = res.data.musicName;
          that.author = res.data.musicAuthor;
          that.author = res.data.musicAuthor;
          //高亮显示当前双击的歌曲
          let index = -1;
          that.playingList.forEach((element) => {
            if (element.mid === item.mid)
              return (index = that.playingList.indexOf(element));
          });
          if (index != -1) {
            that.listIndex = index + 1;
          }
          that.$nextTick(() => {
            // that.$bus.$emit("cancelHighLight");
            that.$bus.$emit("getLyric", that.playingMid);
            that.init();
            that.isPlaying = true;
            that.$refs.audio.play();
          });
        })
        .catch((err) => {
          console.log(err);
          Message.error(err.message);
        });
    });
    //绑定关闭列表的事件总线下的事件
    this.$bus.$on("closeList", () => {
      this.listVisible = false;
    });
    //绑定右侧弹窗切歌操作的事件总线事件
    this.$bus.$on("changeMusicFromDrawer", (musicInfo) => {
      let index = this.playingList.indexOf(musicInfo);
      // console.log(index);
      this.listIndex = index;
      this.getNextMusic();
    });
    //绑定右侧弹窗移除歌曲的事件总线事件
    this.$bus.$on("removeMusicFromListFromDrawer", (musicInfo) => {
      // return;
      var that = this;
      axios({
        method: "post",
        url: "/editList/removeFromPlayingList",
        timeout: 10000,
        params: { mid: musicInfo.mid },
      })
        .then((res) => {
          if (res.data.statusCode < 200) {
            // console.log(res.data.message, res.data.statusCode);
            Message.warning(res.data.message);
          } else {
            let index = that.playingList.indexOf(musicInfo);
            that.playingList.splice(index, 1);
            that.$store.commit("SET_PLAYINGLIST", that.playingList);
            console.log(that.listIndex, index + 1);
            if (that.listIndex === index + 1) {
              that.listIndex -= 1;
              that.getNextMusic();
            }
            if (that.listIndex > index + 1) {
              that.listIndex -= 1;
            }
            // console.log(this.playingList);
            // that.listIndex = index * 1;
          }
        })
        .catch((err) => {
          console.log(err);
          Message.error(err.message);
        });
    });
  },
};
</script>

 <style lang="less" >
.myDialog {
  width: 100%;
  height: 100%;
  .el-dialog__header {
    height: 0;
  }
  .el-dialog__body {
    height: 88%;
  }
}
.blurBoxP {
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 100%;
  background: rgba(#9084ae, 0.8);
  backdrop-filter: blur(20px);
}
.myControlBar {
  position: relative;
  margin-top: 50px;
  width: 100%;
  background-color: red;
  color: rgb(255, 255, 255);
  .musicInfo:hover {
    cursor: pointer;
  }
  .musicInfo {
    position: absolute;
    top: 0px;
    left: 10px;
    #title {
      font-size: 20px;
      width: 200px;
      height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    #author {
      font-size: 18px;
      width: 200px;
      height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .favourite {
      position: absolute;
      z-index: 99999;
      left: 240px;
      top: 0px;
    }
  }
  .lyric:hover {
    cursor: pointer;
  }
  .lyric {
    position: absolute;
    white-space: nowrap;
    // background-color: pink;
    width: 300px;
    height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    left: 27%;
    top: 10px;
  }
  .buttonBoxP {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
    .slider {
      width: 100px;
      position: absolute;
      top: 50%;
      transform: translate(200%, -50%);
    }
    #musicList {
      position: absolute;
      margin-left: 180px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  .progressP {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 50%;
    #now {
      position: absolute;
      left: -56px;
      top: 20%;
    }
    #end {
      position: absolute;
      right: -50px;
      top: 20%;
    }
  }
}
</style>