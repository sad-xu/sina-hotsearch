# 新浪微博热搜记录


> * 查看实时热搜
> * 关键词搜索历史热搜
> * 查看单条热搜历史趋势，异热搜异动一目了然




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
 svm ls

切换node版本
 svm use 10.3.0


### spider相关

查看任务
 pm2 list

pm2运行npm
 pm2 start npm --name newname -- run prod-spider 

