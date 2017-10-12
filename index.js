/**
 * Created by zhangwei36 on 2017/10/12.
 */
var express = require('express');
var app = express();

var fortune = require('./lib/fortune.js');
// 设置 handlebars 视图引擎
var handlebars = require('express3-handlebars')
    .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);
// static中间件用于指定静态资源
app.use(express.static(__dirname + '/public'));

app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});


app.get('/', function(req, res) {
    res.render('home'); // 用模板渲染home.handlebars并套入main.handlebars
});
app.get('/about', function(req, res) {
    res.render('about', { fortune: fortune.getFortune() } );
});
// 404 catch-all 处理器（中间件）
app.use(function(req, res, next){
    res.status(404);  // 设置响应状态码
    res.render('404');
});
// 500 错误处理器（中间件）
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});