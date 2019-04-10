# 新浪微博热搜记录


> * 查看实时热搜
> * 关键词搜索历史热搜
> * 查看单条热搜历史趋势，异热搜异动一目了然

初学者之路

  2017 IFE https://github.com/sad-xu/2017-baidu
    自学网站

  Free Code Camp https://github.com/sad-xu/free-code-camp
    自学网站

  Vue Sellfood https://github.com/sad-xu/vue-sellfood
    慕课网项目

2018四部曲
  
  SCP https://github.com/sad-xu/SCP
    首个成功的个人项目
    前端：移动端页面 + PC端管理后台
    后端：nodejs + express + mongodb
    
  Team Chat https://github.com/sad-xu/teamchat
    私人定制聊天及管理项目
    前端：管理后台
    后端：nodejs + express + mongodb

  Graduation Project https://github.com/sad-xu/Graduation-Project
    毕业设计,用js实现神经网络识别手写字母

  Require Map https://github.com/sad-xu/require-map
    首个工具类npm包,自动生成nodejs项目中各个文件的依赖关系图

2019三部曲
  
  Hotsearch Analyst
    私有库,热搜分析师
    前端：小程序
    后端：nodejs + express + mongodb + redis

  Tracker https://github.com/sad-xu/tracker
    前端代码埋点库 + 统计后台示例 (开发中...)

  保密

### redis 相关

启动服务
 cd /usr/local/src/redis-4.0.10/src
 ./redis-server /home/redis/redis.conf

查询进
 ps -ef |grep redis

查看端口
 netstat -lntp | grep 6379

杀死进程
 kill -9 'pids'


### 重要

查看svm列表
 nvm ls

切换node版本
 nvm use 10.3.0


### spider相关

查看任务
 pm2 list

删除任务
 pm2 delete id

pm2运行npm
 pm2 start npm --name spider -- run prod-spider
 pm2 start npm --name leadboard -- run prod-leadboard
 pm2 start npm --name commitlog -- run prod-commitlog
 pm2 start npm --name server -- run prod-server