var createError = require('http-errors');
const express = require('express')
var path = require('path');
const app = express()
const port = 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

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


app.listen(port, () => {
  console.log(`Explorer api listening at http://localhost:${port}`)
})