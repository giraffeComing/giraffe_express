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

// 处理表单的中间件
app.use(require('body-parser')());

// 客户端访问/newsletter，表单提交到/process，/process处理表单数据，然后重定向到/thank-you
app.get('/newsletter', function(req, res){
// 我们会在后面学到 CSRF……目前，只提供一个虚拟值
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});
app.post('/process', function(req, res){
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you');
});

app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

app.get('/greeting', function(req, res){
    res.render('about', {
        message: 'welcome',
        // style: req.query.style,
        // userid: req.cookie.userid,
        // username: req.session.username,
    });
});

function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
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