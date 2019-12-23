const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const app = express();

const VIEW_ROOT = path.join(__dirname, 'views');
const DB_ROOT = path.join(__dirname, 'db');
// view engine setup
app.set('views', VIEW_ROOT);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  const { path: p, query } = req;

  if (p.indexOf('..') !== -1 || /\.html?$/.test(p) === false) { // 如果路径中有 .. , 则走后面的route,  不在这里进行处理, 防止跨目录, 或者不是 .html .htm 结尾的, 则走 next, 不在这里处理
    next();
    return;
  }

  const ejs = p.replace(/^\//g, '').replace(/\.html?$/, '')
  const file = path.join(VIEW_ROOT, `${ejs}.ejs`); // 合并路径, 得到最终的文件路径

  fs.stat(file, (e, stat) => {
    if (e || stat.isFile() === false) { // 读取出错, 或者不是文件, 则next
      next();
      return
    }

    const db = { }

    try {
      Object.assign(db, { query }); // 将当前的URL参数合并进来
      Object.assign(db, require(path.join(DB_ROOT, `${ejs}.json`))) // 将db目录下同名的json文件合并进来
    } catch (e) {}

    res.render(`${ejs}.ejs`, db)
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
