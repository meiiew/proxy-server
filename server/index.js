let http = require('http'),
	httpProxy = require('http-proxy'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	opn = require('opn'),
	proxyMain = require('./proxy.js');
	
let proxy = new httpProxy.createProxyServer({
	target : {
		 host: proxyMain.forward.host,
		 port: proxyMain.forward.port
	}
});
proxy.on('error', function(err, req, res){
    console.log(err);
});
let server = http.createServer(function (request, response) {
	let pathname = url.parse(request.url).pathname,
		realPath = path.join("./", proxyMain.directory, pathname);
	
	for(let n in proxyMain.proxys){
		if(~pathname.indexOf(n)){
			for(let r in proxyMain.proxys[n].pathRewrite){
				pathname = pathname.replace(r,proxyMain.proxys[n].pathRewrite[r]);
			}
			proxy.web(request, response, {//可配置参数，见注释1
	        	target: proxyMain.proxys[n].target+pathname,
	        	changeOrigin : proxyMain.proxys[n].changeOrigin,
	        	prependPath : false
	       	});
			return;
		}
	}
	
	fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end();
                } else {
                	let contentType = proxyMain.contentType[path.extname(realPath).replace(/^./mg,'')] || 'text/plain';//判断请求后缀
                	response.writeHead('200',{'Content-Type':contentType,'Access-Control-Allow-Origin':'*','Cache-Control':'max-age=604800, public','cookie':'aaa=bbb'});
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(proxyMain.port,proxyMain.host);
server.on('upgrade', function (req, socket, head) {
	proxy.ws(req, socket, head);
});

opn('http://'+proxyMain.host+':' + proxyMain.port + proxyMain.access);



//------------------------------------------
//注释1:

//target: url字符串
//forward: url字符串
//agent: 传给http(s).request的对象
//ssl: 密钥，HTTPS使用
//ws: true/false, 是否代理websockets
//xfwd: true/false, 是否加上x-forward头字段
//secure: true/false, 是否校验ssl证书
//toProxy: 传递绝对URL作为path
//prependPath: true/false, 默认值为true，是否在proxy path前面加上target的path
//ignorePath: true/false, 默认值为false，是否忽略传入的请求的proxy path
//localAddress: 本地地址
//changeOrigin: true/false, 默认值为false, 是否更改原始的host头字段为target URL
//auth: 基本身份认证，比如：‘用户名：密码’来计算Authorization header
//hostRewrite: 重写重定向（301/302/307/308）的location hostname
//autoRewrite: 是否自动重写重定向（301/302/307/308）的location host/port，默认值为false
//protocolRewrite: 重写重定向（301/302/307/308）的location的协议，http或者https，默认值为null