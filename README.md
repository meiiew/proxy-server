# proxy-server
代理服务器，适用前后端分离的本地开发。代理ajax和websocketbr。<br /><br />

1.安装：<br />
获取所有代码，运行command文件夹内的"初始化安装.bat"（本地测试node环境是6.10，低于此环境，可能有未知错误）<br /><br />

2.运行：<br />
安装完后，点击command文件夹内的"启动服务.bat",就开启成功。<br />
注意当前访问的是app文件夹内文件，属于测试文件，发送数据地址可能在未来某一天被摒弃掉。请用自己的地址测试。<br /><br />

3.修改：<br />
所有配置文件在server/proxy.js中。<br /><br />

4.参数信息：<br />
host：当前开启服务器的访问地址。<br />
port：访问的端口号。<br />
directory：访问的根目录。<br />
access：默认打开的页面地址。<br />
proxys：发送的请求，根据字符判断哪些请求需要转发（pathRewrite属性将确定转换方式，原地址重新匹配新地址）。<br />
forward：默认代理的服务器地址和端口。<br />
contentType：判断资源的类型（如果没必要，请不要修改）。<br />
