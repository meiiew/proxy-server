let http = require('http'),
	httpProxy = require('http-proxy'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	opn = require('opn'),
	proxyMain = require('./proxy.js'),
	clc = require('cli-color');//https://www.npmjs.com/package/cli-color
	
let proxy= {},
	server = {},
	currentDirectory = "./",
	fsWatch = {
		timeData : {},
		pollInterval : 1000
	};

function setProxy(){
	proxy = new httpProxy.createProxyServer({
		target : {
			host: proxyMain.forward.host,
			port: proxyMain.forward.port
		}
	})
	proxy.on('error', function(err, req, res){
	    console.log(err);
	});
}
function setServer(){
	server = http.createServer(function (request, response) {
		let pathname = /^\/static\//.test(url.parse(request.url).pathname)?
				url.parse(request.url).pathname:
					/^\/[a-zA-Z0-9]+\/[a-zA-Z0-9|\.|\/]*\.html/.test(url.parse(request.url).pathname) || /^\/[a-zA-Z0-9]+\/static\//.test(url.parse(request.url).pathname)?
						url.parse(request.url).pathname.replace(/^\/[a-zA-Z0-9]+/mg,""):
						url.parse(request.url).pathname,
			realPath = path.join(currentDirectory, proxyMain.directory, pathname);
		
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
};
function openServer(){
	server.listen(proxyMain.port,proxyMain.host);
	server.on('upgrade', function (req, socket, head) {
		proxy.ws(req, socket, head);
	});
}
function cloneServer(fun){
	server.removeAllListeners('upgrade');
	server.close(fun);
}

//监听文件
function watchFile(){
	fs.watch(currentDirectory,{
		recursive : true,
		interval : fsWatch.pollInterval
	},(event,file)=>{
		clearTimeout(fsWatch.timeData);
		fsWatch.timeData = setTimeout(function(){
			
			delete require.cache[require.resolve('./proxy.js')];
			proxyMain = require('./proxy.js');
			
			
			cloneServer(function(){
				openServer();
				process.stdout.write(clc.move.down(1));
				process.stdout.write(clc.move.right(6));
				console.info(clc.green("服务器已经重启！"));
				process.stdout.write(clc.move.down(1));
				console.info(clc.green("-----------------------------"));
			});
		},300);
	});
}

setProxy();
setServer();
watchFile();
openServer();
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
