- mongodb-bin 3.0.6-1
- http://shushuo.baidu.com/legend/dev/?id=e9731b07-77cb-11e5-873e-70e2840c1e14&_data=1
- http://shushuo.baidu.com/legend/dev/?id=e9731b07-77cb-11e5-873e-70e2840c1e14



- nohup
```
// 这样运行页面会很慢，后来发现dep.sh 是supervisor bin/www
nohup sh dep.sh>server.log  &

// 部署的时候应该用这个
nohup npm start &

```

```

因legend那边用户系统升级，现在改为
10.99.72.22     legend.baidu.com

vi /etc/hosts
配置

10.99.72.22     legend-dev-backend.baidu.com
10.99.72.22     legend-dev.baidu.com


```
[Legend Runtime API](http://agroup.baidu.com/LegendsWorld/md/article/4650)



