// 引入VueX
import VueX from 'vuex'
// 引入Vue
import Vue from 'vue'
// 使用插件
import axios from "axios";
import { Container, Message } from "element-ui";
Vue.use(VueX)
// 初始化VueX的三个内置对象
//actions写一些有异步请求或业务逻辑的判断 执行结束后自行调用context.commit去到mutations环节
const actions = {
    //自动登录
    autoLogin(context, value) {
        axios({
            method: "post",
            url: "/tokenApi",
            timeout: 10000,
        })
            .then((res) => {
                if (res.data.statusCode < 200) {
                    // console.log(res.data.message, res.data.statusCode);
                    Message.warning(res.data.message);
                } else {
                    context.dispatch('getPlayingList', res.data.account)
                    context.commit('AUTO_LOGIN', res.data)
                }
            })
            .catch((err) => {
                console.log(err);
                Message.error(err.message);
            });
    },
    //获取正在播放的列表
    getPlayingList(context) {
        axios({
            method: "get",
            url: "/getList/getPlayingList",
            timeout: 10000,
        }).then(
            (res) => {
                if (res.data.statusCode < 200) {
                    // console.log(res.data.message, res.data.statusCode);
                    Message.warning(res.data.message);
                } else {
                    context.commit('SET_PLAYINGLIST', res.data.playingList || [])
                }
            }
        ).catch(
            (err) => {
                console.log(err);
                Message.error(err.message);
            }
        )
    },
    //获取用户喜欢的列表
    getFavouriteList(context) {
        axios({
            method: "get",
            url: "/getList/getFavouriteList",
            timeout: 10000,
        }).then(
            (res) => {
                if (res.data.statusCode < 200) {
                    // console.log(res.data.message, res.data.statusCode);
                    Message.warning(res.data.message);
                } else {
                    context.commit('SET_FAVOURTIELIST', res.data.favouriteList || [])
                }
            }
        ).catch(
            (err) => {
                console.log(err);
                Message.error(err.message);
            }
        )
    },
    //取消喜欢
    cancelLike(context, item) {
        axios({
            method: "post",
            url: "/editList/cancelLike",
            timeout: 10000,
            params: { mid: item.mid }
        }).then(
            (res) => {
                if (res.data.statusCode < 200) {
                    // console.log(res.data.message, res.data.statusCode);
                    Message.warning(res.data.message);
                } else {
                    context.commit('CANCEL_LIKE', item)
                    Message.success("《" + item.musicName + "》 已从喜欢列表移除")
                }
            }
        ).catch(
            (err) => {
                console.log(err);
                Message.error(err.message);
            }
        )
    },
    //把播放列表替换为喜欢列表
    playFavouriteList(context) {
        axios({
            method: "get",
            url: "/editList/playFavouriteList",
            timeout: 10000
        }).then(
            (res) => {
                if (res.data.statusCode < 200) {
                    // console.log(res.data.message, res.data.statusCode);
                    Message.warning(res.data.message);
                } else {
                    context.commit('PLAY_FAVOURITE_LIST')
                }
            }
        ).catch(
            (err) => {
                console.log(err);
                Message.error(err.message);
            }
        )
    },
    // 单曲增加到播放列表
    singleAdd(context, item) {
        let playingList = context.state.playingList
        var singleAddAxios = (item) => {
            axios({
                method: "post",
                url: "/editList/playingListSingleAdd",
                params: { mid: item.mid },
                timeout: 10000
            }).then(
                (res) => {
                    if (res.data.statusCode < 200) {
                        // console.log(res.data.message, res.data.statusCode);
                        Message.warning(res.data.message);
                    } else {
                        context.commit('SINGLE_ADD', item)
                    }
                }
            ).catch(
                (err) => {
                    console.log(err);
                    Message.error(err.message);
                }
            )
        }
        if (playingList.length === 0) return singleAddAxios(item)
        // 遍历播放列表 如果有mid匹配的结束遍历 如果没有的话继续下一项 如果结束了还没有 那就调用函数
        for (const index in playingList) {
            if (playingList[index].mid == item.mid) return Message('歌曲已存在播放列表')
            else if (index == playingList.length - 1) {
                singleAddAxios(item)
            } else {
                continue
            }
        }
    },
    //播放列表清除所有正在播放的歌曲
    clearAllPlayingList(context) {
        if (!context.state.isLogin) return Message.error("请先登录")
        axios({
            method: "get",
            url: "/editList/clearPlayingList",
            timeout: 10000
        }).then(res => {
            if (res.data.statusCode == 200) {
                context.commit("CLEAR_ALL_PLAYINGLIST")
            } else {
                Message.error("出错了")
            }
        }).catch(
            (err) => {
                console.log(err);
                Message.error(err.message);
            }
        )
    },
    //单曲添加到我喜欢的歌曲
    singleAddToFavourite(context, item) {
        let mid = item.mid;
        if (!context.state.isLogin) {
            return Message.warning("请先登录账号");
        }
        axios({
            method: "post",
            url: "/searchMusic/addToFavourite",
            timeout: 10000,
            params: { mid },
        })
            .then((res) => {
                if (res.data.statusCode == 39)
                    return Message.warning(res.data.message);
                if (res.data.statusCode < 200) return Message.error(res.data.message);

                context.commit("ADD_FAVOURITE", item);
            })
            .catch((err) => {
                console.log(err);
                Message.error(err.message);
            });
    }
}
//mutations环节只直接操作state中的数据 不做业务逻辑
const mutations = {
    //自动登录
    AUTO_LOGIN(state, data) {
        state.isLogin = true
        state.userNickname = data.nickname;
        state.userAccount = data.account;
        data.photoUrl === "" || data.photoUrl === undefined
            ? (state.userImg = require("../static/defaultUserImg.png"))
            : (state.userImg = data.photoUrl);
        Message({
            message: "自动登陆成功",
            type: "success",
        });
    },
    //更新用户信息
    UPDATE_USER_INFO(state, data) {
        state.isLogin = true,
            state.userNickname = data.nickname || state.userNickname,
            data.photoUrl === "" || data.photoUrl === undefined
                ? (state.userImg = require("../static/defaultUserImg.png"))
                : (state.userImg = data.photoUrl);
        state.userAccount = data.account || state.userAccount,
            state.userPassword = data.password || state.userPassword
    },
    //登出
    LOGOUT(state) {
        state.isLogin = false;
        state.userNickname = "";
        state.userImg = "";
        state.userAccount = "";
        state.userPassword = "";
    },
    //更换头像的反馈
    UPLODA_AVATAR_SHOW(state, data) {
        // console.log(data);
        state.userImg = URL.createObjectURL(data);
    },
    //设置播放列表
    SET_PLAYINGLIST(state, list) {
        // console.log(list);
        //去除状态异常的歌曲
        list.forEach(item => {
            if (item.musicStatus == 1)
                return list.splice(list.indexOf(item), 1)
        });
        state.playingList = list || []
    },
    //设置用户喜欢列表
    SET_FAVOURTIELIST(state, list) {
        //去除状态异常的歌曲
        list.forEach(item => {
            if (item.musicStatus == 1)
                return list.splice(list.indexOf(item), 1)
        });
        state.favouriteList = list || []
    },
    //取消喜欢
    CANCEL_LIKE(state, item) {
        let arr = []
        state.favouriteList.forEach(element => {
            if (element.mid == item.mid) return
            arr.push(element)
        });
        state.favouriteList = arr
    },
    //把播放列表替换为喜欢列表
    PLAY_FAVOURITE_LIST(state) {
        //更换完后页面会停止播放 且新加入的音乐会播放失败 url会指向本地
        let arr = [...state.favouriteList]
        // state.favouriteList.forEach(element => {
        //     arr.push(element)
        // });
        state.playingList = arr
        Message.success('已更新播放列表')
    },
    //添加我喜欢的歌曲
    ADD_FAVOURITE(state, item) {
        let arr = [...state.favouriteList]
        // state.favouriteList.forEach(element => {
        //     arr.push(element)
        // });
        arr.unshift(item)
        state.favouriteList = arr
        Message.success(`已添加《${item.musicName}》至我喜欢的歌曲`);
    },
    // 单曲添加到播放列表
    SINGLE_ADD(state, item) {
        state.playingList.unshift(item)
        Message.success('《' + item.musicName + '》已添加到播放列表')
    },
    //播放列表清除所有正在播放的歌曲
    CLEAR_ALL_PLAYINGLIST(state) {
        state.playingList = []
        Message.success("已清除播放列表")
    }
}
//初始化数据
const state = {
    isLogin: false,
    userNickname: "",
    userImg: "",
    userAccount: "",
    userPassword: "",
    playingList: [],
    favouriteList: []
}
// 暴露仓库store
export default new VueX.Store({
    actions,
    mutations,
    state
})