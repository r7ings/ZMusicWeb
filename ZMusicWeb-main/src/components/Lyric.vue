<template>
  <div>{{ inlineLyric }}</div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
export default {
  data() {
    return {
      inlineLyric: "",
      lyricArr: [],
      lyricArrIndex: 0,
    };
  },
  beforeMount() {
    var that = this;
    this.$bus.$on("rebind", () => {
      this.$bus.$on("updateLyric", (time) => {
        for (let i = 0; i < this.lyricArr.length; i++) {
          if (this.lyricArr[i].time - 0.5 < time) {
            this.inlineLyric = this.lyricArr[i].lyric;
          }
        }
      });
    });
    //歌词主体第一次不显示的处理
    this.$bus.$on("initLyricMain", () => {
      //把任务推入异步队列
      // this.$bus.$emit("scrollMain", this.lyricArr);
      setTimeout(() => {
        this.$bus.$emit("scrollMain", this.lyricArr);
      });
    });
    //更换歌曲时被发射的请求
    this.$bus.$on("getLyric", (mid) => {
      axios({
        method: "post",
        url: "/departLyric",
        params: { mid },
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.statusCode < 200) return Message.error(res.data.message);
          if (res.data.statusCode == 222)
            return (
              (that.inlineLyric = "当前歌曲暂无歌词"),
              (that.lyricArr = [
                { lyric: "当前歌曲暂无歌词", time: 0, uid: "0" },
              ])
            );
          //   console.log(res.data.lyricArr);
          that.lyricArr = res.data.lyricArr;
          that.$bus.$emit("scrollMain", res.data.lyricArr);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    //歌曲的播放进度每改变一次 这里触发一次 -0.5解决延迟
    this.$bus.$on("updateLyric", (time) => {
      for (let i = 0; i < this.lyricArr.length; i++) {
        if (this.lyricArr[i].time - 0.5 < time) {
          this.inlineLyric = this.lyricArr[i].lyric;
        }
      }
    });
  },
  mounted() {},
};
</script>

<style>
</style>