#step

1、 下载nodejs，安装之（官网或者在我的[百度盘分享链接下载](http://pan.baidu.com/s/1i4S0ZY1)）

2、 找个空文件夹，运行以下指令（或者在从上面的分享链接里下载run.bat放到该文件夹下运行，提示输入时输入y）；

```
npm install -g express
npm install -g express-generator
express
```

3、 此时，文件夹里应该有5个文件夹，1个package.json，一个app.js

4、 当前目录下通过cmd输入 ```npm start``` 尝试启动服务器，如果没有报错，则说明正常，例如最下面显示的是以下的命令：

    > node ./bin/www
    
5、 如果启动成功，按ctrl+C终止node进程，然后将百度盘里面，文件名为【资源文件.7z】解压缩到根目录，覆盖根目录下的同名文件（一个覆盖一个不用覆盖）；

6、 重新运行 ```npm start```命令，打开url：http://127.0.0.1:3000/test.html 然后查看console的结果。

[jQuery的ajax的API](http://www.jquery123.com/jQuery.ajax/)

三个接口：

【1】get请求

    url：/getForLearn
    请求类型：get
    附加数据：无（可以有，但不处理）
    返回值：固定一个对象，如下
    {
        name: "wang dong",
        age: 20,
        sex: "man"
    }
    
server端返回值修改方法：

打开routes/index.js，搜索关键词 ```router.get('/getForLearn'``` ，修改 ```res.send()```的参数即可。

【2】post请求，返回字符串

    url：/postForLearnResByString
    请求类型：post
    附加数据：一个对象（用户自定义）
    返回值：字符串，将key和value以一定规则拼接后返回给用户
    
【3】post请求，返回对象

    url：/postForLearnResByObject
    请求类型：post
    附加数据：一个对象（用户自定义）
    返回值：筛选该对象，将key的长度小于5的k-v项添加到新对象中，并返回新对象
    
使用方法：

    ./routes/index.js    用于设置服务器端
    ./public/test.html    用于设置客户端
    
访问网址：

启动server后查看http://127.0.0.1:3000/test.html