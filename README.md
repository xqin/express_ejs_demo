

## 安装项目依赖
```
npm install
```


## 本地运行项目
```
npm start
```

## 生产环境运行项目

```
export NODE_ENV=production
export PORT=8080
pm2 start  ./bin/www
```

> PORT 为nodejs监听的端口号, 如果不指定则默认为 `3000`.
> 项目启动后, 可以让nginx反向代理到node监听的端口上.

要展示的静态页面以 `.ejs` 为扩展名保存至 `views` 目录中, 文件中要使用的数据, 可以在 `db` 目录中 创建同名的文件(以`.json`结尾).

比如: http://127.0.0.1:3000/index.html 对应 `views/index.ejs` 这个文件, 并会自动加载 `db/index.json` 中的数据到 `ejs` 的模板中.
