/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// user connect-flash
var flash = require('connect-flash');
app.use(flash());

// use mongodb
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db
    })
}));

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());


app.use(function(req, res, next){
    res.locals.user = req.session.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

////app.get('/', routes.index);
//app.get('/users', user.list);
//
//// 高级路由
//app.get('/hello', routes.hello);
//app.get('/user/:username', function(req, res){
//    res.send('user:' + req.params.username);
//});
//
//// 传值数组
//app.get('/list', function(req, res){
//    res.render('list', {
//        title: 'List',
//        items:[1991, 'byvoid', 'express', 'Node.js']
//    });
//});

// blog
//app.get('/', routes.index);
//app.get('/u/:user', routes.user);
//app.post('/post', routes.post);
//app.get('/reg', routes.reg);
//app.post('/reg', routes.doReg);
//app.get('/login', routes.login);
//app.post('/login', routes.doLogin);
//app.get('/logout', routes.logout);

// use express-partial
var partials = require('express-partials');
app.use(partials());

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);
