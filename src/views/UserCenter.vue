<template>
  <div>
    <div class="form" v-show="$store.state.isLogin">
      <el-form
        class="elForm"
        :model="userCenterForm"
        status-icon
        label-width="100px"
        show-message
        :rules="rules"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action=""
            ref="avatarUpload"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
          >
            <img
              style="width: 250px"
              v-if="userCenterForm.photoUrl"
              :src="userCenterForm.photoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item
          class="ipt"
          label="账号"
          prop="userAccount"
          v-show="!isEdit"
        >
          {{ userCenterForm.userAccount }}
        </el-form-item>

        <el-form-item
          class="ipt"
          label="昵称"
          prop="userNickname"
          v-show="!isEditNickname"
        >
          {{ userCenterForm.userNickname }}
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            circle
            style="margin-left: 50px"
            @click="editNickname"
          ></el-button>
        </el-form-item>

        <el-form-item
          class="ipt"
          label="昵称"
          prop="userNickname"
          v-show="isEditNickname"
        >
          <el-input
            type="text"
            v-model="userCenterForm.userNickname"
          ></el-input>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="submitNickname"
            >提交修改</el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="cancelEditNickname"
            >取消修改</el-button
          >
        </el-form-item>
        <el-form-item
          class="ipt"
          label="旧密码"
          prop="oldUserPassword"
          v-show="isEditPassword"
        >
          <el-input
            type="password"
            v-model="userCenterForm.oldUserPassword"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="ipt"
          label="新密码"
          prop="userPassword"
          v-show="isEditPassword"
        >
          <el-input
            type="password"
            v-model="userCenterForm.userPassword"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="ipt"
          label="确认密码"
          prop="checkPass"
          v-show="isEditPassword"
        >
          <el-input
            type="password"
            v-model="userCenterForm.checkPass"
          ></el-input>
        </el-form-item>
        <el-row class="buttonBox" v-show="!isEditPassword">
          <el-button
            type="primary"
            @click="editPassword"
            style="width: 100%; margin-top: 30px"
            plain
            >修改密码</el-button
          >
        </el-row>
        <el-row class="buttonBox" v-show="isEditPassword">
          <el-button
            type="primary"
            @click="submitPassword"
            style="width: 100%; margin-top: 30px"
            plain
            >提交修改</el-button
          >
        </el-row>
        <el-row class="buttonBox" v-show="isEditPassword">
          <el-button
            type="primary"
            @click="cancelEditPassword"
            style="width: 100%; margin-top: 30px"
            plain
            >取消修改</el-button
          >
        </el-row>
        <el-row class="buttonBox">
          <el-button
            type="warning"
            @click="logOut"
            style="width: 100%; margin-top: 30px"
            plain
            >退出登录</el-button
          >
        </el-row>
      </el-form>
    </div>
    <div class="unLogin" v-show="!$store.state.isLogin">
      <el-empty description="请先登录或注册"></el-empty>
    </div>
  </div>
</template>

<script>
import { Loading, Message } from "element-ui";
import axios from "axios";
var passwordReg = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,16}$/;
var nicknameReg = /^([a-zA-Z0-9_-]|[\u4E00-\u9FA5]){2,8}$/;
export default {
  name: "userCenter",
  data() {
    //表单输入验证
    var checkEditNicename = (rule, value, cb) => {
      this.submitLock.key1 = false;
      if (!value) {
        return cb(new Error("用户昵称不能为空"));
      } else if (!nicknameReg.test(value)) {
        return cb(new Error("昵称输入不合法"));
      } else {
        this.submitLock.key1 = true;
        return cb();
      }
    };
    var checkOldPassword = (rule, value, cb) => {
      this.submitLock.key2 = false;
      if (!value) {
        return cb(new Error("密码不能为空"));
      } else if (value.length > 16) {
        return cb(new Error("密码输入不合法"));
      } else {
        this.submitLock.key2 = true;
        return cb();
      }
    };
    var checkEditPassword = (rule, value, cb) => {
      this.submitLock.key3 = false;
      if (!value) {
        return cb(new Error("密码不能为空"));
      } else if (!passwordReg.test(value)) {
        return cb(new Error("密码输入不合法"));
      } else {
        this.submitLock.key3 = true;
        return cb();
      }
    };
    var checkPass = (rule, value, callback) => {
      this.submitLock.key4 = false;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userCenterForm.userPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        this.submitLock.key4 = true;
        callback();
      }
    };
    return {
      isEdit: false,
      isEditPassword: false,
      isEditNickname: false,
      editBtnShow: false,
      submitLock: {
        key1: true,
        key2: false,
        key3: false,
        key4: false,
      },
      userCenterForm: {
        userAccount: this.$store.state.userAccount,
        oldUserPassword: "",
        userPassword: "",
        checkPass: "",
        userNickname: this.$store.state.userNickname,
        photoUrl: this.$store.state.userImg,
      },
      rules: {
        oldUserPassword: [
          { validator: checkOldPassword, trigger: ["blur", "change"] },
        ],
        userPassword: [
          { validator: checkEditPassword, trigger: ["blur", "change"] },
        ],
        checkPass: [{ validator: checkPass, trigger: ["blur", "change"] }],
        userNickname: [
          { validator: checkEditNicename, trigger: ["blur", "change"] },
        ],
      },
    };
  },
  methods: {
    handleAvatarChange(res, file) {
      var that = this;
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
      let loadingInstance1 = Loading.service({ fullscreen: true });
      const avatarFile = file.pop().raw;
      const avatar = new FormData();
      avatar.append("files", avatarFile);
      //上传头像
      axios({
        method: "post",
        url: "/editInfo/changeAvatar",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: avatar,
        timeout: 10000,
      })
        .then((res) => {
          loadingInstance1.close();
          if (res.data.statusCode < 200) {
            // that.loading = false;
            // console.log(res.data.message, res.data.statusCode);
            Message.error(res.data.message);
          } else {
            // that.loading = false;
            that.$store.commit("UPLODA_AVATAR_SHOW", avatarFile);
            that.$store.commit("UPDATE_USER_INFO", res.data);
            Message({
              message: "更换头像成功",
              type: "success",
            });
          }
        })
        .catch((err) => {
          loadingInstance1.close();
          console.log(err);
          Message.error(err.message);
        });
    },
    logOut() {
      if (!this.$store.state.isLogin) return Message.error("请先登录");
      localStorage.removeItem("token");
      this.$store.commit("LOGOUT");
      location.reload();
    },
    cancelEditNickname() {
      this.isEditNickname = !this.isEditNickname;
      this.userCenterForm.userNickname = this.oldNickname;
    },
    cancelEditPassword() {
      this.isEditPassword = !this.isEditPassword;
      this.userCenterForm.oldUserPassword = "";
      this.userCenterForm.userPassword = "";
      this.userCenterForm.checkPass = "";
    },
    editNickname() {
      if (!this.$store.state.isLogin) return Message.error("请先登录");
      this.isEditNickname = !this.isEditNickname;
      this.oldNickname = this.userCenterForm.userNickname;
    },
    submitNickname() {
      var that = this;
      if (!this.$store.state.isLogin) return Message.error("请先登录");
      if (this.submitLock[0]) return Message.error("请填写正确的用户名");
      let loadingInstance1 = Loading.service({ fullscreen: true });
      let userCenterForm = this.userCenterForm;
      axios({
        method: "post",
        url: "/editInfo/editNickname",
        params: userCenterForm,
        timeout: 10000,
      })
        .then((res) => {
          that.isEditNickname = !that.isEditNickname;
          if (res.data.statusCode < 200) {
            loadingInstance1.close();
            // console.log(res.data.message, res.data.statusCode);
            Message.error(res.data.message);
          } else {
            loadingInstance1.close();
            that.$store.commit("UPDATE_USER_INFO", res.data);
            Message({
              message: "修改成功",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          loadingInstance1.close();
          Message.error(err.message);
        });
    },
    editPassword() {
      if (!this.$store.state.isLogin) return Message.error("请先登录");
      this.isEditPassword = !this.isEditPassword;
    },
    submitPassword() {
      var that = this;
      if (!this.$store.state.isLogin) return Message.error("请先登录");
      // this.isEditPassword = !this.isEditPassword;
      for (const key in this.submitLock) {
        if (!this.submitLock[key]) return Message.error("请正确填写内容");
      }
      if (
        this.userCenterForm.oldUserPassword === this.userCenterForm.userPassword
      )
        return Message.error("新旧密码不能相同");
      let loadingInstance1 = Loading.service({ fullscreen: true });
      let userCenterForm = this.userCenterForm;
      axios({
        method: "post",
        url: "/editInfo/editPassword",
        params: userCenterForm,
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.statusCode < 200) {
            loadingInstance1.close();
            // console.log(res.data.message, res.data.statusCode);
            Message.error(res.data.message);
          } else {
            loadingInstance1.close();
            Message({
              message: "修改成功，请三秒后重新登录",
              type: "success",
            });
            localStorage.removeItem("token");
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          loadingInstance1.close();
          Message.error(err.message);
        });
    },
    // edit() {
    //   if (!this.$store.state.isLogin) return Message.error("请先登录");
    //   this.isEdit = !this.isEdit;
    // },
  },
  watch: {
    "$store.state": {
      deep: true,
      handler() {
        this.userCenterForm.userAccount = this.$store.state.userAccount;
        this.userCenterForm.userNickname = this.$store.state.userNickname;
        this.userCenterForm.photoUrl = this.$store.state.userImg;
        this.editBtnShow = this.$store.state.isLogin;
      },
    },
  },
  // mounted() {
  //   var oldNickname = this.userCenterForm.userNickname;
  //   this.oldNickname = oldNickname;
  //   console.log(this.oldNickname);
  // },
};
</script>

<style scoped>
.elForm {
  position: absolute;
  height: 800px;
  left: 50%;
  transform: translate(-80%, 0);
}
.form {
  position: relative;
}
.unLogin {
  padding-top: 100px;
}
.buttonBox {
  width: 400px;
  display: flex;
  justify-content: space-evenly;
  /* background-color: pink; */
}
.ipt {
  width: 350px;
}
</style>