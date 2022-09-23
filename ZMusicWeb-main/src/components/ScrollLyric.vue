<template>
  <div id="root">
    <div class="header">{{ musicName }}-{{ author }}</div>
    <div class="content">
      <div class="cdBox">
        <div class="cd" ref="cd"></div>
        <div class="control" ref="control">
          <div class="buttonBox">
            <!-- 上一首 -->
            <el-button
              type="primary"
              size="mini"
              plain
              icon="el-icon-arrow-left"
              @click="lastMusic"
              circle
            ></el-button>
            <!-- 播放 -->
            <el-button
              type="primary"
              :icon="isPlaying ? 'el-icon-video-pause' : 'el-icon-caret-right'"
              circle
              @click="play"
            ></el-button>
            <!-- 下一首 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-arrow-right"
              @click="nextMusic"
              plain
              circle
            ></el-button>
          </div>
        </div>
      </div>

      <div class="progress">
        <el-progress
          class="progress"
          type="circle"
          :percentage="isNaN(progress) ? 0 : progress"
          :width="820"
          :stroke-width="8"
          :show-text="false"
        ></el-progress>
      </div>
      <div class="lyric" ref="lyric">
        <ScrollMain />
      </div>
    </div>
  </div>
</template>

<script>
import ScrollMain from "../components/ScrollMain.vue";
export default {
  data() {
    return {
      scrollFlag: false,
      //通过监视progress是否在变化 来检测是否在播放歌曲 以控制cd是否转动
      playingTest: 0,
    };
  },
  //   props: ["musicName", "author", "myPlay"],
  props: {
    musicName: {
      type: String,
    },
    author: {
      type: String,
    },
    myPlay: {
      type: Function,
    },
    nextMusicBtn: {
      type: Function,
    },
    lastMusicBtn: {
      type: Function,
    },
    isPlaying: {
      type: Boolean,
    },
    progress: {
      type: Number,
    },
  },
  components: {
    ScrollMain,
  },
  methods: {
    lastMusic() {
      if (!this.lastMusicBtn) return;
      this.lastMusicBtn();
    },
    play() {
      if (!this.myPlay) return;
      this.myPlay();
    },
    nextMusic() {
      if (!this.nextMusicBtn) return;
      this.nextMusicBtn();
    },
  },
  watch: {
    progress: {
      handler(val) {
        if (val === 0) return (this.$refs.cd.className = "cd");
        if (val != this.playingTest) {
          this.playingTest = val;
          this.$refs.cd.className = "route cd";
        }
      },
    },
  },
  beforeMount() {
    this.$bus.$on("startRoute", () => {
      if (!this.$refs) return;
      this.$refs.cd.className = "route cd";
    }),
      this.$bus.$on("endRoute", () => {
        if (!this.$refs) return;
        this.$refs.cd.className = "cd";
      });
  },
  mounted() {
    // this.$refs.cd.onmouseover = () => {
    //   this.$refs.cd.className = "cd";
    //   this.$refs.control.className = "showControl";
    // };
    // this.$refs.cd.onmouseleave = () => {
    //   this.$refs.cd.className = "route cd";
    //   this.$refs.control.className = "control";
    // };
    //鼠标按下 解绑歌词随歌曲进度变化事件 开启flag监测mousemove
    this.$refs.lyric.onmousedown = (e) => {
      this.$bus.$off("updateLyric");
      this.scrollFlag = true;
      this.startY = e.y;
    };
    //鼠标松开 重新绑定变化事件 关闭flag
    this.$refs.lyric.onmouseup = (e) => {
      this.$bus.$emit("rebind");
      this.scrollFlag = false;
      this.endY = e.y;
    };
    this.$refs.lyric.onmousemove = (e) => {
      if (!this.scrollFlag) return;
      //   console.log(e);
      this.$bus.$emit("handScroll", this.startY - this.endY);
    };
    //鼠标移开 重新绑定
    this.$refs.lyric.onmouseleave = () => {
      this.scrollFlag = false;
      this.$bus.$emit("rebind");
    };
  },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 1900px) {
  .cdBox {
    display: none;
  }
  .progress {
    display: none;
  }
  .lyric {
    position: relative;
    left: 50%;
    transform: translate(-56%);
  }
}
@keyframes playmusic {
  /* 起始位置 */
  from {
    transform: rotate(0deg);
  }

  /* 结束位置 */
  to {
    transform: rotate(360deg);
  }
}
//动态添加这个类 以达到控制旋转的效果
.route {
  animation-name: playmusic;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
// .showControl {
//   width: 800px;
//   height: 100px;
//   position: absolute;
//   top: 50%;
//   opacity: 1;
//   transform: translateY(-50%);
//   //   background-color: pink;
// }
#root {
  width: 100%;
  height: 100%;
  .header {
    font-size: 30px;
    text-align: center;
  }
  .content {
    width: 100%;
    height: 100%;
    position: relative;
    padding-bottom: 10px;
    // background-color: pink;
    overflow: hidden;
    .progress {
      position: absolute;
      margin-left: 19px;
      margin-top: -5px;
    }
    .cdBox {
      margin: 50px 0 0 50px;
      .cd {
        position: relative;
        float: left;
        width: 800px;
        height: 800px;
        border-radius: 400px;
        background-image: url("../../static/cd.png");
        background-size: 100%;
      }
      .control {
        width: 800px;
        height: 800px;
        position: absolute;
        opacity: 0;
        z-index: 99;
        // background-color: pink;
      }
      .control:hover {
        opacity: 1;
        // background-color: pink;
      }
      .buttonBox {
        position: absolute;
        width: 100%;
        height: 100px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-around;
        // background-color: yellow;
        .el-button {
          width: 100px;
          height: 100px;
        }
      }
    }
    .lyric {
      float: left;
      //   background-color: pink;
      padding-left: 200px;
      padding-top: 100px;
      padding-right: 100px;
    }
  }
}
</style>