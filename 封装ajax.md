#ajax的手写、封装和自定义设置

###<span style='color:red'>1、目标</span>

如果只是会用ajax就行，建议使用jquery等提供ajax功能的库，简单暴力兼容性强还不容易出错。

这里是通过学习ajax来提高自己对ajax、http协议的理解。

---

##**手写一次完整的ajax（初级）**

###<span style='color:red'>1、目标</span>

理解如何手写一次完整的ajax，发起成功的请求，并能成功响应服务器回复的内容。

###<span style='color:red'>2、准备工作</span>

一个能跑起来的后端，并预置了简单接口。

我这里提供一个github的简单后台，[链接](https://github.com/qq20004604/a-ajax-project-for-learner)，原DEMO是用jquery写的ajax。具体可以参照该demo的说明。

当写好自己的代码并测试时，将文件放入该demo的public文件夹下，运行该后台，并通过相应的链接来访问。

假如文件是abc.html，那么访问链接是：

    http://127.0.0.1:3000/abc.html

###<span style='color:red'>3、梳理ajax流程</span>

1、创建一个XMLHttpRequest对象的实例（以下过程都是基于这个实例的，每一次ajax是一次实例）；

2、设置该实例的ajax请求发向的目标，发起的方式；

3、设置该实例在响应状态发生变化时，执行的回调函数，包括请求成功后的设置，注意，这个函数会被多次执行（每次状态变化都会执行）；

4、配置一些ajax的选项（开始初学时可以忽视）；

5、发送请求。

6、（自动执行预置好的功能）当发送请求之后，每次实例的readyState属性发生改变时，响应函数都会执行一次，当然，也包括请求成功时。

因此我们需要干的事情就是：

创建一个用于ajax的实例——》各种设置，包括请求失败成功后的——》发送请求，并在请求状态发生变化时，执行之前设置的方法

由于ajax是异步的，而异步的过程中，会有状态变化，因此，有属性readyState表示当前的异步请求处于一种什么样的状态。

请参照[MDN的说明](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState)来理解。

简单来说，当readyState属性的值为4时，才代表这次异步请求完成（无论是成功还是失败）

以下是一个最简单的ajax处理流程图，以帮助理解：

<image src='https://raw.githubusercontent.com/qq20004604/a-ajax-project-for-learner/master/ajax-flow-pic.png'/>


###<span style='color:red'>4、实际写一次ajax</span>

1、创建一个XMLHttpRequest对象的实例。需要注意，每一次ajax都需要new一个实例，不能重复使用；

```
var req = new XMLHttpRequest();
```

2、设置该实例的响应函数；

```
req.onreadystatechange = function () {
    //代码先略过不写，后面再具体细说
}
```

3、调用实例的open方法，用于设置url和请求方式

```
//请求方式：类型是字符串，比如"get"，"put"，"post"等，大小写无影响
//URL：类型是字符串，请求链接，例如"/getForLearn"
//第三个参数值为true表示是异步，值为false表示是同步。不填写的话，默认为true

req.open(请求方式, URL, true);
```

4、发出请求。

```
//默认情况下，不加参数，支持程度，最低IE7
//可加参数，参照MDN，兼容程度需要至少IE10

req.send();
```
[MDN关于send的说明](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send)

只需要以上四步即可，便可完成一次ajax请求。（注：这里省略了一些配置）

如何处理ajax的响应，是通过第二步的函数来设置的。因此我们在这里补充写第二步之前略过没写的函数

```
//处理函数

req.onreadystatechange = function () {
    //本函数会被触发多次。
    //核心是通过判断this.readyState的值来判断当前的异步请求处于哪一步了。
    
    //当值不等于4时，说明请求尚未完成（无论是成功或者失败）
    //通过console.log来帮忙理解这个数值的变化
    console.log(this.readyState);
    if (this.readyState !== 4) {
        return;
    }
    
    //到目前这一步时，说明请求完成了（没完成在之前就return返回了）
    //然后判断请求状态是否为200，当为200时，说明请求成功
    if (this.status === 200) {
        //this.response 该变量表示服务器返回的内容
        console.log(this.response);
    }
    else {
        // 报错，如果是页面没找到的话，这里会是"Not Found"
        console.error(this.statusText);
    }
}
```

因此，一个简单的发起ajax请求的代码如下：

```
//细节注释已省略，请参照上面
//1、创建实例
var req = new XMLHttpRequest();

//2、状态变化处理函数，即ajax成功或失败都在这里处理
req.onreadystatechange = function () {
    if (this.readyState !== 4) {
        return;
    }
    if (this.status === 200) {
        console.log(this.response);
    }
    else {
        console.error(this.statusText);
    }
}

//3、建立连接
req.open(请求方式, URL);

//4、发送请求
req.send();
```

在上面，我给了一个可以跑起来的后端的github地址，有预设的get响应，建议大家自己通过以上代码去尝试一下。

---

##**手动封装ajax（简单版）**

###<span style='color:red'>1、目标</span>

像jquery那样，写一个类似以下的代码

    ajax(options).done(成功时执行的回调函数).fail(失败时执行的回调函数)
    
由于是初级版，我们不做过多的设置。只需要确保：

1、可以发起ajax请求，可以设置get或post方法，

2、在成功后可以通过自定义的相关回调函数来处理；

3、可以在失败后，通过另一个自定义的相关回调函数来处理；

###<span style='color:red'>2、功能实现</span>

1、首先看目标，ajax函数是主函数，他接受一个参数options，这里参数是一个对象，里面有url、type和data三个属性；

2、ajax函数的返回值，可以调用done方法和fail方法，因此他的返回值必然是一个对象，并且有这2个方法；

对于【1】中的情况，我们需要进行以下处理：

    1、由于是简单版，所以我们不用过多考虑错误处理的问题；
    2、检查options是否是对象；
    3、检查属性是否有url和type属性；
    4、如果有data属性，根据type来决定如何处理data属性；

对于【2】中的情况，我们需要进行以下处理：

    1、done和fail里面是一个回调函数，但该函数不会立刻执行，而是在异步请求完成后才执行；
    2、因此需要暂时将设置的这2个回调函数存储起来，只有在符合条件的情况下才执行；
    3、因此需要将这2个存储的回调函数放在req.onreadystatechange的函数中；
    4、让这2个函数在req.readyState的值为200时执行；
    5、需要区分成功和失败；
    

由于函数可以连写，可以我们必须先处理done和fail的问题，也就是【2】中的问题

####**1、对done和fail的初步处理**

连写的关键在于返回一个对象，并且每次执行时，返回的都是同一个对象；

且该对象需要具有done和fail两个函数属性（不然执行时会报错）；

更细节的解释清参照注释

```
var ajax = function (options) {
    //创建一个空对象，之后将返回它
    var obj = {};
    
    //分别表示成功和失败时，执行函数的变量
    var success = function () {

    };
    var fail = function () {

    };
    
    //设置空对象的done和fail方法，确保能执行起来
    //由于可以连写，因此确保done和fail两个方法，在执行后的返回值也需要是obj对象（不然无法连写了）
    //回调函数作为参数传入，赋值给内置的变量
    //注意，此时只是赋值，没有执行
    obj.done = function (success2) {
        success = success2;
        return obj;
    }
    obj.fail = function (fail2) {
        fail = fail2;
        return obj;
    }
    
    //...
    //一些中间省略掉的代码
    
    return obj;
}
```
当有以上代码时，可以至少那一串ajax函数执行完后不会报错了；

下来，我们开始处理options这个参数，首先检查参数是否合法

####**2、options的属性检查**

参数必须是对象，而包含type和url两个属性，且属性类型必须是字符串

```
//对象类型检查，首先要求参数必须是对象
//然后如果url或者type类型需要是字符串
//如果以上任何一个不通过，则报错
if (!(options instanceof Object) || (typeof options.url !== 'string') || (typeof options.type !== 'string')) {
    //给个报错的提示信息呗
    console.error("error arguments for ajax");
    return obj;
}
```

options属性我们已经处理了两个了，还有一个可选属性data；

虽然可选，但我们可不能忽视他的存在，下来处理这个data属性

####**3、data的处理**

首先没有data属性肯定就不处理了；

其次，data属性的类型很多，我们应支持尽可能多的种类；

第三，根据get或者post，我们应该将data以不同方式进行处理；

这个处理函数比较长，很多步已经简化处理；

如果是初学者，也可以直接跳过这部分内容，假装传的值一定是正常的（反正初学者肯定用jQuery等成熟库）

```
//只有有data属性的时候才需要进行处理，
if (typeof options.data !== 'undefined') {

    //假如data属性是一个函数，那么跳过，就当没有
    if (typeof options.data !== 'function') {

        // 假如类型是不是get，那么很好处理，因为都被放在请求体之中了
        // 直接通过JSON.stringify()方法转换使用
        // 记得，需要转为小写（因为可能用户是大写的）
        if (options.type.toLowerCase() !== 'get') {

            //默认有JSON.stringify()方法，如果没有则报错
            if (typeof JSON.stringify !== 'function') {
                console.error("can't use JSON.stringify(), so can't Ajax by post when type of data is object");
                return obj;
            }

            //通过内置方法转为JSON字符串
            var data = JSON.stringify(options.data);
        } else {

            //此时请求类型必然是get
            //为了简化，我们这么处理
            //当data类型是对象时，以key1=val1&key2=val2这样拼接起来
            //当data类型为字符串或数字时，直接添加到url后；
            //当data类型为其他时，不发起请求并报错
            if (typeof options.data === 'string' || typeof options.data === 'number') {
                var data = options.data;
            } else if (options.data instanceof Object) {

                //一个临时数组，用于存放拼接的字符串
                var tempArray = [];

                //注意，由于data可能有某属性也是对象或数组或其他类型；
                //我们的处理方案是，假如某属性是对象、数组、函数，则直接跳过就当没有
                //其他则添加到我们的字符串中
                for (var k in options.data) {
                    if (typeof options.data[k] !== 'object' && typeof options.data[k] !== 'function') {
                        tempArray.push(k + "=" + options.data[k]);
                    }
                }

                //有长度的话则拼接起来
                if (tempArray.length > 0) {
                    var data = tempArray.join("&");
                }
            }
        }
    }
}
```

在这一步完成后，我们可能遇见三种情况：

    1. 有data属性，那么data属性必然是字符串；
       区别要么是json字符串（提供给非get请求），或者kv拼接字符串（提供给get请求的url使用）；
    2. 要么没data属性，data的值为undefined；
    3. 甚至直接报错返回，那么跟之后的内容无关；
    3. 于是data情况简单，方便之后处理使用

####**4、该创建ajax实例了**

我们需要创建一个XMLHttpRequest的实例，用于发起ajax请求；

创建这个对象总共需要四步，我们先处理前两步：

第一步创建XMPHttpRequest()实例很简单；

而第二步也不难，因为处理函数只需要执行用户传入的回调函数即可，如代码：

```
var req = new XMLHttpRequest();

req.onreadystatechange = function () {
    console.log(this);
    //当属性值不是4的时候，说明ajax没有完成，因此返回不做处理
    if (this.readyState !== 4) {
        return;
    }

    //  当ajax的请求完成后，status状态码会发生改变
    //  其值来源于Http的头部的Status Code属性
    //  可以打开chrome控制台，查看network；
    //  然后选择一项请求后查看Headers选项卡中，General中的Status Code属性
    //  当值为200时，说明成功获取，否则失败
    if (this.status === 200) {

        //success是用户自己写的处理回调函数，我们将返回值作为参数传递
        //并执行用户自定义的回调函数
        success(this.response);
    }
    else {

        //fail则是用户写的失败处理函数，同样将错误文本作为参数传递，并执行之
        fail(this.statusText);
    }
}
```

####**5、设置请求链接并传递数据**

最后，我们需要设置用户请求的链接，请求类型；

以及将数据（乳沟有的话）作为参数传递给服务器；

注意，数据需要根据用户的请求方式决定如何传递；

唯一需要注意的是，当以post等方式发起ajax请求时，我们需要设置一下请求头的Content-Type属性，告诉服务器我们发送的是JSON字符串

```
//区分请求方式，决定data数据的传递方法
if (options.type.toLowerCase() === 'get') {

    //当是get请求时，数据是作为url链接传递给字符串的
    if (typeof data !== 'undefined') {

        //但前提是data，设置url，第三个参数true或者默认值表示是异步
        req.open(options.type, options.url + "?" + data, true);

        //发送请求，并返回
        req.send();
    } else {

        //直接设置url即可
        req.open(options.type, options.url, true);

        //发送请求，并返回
        req.send();
    }
} else {

    //非get方式时，data处理都是一样的，即放在请求体之中
    //先设置url
    req.open(options.type, options.url, true);

    //然后查看data是否存在
    if (typeof data !== 'undefined') {

        //如果存在，那么显然是JSON格式字符串（因为我们前面已经处理过了）

        //但是在发送前，我们需要设置一下请求头的Content-Type属性，告诉服务器我们发送的是一个json
        req.setRequestHeader("Content-Type", "application/json");

        //然后再发送
        req.send(options.data)
    } else {
        //不然直接发送就行
        req.send();
    }
}
```

最后，由于顺利的设置完了，因此返回obj对象，以确保ajax函数的连写不会报错

```
//最终返回obj对象
return obj;
```

###<span style='color:red'>3、总结</span>

回顾一下我们做了些什么事情：

1、为了确保可以连写，我们返回了一个符合要求的对象，具有两个同名函数；

2、并且在执行同名函数时，将用户传递的回调函数赋值给我们用于处理请求时所执行的两个函数；

3、验证了ajax发起时传入的参数，确保他是合法的；

4、将data属性正确的加入了发起的请求之中；

5、成功的发起了请求；

目前仍存在的问题：

1、不支持用户自定义是否将返回结果变为对象，目前只能默认保持原样；

2、对报错信息处理的不全；

3、对请求头缺少自定义设置功能；

以下是代码的github链接：

https://github.com/qq20004604/a-ajax-project-for-learner

封装了该方法的html文件是：

https://github.com/qq20004604/a-ajax-project-for-learner/blob/master/public/XMLHttpRequest.html


##**对下一步的计划**

初级封装和中级高级封装的区别，我认为在于以下几点：

1、更强的错误识别；
2、更多的关于头部的设置，以及请求头、响应头的识别、设置和归类；
3、简易方法的支持；
4、跨域；
5、以及其他；

简单来说，就是让你的ajax更像jQuery封装好的ajax。

当然，更全面的另一面就是，更笨重，更复杂。

所以应该根据实际需要而写。
