<template>
  <div class="root">
    <LayOut />
  </div>
</template>

<script>
import axios from "axios";
import LayOut from "./views/LayOut.vue";
//axios的baseUrl
//服务器
// axios.defaults.baseURL = "";
//本地
axios.defaults.baseURL = "http://127.0.0.1:9990";
export default {
  name: "App",
  components: {
    LayOut,
  },
  beforeMount() {
    var that = this;
    let token = localStorage.getItem("token") || "";
    if (token) {
      //如果本地有token 让axios请求头携带token
      axios.defaults.headers = { Authorization: token };
      this.$store.dispatch("autoLogin", token);
    }
    // axios({
    //   method: "post",
    //   url: "/getDaily15",
    //   params: { account: "admin" },
    // }).then((res) => {
    //   console.log(res.data);
    // });
  },
};
</script>

<style scoped>
/* .root {
  background: url("../static/background.png");
} */
</style>