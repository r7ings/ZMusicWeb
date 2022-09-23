<template>
  <div class="root">
    <div class="blurBox"></div>
    <div ref="logoBox" class="logoBox" @click="egg">
      <div class="logo">
        <img src="../../static/headerLogo.png" alt="" />
      </div>
      <div class="title">Z_Music</div>
    </div>
    <div class="searchBox">
      <el-autocomplete
        class="input"
        v-model="searchVal"
        :fetch-suggestions="querySearchAsync"
        placeholder="搜索歌曲"
        :debounce="1000"
        @select="handleSelect"
      ></el-autocomplete>
      <!-- 弹出框 在里面展示满足条件的搜索结果 -->
      <el-popover
        width="400"
        trigger="manual"
        v-model="porVisible"
        placement="bottom-end"
      >
        <el-table :data="searchRes" @cell-dblclick="selectMusic">
          <el-table-column
            width="200"
            property="musicName"
            label="歌名"
          ></el-table-column>
          <el-table-column
            width="100"
            property="musicAuthor"
            label="作者"
          ></el-table-column>
          <el-table-column width="100" label="喜欢">
            <!-- slot-scope可以在table中传值 -->
            <!-- 添加到我的喜欢列表 -->
            <template slot-scope="scope">
              <el-button
                icon="el-icon-star-on"
                :plain="scope.row.isFavourite ? false : true"
                :type="scope.row.isFavourite ? 'success' : 'info'"
                :loading="addToUserMusicListBtnLoading"
                @click="addToUserMusicList(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 搜索按钮 -->
        <el-button
          slot="reference"
          icon="el-icon-search"
          @click="search"
          @blur.native="hidePop"
          ref="searchBth"
          id="searchBtn"
        ></el-button>
      </el-popover>
    </div>
    <div class="userBox">
      <div class="unLogin" v-show="!isLogin">
        <el-button type="primary" @click="loginBtn" round>登录</el-button>
        <el-button type="primary" @click="registerBtn" round>注册</el-button>
      </div>
      <div class="loged" v-show="isLogin">
        <div class="userImg">
          <el-avatar :size="30" :src="userImg"> </el-avatar>
        </div>
        <div class="userName">
          <el-link :underline="false" @click="userCenter">{{
            userName
          }}</el-link>
        </div>
      </div>
    </div>
    <div class="elseHeader">
      <el-badge :value="msgVal <= 0 ? '' : msgVal" class="item">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-s-comment"
          circle
        ></el-button>
      </el-badge>
      <el-badge :isDot="changeSkinIsDot" class="item">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-grape"
          circle
        ></el-button>
      </el-badge>
      <el-badge :isDot="settingIsDot" class="item">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-s-tools"
          circle
        ></el-button>
      </el-badge>
    </div>
    <div class="dialogBox">
      <!-- 登录的dialog -->
      <el-dialog
        :visible="dialogFlag === 'loginDialogShow' ? true : false"
        title="欢迎登陆"
        width="30%"
        v-loading="loading"
        @close="dialogClose"
        element-loading-text="登陆中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :append-to-body="true"
      >
        <div class="form">
          <el-form
            :model="loginForm"
            status-icon
            label-width="100px"
            show-message
            :rules="rules"
          >
            <el-form-item class="ipt" label="账号" prop="loginAccount">
              <el-input type="text" v-model="loginForm.loginAccount"></el-input>
            </el-form-item>
            <el-form-item class="ipt" label="密码" prop="loginPassword">
              <el-input
                type="password"
                v-model="loginForm.loginPassword"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="loginSubmit">登录</el-button>
          <el-button @click="dialogClose">取消</el-button>
        </span>
      </el-dialog>
      <!-- 注册的dialog -->
      <el-dialog
        :visible="dialogFlag === 'registerDialogShow' ? true : false"
        title="欢迎注册新用户"
        width="30%"
        v-loading="loading"
        @close="dialogClose"
        element-loading-text="注册用户中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :append-to-body="true"
      >
        <div class="form">
          <el-form
            :model="registerForm"
            status-icon
            label-width="100px"
            show-message
            :rules="rules"
          >
            <!-- 上传头像跨域 解决不了 暂时废弃 -->
            <!-- action="http://127.0.0.1:9990/register/uploadUserImg" -->
            <!-- 已解决 -->
            <el-form-item label="上传头像">
              <el-upload
                class="avatar-uploader"
                action=""
                ref="avatarUpload"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleAvatarChange"
              >
                <img v-if="userImg" :src="userImg" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item class="ipt" label="账号" prop="registerAccount">
              <el-input
                type="text"
                v-model="registerForm.registerAccount"
              ></el-input>
            </el-form-item>
            <el-form-item class="ipt" label="密码" prop="registerPassword">
              <el-input
                type="password"
                v-model="registerForm.registerPassword"
              ></el-input>
            </el-form-item>
            <el-form-item class="ipt" label="确认密码" prop="checkPass">
              <el-input
                type="password"
                v-model="registerForm.checkPass"
              ></el-input>
            </el-form-item>
            <el-form-item class="ipt" label="昵称" prop="registerNickname">
              <el-input
                type="text"
                v-model="registerForm.registerNickname"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="registerSubmit">注册</el-button>
          <el-button @click="dialogClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import "animate.css";
// 重置Mysql的id自增
// alter table zmusic_userinfo auto_increment = 1;
import { Message } from "element-ui";
import axios from "axios";
var accountReg = /^[a-zA-Z0-9_-]{4,16}$/;
var passwordReg = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,16}$/;
var nicknameReg = /^([a-zA-Z0-9_-]|[\u4E00-\u9FA5]){2,8}$/;
export default {
  data() {
    //登录表单输入验证
    var checkLoginAccount = (rule, value, cb) => {
      if (!value) {
        return cb(new Error("账号不能为空"));
      } else if (!accountReg.test(value)) {
        return cb(new Error("账号输入不合法"));
      } else {
        return cb();
      }
    };
    var checkLoginPassword = (rule, value, cb) => {
      if (!value) {
        return cb(new Error("密码不能为空"));
      } else if (!passwordReg.test(value)) {
        return cb(new Error("密码输入不合法"));
      } else {
        return cb();
      }
    };
    //注册表单输入验证
    var checkRegisterAccount = (rule, value, cb) => {
      if (!value) {
        return cb(new Error("账号不能为空"));
      } else if (!accountReg.test(value)) {
        return cb(new Error("账号输入不合法"));
      } else {
        return cb();
      }
    };
    var checkRegisterPassword = (rule, value, cb) => {
      if (!value) {
        return cb(new Error("密码不能为空"));
      } else if (!passwordReg.test(value)) {
        return cb(new Error("密码输入不合法"));
      } else {
        return cb();
      }
    };
    var checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.registerPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkRegisterNicename = (rule, value, cb) => {
      if (!value) {
        return cb(new Error("用户昵称不能为空"));
      } else if (!nicknameReg.test(value)) {
        return cb(new Error("昵称输入不合法"));
      } else {
        return cb();
      }
    };
    return {
      porVisible: false,
      searchRes: [],
      myHeaders: { "Access-Control-Allow-Origin": "*" },
      //登陆表单规则
      loginForm: {
        loginAccount: "",
        loginPassword: "",
      },
      //注册表单规则
      registerForm: {
        registerAccount: "",
        registerPassword: "",
        checkPass: "",
        registerNickname: "",
        avatarFile: "",
      },
      rules: {
        //登录表单规则
        loginAccount: [
          { validator: checkLoginAccount, trigger: ["blur", "change"] },
        ],
        loginPassword: [
          { validator: checkLoginPassword, trigger: ["blur", "change"] },
        ],
        //注册表单规则
        registerAccount: [
          { validator: checkRegisterAccount, trigger: ["blur", "change"] },
        ],
        registerPassword: [
          { validator: checkRegisterPassword, trigger: ["blur", "change"] },
        ],
        checkPass: [{ validator: checkPass, trigger: ["blur", "change"] }],
        registerNickname: [
          { validator: checkRegisterNicename, trigger: ["blur", "change"] },
        ],
      },
      dialogFlag: "UnShow",
      loading: false,
      searchVal: "",
      changeSkinIsDot: false,
      settingIsDot: true,
      msgVal: 0,
      flag: false,
      addToUserMusicListBtnLoading: false,
      avatarFile: "",
      // dialogVisible: false,
    };
  },
  methods: {
    egg() {
      this.$refs.logoBox.className = "logoBox clickAnimation";
      setTimeout(() => {
        this.$refs.logoBox.className = "logoBox";
      }, 1000);
    },
    //靓靓提的建议 搜索按钮失焦时隐藏搜索结果
    hidePop() {
      setTimeout(() => {
        this.porVisible = false;
      }, 1500);
    },
    //在搜索结果框直接双击
    selectMusic(item) {
      this.$bus.$emit("tempPlay", item);
    },
    //添加到列表
    addToUserMusicList(item) {
      var that = this;
      let mid = item.mid;
      this.addToUserMusicListBtnLoading = true;
      if (!this.$store.state.userAccount) {
        this.addToUserMusicListBtnLoading = false;
        return Message.warning("请先登录账号");
      }
      let account = this.$store.state.userAccount;
      axios({
        method: "post",
        url: "/searchMusic/addToFavourite",
        timeout: 10000,
        params: { mid, account },
      })
        .then((res) => {
          that.addToUserMusicListBtnLoading = false;
          if (res.data.statusCode == 39) {
            let index = that.searchRes.indexOf(item);
            //vue2数据监测的问题 复杂数据类型内部数据变化检测不到 改变内存地址可以监测到 进而重新渲染dom
            var newData = JSON.parse(JSON.stringify(that.searchRes));
            newData[index].isFavourite = !newData[index].isFavourite;
            that.searchRes = newData;
            return Message.warning(res.data.message);
          }
          if (res.data.statusCode < 200) return Message.error(res.data.message);
          Message.success(`已添加《${item.musicName}》至我喜欢的歌曲`);
          //以下为成功添加到收藏的回调
          let index = that.searchRes.indexOf(item);
          //vue2数据监测的问题 复杂数据类型内部数据变化检测不到 改变内存地址可以监测到 进而重新渲染dom
          var newData = JSON.parse(JSON.stringify(that.searchRes));
          newData[index].isFavourite = !newData[index].isFavourite;
          that.searchRes = newData;
          //修改全局我的喜欢列表
          that.$store.commit("ADD_FAVOURITE", item);
        })
        .catch((err) => {
          that.addToUserMusicListBtnLoading = false;
          console.log(err);
          Message.error(err.message);
        });
    },
    userCenter() {
      this.$router.push({
        name: "UserCenter",
      });
    },
    //处理上传头像函数
    handleAvatarChange(res, file) {
      //pop会修改原数组 用tmp接最后一个文件 也就是刚传的
      const isJPG =
        file[file.length - 1].raw.type === "image/jpeg" ||
        file[file.length - 1].raw.type === "image/png";
      const isLt2M = file[file.length - 1].raw.size / 1024 / 1024 < 2;
      if (!isJPG) {
        return Message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        return Message.error("上传头像图片大小不能超过 2MB!");
      }
      const avatarFile = file.pop().raw;
      console.log(avatarFile);
      this.$store.commit("UPLODA_AVATAR_SHOW", avatarFile);
      const avatar = new FormData();
      avatar.append("files", avatarFile);
      console.log(avatar);
      this.registerForm.avatarFile = avatar;
    },
    //结束处理上传头像函数

    dialogClose() {
      this.dialogFlag = "UnShow";
    },
    loginSubmit() {
      var that = this;
      this.loading = true;
      //登录请求
      axios({
        method: "post",
        url: "/login/loginWeb",
        params: that.loginForm,
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.statusCode < 200) {
            that.loading = false;
            // console.log(res.data.message, res.data.statusCode);
            Message.error(res.data.message);
          } else {
            that.loading = false;
            that.dialogFlag = "UnShow";
            that.$store.commit("UPDATE_USER_INFO", res.data);
            // console.log(res.data.token);
            localStorage.setItem("token", res.data.token);
            axios.defaults.headers = { Authorization: res.data.token };
            Message({
              message: "登陆成功",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          that.loading = false;
          Message.error(err.message);
        });
    },
    registerSubmit() {
      var that = this;
      this.loading = true;
      // 注册请求;
      // console.log(that.registerForm);
      axios({
        method: "post",
        url: "/register",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: that.registerForm,
        data: that.registerForm.avatarFile || new FormData(),
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.statusCode < 200) {
            that.loading = false;
            // console.log(res.data.message, res.data.statusCode);
            Message.error(res.data.message);
          } else {
            that.loading = false;
            that.dialogFlag = "UnShow";
            that.$store.commit("UPDATE_USER_INFO", res.data);
            Message({
              message: "注册成功，已自动登录",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          that.loading = false;
          Message.error(err.message);
        });
    },
    //搜索框
    querySearchAsync(val, cb) {
      var that = this;
      this.porVisible = false;
      if (!val) return;
      if (!val.trim()) return;
      val = val.trim();
      //模糊查询
      axios({
        method: "post",
        url: "/searchMusic",
        timeout: 10000,
        params: { value: val },
      })
        .then((res) => {
          if (res.data.statusCode == 34) {
            Message.info("没有查询到相应歌曲");
            return cb([]);
          } else {
            let searchResList = res.data.searchResList;
            that.searchRes = searchResList;
            if (!searchResList) return;
            searchResList.forEach((item) => {
              item.value = item.musicName + "-" + item.musicAuthor;
              item.isFavourite = false;
            });
            //只显示15条搜索结果
            cb(searchResList.slice(0, 15));
          }
        })
        .catch((err) => {
          console.log(err);
          Message.error(err.message);
        });
      // cb([{ value: "1" }, { value: "2" }, { value: "3" }]);
    },
    handleSelect(item) {
      //只能自己操作dom了= =
      var search = document.getElementById("searchBtn");
      search.focus();
      // 在搜索结果选定了后 在pop里面只展示选中的
      this.porVisible = true;
      item.value = item.musicName;
      this.searchRes = [item];
    },
    search() {
      this.porVisible = !this.porVisible;
    },
    loginBtn() {
      this.dialogFlag = "loginDialogShow";
    },
    registerBtn() {
      this.dialogFlag = "registerDialogShow";
    },
  },
  components: {
    // SearchList
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    userName() {
      return this.$store.state.userNickname;
    },
    userImg() {
      return this.$store.state.userImg === ""
        ? require("../../static/defaultUserImg.png")
        : this.$store.state.userImg;
    },
  },
};
</script>

<style lang="less" scoped>
.form {
  width: 80%;
  margin: 0 auto;
  padding-top: 20px;

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.ipt {
  width: 350px;
}
.item {
  position: relative;
  margin-top: 10px;
  margin-right: 20px;
}
.el-icon-my-export {
  background: url(../../static/changeSkin.png) no-repeat;
  font-size: 300px;
  background-size: cover;
}
.el-icon-my-export:before {
  content: "替";
  font-size: 300px;
  visibility: hidden;
}
.root {
  .blurBox {
    position: absolute;
    left: -20px;
    top: 0;
    width: 200%;
    height: 60px;
    background: rgba(173, 216, 230, 0.8);
    backdrop-filter: blur(20px);
  }
  //   background-color: #8f94fb;
  //   backdrop-filter: blur(50px);
  //   background: rgba(248, 6, 6, 0.5);
  //   backdrop-filter: blur(20px);
  position: relative;
  height: 50px;
  left: 0px;
  width: 100%;
  color: #fff;
  .logoBox {
    position: absolute;
    top: 10%;
    left: 15px;
    img {
      width: 40px;
      height: 40px;
    }
    .title {
      position: absolute;
      bottom: 8px;
      left: 50px;
      font-size: 20px;
    }
  }
  .searchBox {
    position: absolute;
    top: 10px;
    left: 20%;
    .input {
      width: 400px;
    }
  }
  .userBox {
    position: absolute;
    left: 75%;
    .unLogin {
      position: absolute;
      top: 10px;
      width: 200px;
    }
    .loged {
      position: absolute;
      top: 20px;
      .userImg {
        position: absolute;
        img {
          width: 25px;
          height: 25px;
        }
      }
      .userName {
        position: absolute;
        left: 40px;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .elseHeader {
    position: absolute;
    left: 85%;
    top: 6px;
  }
}
.clickAnimation {
  animation: wobble; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s; /* don't forget to set a duration! */
}
</style>