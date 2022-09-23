<template>
  <div id="root">
    <ul ref="lyricUL">
      <li
        v-for="(item, i) in lyricObjArr"
        :key="item.uid"
        :data-index="i"
        :style="{ color: lyricIndex === i ? 'skyblue' : '#ded9d9' }"
        ref="lyric"
      >
        {{ item.lyric }}
      </li>
    </ul>
  </div>
</template>

<script>
import "animate.css";
export default {
  data() {
    return {
      count: 0,
      lyricObjArr: [{ lyric: "当前歌曲暂无歌词", time: 0, uid: "0" }],
      lyricIndex: 0,
      startY: 0,
      endY: 0,
    };
  },
  beforeMount() {
    //默认有歌词
    this.$bus.$on("scrollMain", (lyricObjArr) => {
      this.lyricObjArr = lyricObjArr;
      //   console.log(lyricObjArr);
    });
    //歌曲进度变化 监测匹配 写动画
    this.$bus.$on("updateLyric", (time) => {
      for (let i = 0; i < this.lyricObjArr.length; i++) {
        if (this.lyricObjArr[i].time - 0.5 < time) {
          if (!this.$refs) return;
          const index = this.$refs.lyric[i].dataset.index;
          if (i === parseInt(index)) {
            this.lyricIndex = i;
            this.$refs.lyricUL.style.transform = `translateY(${
              300 - 26 * (i + 1)
            }px)`;
          }
        }
      }
    });
    this.$bus.$on("rebind", () => {
      this.$bus.$on("updateLyric", (time) => {
        for (let i = 0; i < this.lyricObjArr.length; i++) {
          if (this.lyricObjArr[i].time - 0.5 < time) {
            if (!this.$refs) return;
            const index = this.$refs.lyric[i].dataset.index;
            if (i === parseInt(index)) {
              this.lyricIndex = i;
              this.$refs.lyricUL.style.transform = `translateY(${
                160 - 26 * (i + 1)
              }px)`;
            }
          }
        }
      });
    });
    //拖拽事件
    this.$bus.$on("handScroll", (moveY) => {
      //   let y = this.$refs.lyricUL.getBoundingClientRect().y;
      //   console.log(y - moveY);
      this.$refs.lyricUL.style.transform = `translateY(${moveY}px)`;
      //   this.$refs.lyricUL.style.top = y - moveY + "px";
    });
  },
};
</script>

<style scoped>
ul {
  /* background-color: pink; */
  position: relative;
  list-style: none;
  text-align: center;
  width: 600px;
  font-size: 20px;
  transition: transform 1s;
  padding-top: 100px;
}
</style>