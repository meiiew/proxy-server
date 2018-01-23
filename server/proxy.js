const proxy = {
	host : "127.0.0.1",
	port : 8083,
	directory : "",
	access : "/app/index.html",
	proxys :{
		'/api': {
			target: 'http://test.antibody.cn',
			changeOrigin: true,
			pathRewrite: {
				'/api': ''
			}
		},
		'/doctoru/': {
			target: 'http://test.antibody.cn',
			changeOrigin: true,
			pathRewrite: {
				'/doctoru/': '/doctoru/'
			}
		},
		'/local': {
			target: 'http://test.antibody.cn',
			changeOrigin: true,
			pathRewrite: {
				'/local': '/xs/src/'
			}
		}
	},
	forward : {
		host : "test.antibody.cn",
		port : "9502"
	},
	contentType : {
		"css": "text/css",
		"gif": "image/gif",
		"html": "text/html",
		"ico": "image/x-icon",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"js": "text/javascript",
		"json": "application/json",
		"pdf": "application/pdf",
		"png": "image/png",
		"svg": "image/svg+xml",
		"swf": "application/x-shockwave-flash",
		"tiff": "image/tiff",
		"txt": "text/plain",
		"wav": "audio/x-wav",
		"wma": "audio/x-ms-wma",
		"wmv": "video/x-ms-wmv",
		"xml": "text/xml",
		"woff": "application/x-woff",
		"woff2": "application/x-woff2",
		"tff": "application/x-font-truetype",
		"otf": "application/x-font-opentype",
		"eot": "application/vnd.ms-fontobject"
	}
}

//export default proxyFun;
module.exports = proxy;