var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/getForLearn', function (req, res, next) {
    res.send({
        name: "wang dong",
        age: 20,
        sex: "man"
    });
});

router.post('/postForLearnResByString', function (req, res, next) {
    var str = '';
    for (var i in req.body) {
        str += "key is " + i + "，value is " + req.body[i] + "\n";
    }
    res.send("你发送的内容：\n" + str);
});

router.post('/postForLearnResByObject', function (req, res, next) {
    console.log(req.body);
    var result = req.body;
    var obj = {};
    for (var i in result) {
        if (i.length <= 4)
            obj[i] = result[i];
    }
    res.send(obj);
});

module.exports = router;
