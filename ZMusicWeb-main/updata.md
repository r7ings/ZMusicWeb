v1.0.0 2022.6.11
测试版1.0.0发布
    1.发现音乐页面为固定的假数据
    2.最近播放页面构建雏形
    3.我的喜欢页面构建雏形，取消喜欢功能开发完毕
    4.我的列表构建雏形
    5.个人中心所有功能开发完毕
    6.搜索框逻辑开发完毕，可以直接双击播放和直接添加到喜欢的歌单
    7.用户登录 注册 自动登录认证开发完毕，具有完整的token认证逻辑

v1.0.1 2022.6.12
测试版1.0.1发布
    1.优化搜索框用户体验 搜索框失焦隐藏搜索结果
    2.最近播放LocalStroage添加mid 以便歌曲状态异常监测 checkStatus
    3.我喜欢的歌曲单曲添加开发完毕
    4.右侧列表一键全部移除功能开发完毕
    5.修复了右侧列表为空时 单曲添加不生效的bug
    6.右侧列表正在播放的歌曲高亮显示雏形开发 有一些小bug
    7.各页面分页器固定位置 优化体验
    8.每首歌播放前 列表加载前 均会过滤musicStatus===1的歌曲 配合第2条一起方便后台管理歌曲

v1.0.2 2022.6.13
测试版1.0.2发布
    1.各列表添加逻辑修改，后添加的歌曲应该在列表第一位
    2.完善后台系统的歌曲状态变更功能，歌曲信息修改功能
    3.新建发现音乐页面对应信息的数据库，构建页面图像，歌曲信息与数据库的链接
    4.完善播放列表刷新列表功能

    v1.0.3 2022.6.18
测试版1.0.3发布
    1.行内歌词功能开发完成
    2.修改页面布局，适配全分辨率
    3.重构player逻辑组件，大幅减少bug
    4.重构侧列表highLight逻辑
    5.后台歌词上传入口开发完成
    6.后台管理Web平台各榜单数据，榜单名开发完成

 v1.0.4 2022.6.20
测试版1.0.4发布
    1.歌词页雏形开发完毕 有旋转唱片 有即时歌词 有进度展示 有切歌控件
    2.解决浏览器缓存图片问题 url后加'?t=234'
    3.通过jschardet 判断歌词文件编码格式 对应iconv的不同解码格式 解决服务器解析utf8编码格式歌词中文乱码问题
    //判断歌词编码模式
const jschardet = require("jschardet")
//中文乱码
const iconv = require('iconv-lite');
     let type = undefined
        let encoding = jschardet.detect(data).encoding
        encoding === 'UTF-8' ? type = 'utf-8' : type = 'gbk'
        var buf = Buffer.from(data, 'binary')
        var str = iconv.decode(buf, type);

 v1.0.5 2022.6.21
测试版1.0.5发布
    1.修复旋转唱片页歌词乱跑问题
    2.唱片加了一个弧形实时的歌曲进度条
    3.在player组件 歌曲信息右侧添加一个收藏按钮 方便用户收藏歌曲
    4.通过媒体查询 选择隐藏或者显示唱片
    5.修复唱片首次打开dialog不转的bug(直接监测progress progress变了就说明在播放 然后就让唱片转)