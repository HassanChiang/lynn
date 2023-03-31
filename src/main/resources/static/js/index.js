window.showTutorial = function () {
    swal({
        title: "使用说明"
        , html: true
        , confirmButtonText: "知道了"
        , text: "<ul>" +
            "    <li><strong>单击鼠标左键</strong>: 逆时针旋转图形（向左旋转）</li>" +
            "    <li><strong>单击鼠标右键</strong>: 顺时针旋转图形（向右旋转）</li>" +
            "    <li><strong>按住CTRL，然后点击鼠标左键进行图形翻转</strong></li>" +
            "    <li><strong>长按鼠标左键进行图形移动</strong></li>" +
            "</ul>" +
            "<div class='made-with-heart'>" +
            // "    <span class='octicon octicon-pencil'></span>修改着作者：Lynn， Based on <span class='octicon octicon-heart'></span> by <a href='http://ionicabizau.net'>Ionică Bizău</a>" +
            "</div>"
    })
};

function eventBind(c, x, y) {
    var moved = false;
    var angle = 0;
    var cPol = c.children()[0];
    c.translate(x, y);
    c.draggy();


    var oldPosi = "";
    c.on("dragmove", function (e) {
        var newPosi = $("#" + this.node.id).attr("transform");
        if (oldPosi != newPosi) {
            moved = true;
        }
        e.preventDefault();
    });


    cPol.on("mousedown touchstart", function (e) {
        moved = false;
        oldPosi = $("#" + this.node.id).parent().attr("transform");
        e.preventDefault();
    });

    // document.body.addEventListener('touchmove', function (e) {
    //   e.preventDefault();
    // }, { passive: false });

    cPol.on("mouseup touchend", function (e) {
        //移动到最前面
        $("#elements").append($("#" + this.node.id).parent());
        if (!moved) {
            var t = this.node.style.transform;

            if (e.ctrlKey) {
                this.node._scale = (this.node._scale || 1) === 1 ? -1 : 1;
            } else {
                angle += (e.button === 2 ? 1 : -1) * 15;
            }

            Crossy(this.node, "transform", "rotate(" + angle + "deg) scaleX(" + (this.node._scale || 1) + ")");
        }
        moved = false;
        e.preventDefault();
    });

    cPol.on("contextmenu", function (e) {
        e.preventDefault();
    });
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
}

window.addEventListener("load", function () {


    let min = window.innerWidth * 0.02;
    let widthSpace = 0.2;
    let ua = navigator.userAgent;

    let isAndroid = ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1;
    let isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    let isWeixin = ua.indexOf("MicroMessenger") > 0; //是否微信
    let isMobile = isAndroid || isIOS || isWeixin;
    let svgHeight = "150%";
    if (isMobile) {
        min = window.innerWidth * 0.04;
        widthSpace = 0.3;
        svgHeight = "100%";
    }

    var t = new SVG(document.querySelector(".graph")).size("100%", svgHeight);
    var elements = t.group().id("elements");

    var colors = ["#e74c3c", "#f7a1ed", "#2ecc71", "#f1c40f", "#3498db"];
    var shapeSize = [min, min * 2, min * 3, min * 4];

    var shapes = [];
    var num = 0;
    for (let i = 0; i < 3; i++) {
        for (let cm = 0; cm < shapeSize.length; cm++) {
            for (let col = 0; col < colors.length; col++) {
                var shapeA = elements.group();
                if (i == 0) {
                    //画三角形
                    shapeA.polygon("0,0 " + shapeSize[cm] + "," + shapeSize[cm] + " " + shapeSize[cm] + ",0").fill(colors[col]);
                    eventBind(shapeA, col * 30 + window.innerWidth * 0.01, cm * 30 + 10);
                } else if (i == 1) {
                    //画正方形
                    shapeA.polygon("0,0 0," + shapeSize[cm] + " " + shapeSize[cm] + "," + shapeSize[cm] + " " + shapeSize[cm] + ",0").fill(colors[col]);
                    eventBind(shapeA, col * 30 + window.innerWidth * widthSpace, cm * 30 + 10);
                } else if (i == 2) {
                    //画圆
                    shapeA.circle(shapeSize[cm]).fill(colors[col]);
                    eventBind(shapeA, col * 30 + window.innerWidth * widthSpace * 2, cm * 30 + 10);
                }
                shapes[num] = shapeA;
                num++;
            }
        }
    }

    Crossy("polygon", "transformOrigin", "center");
    Crossy("polygon", "transformBox", "fill-box");
    Crossy("polygon", "transition", "all 500 ease");

    $(".save-btn").click(function () {
        let name = $("#chineseName").val();
        if (!name) {
            alert("请输入您的名字哟~");
            return;
        }
        let mobile = $("#mobile").val();
        if (!mobile) {
            alert("请输入一下手机号吧，谢谢~");
            return;
        }
        let desc = $("#desc").text();
        if (!desc.trim()) {
            alert("没有描述呀");
            return;
        }
        $(".save-btn").attr("disabled", "disabled");
        var waitSeconds = 0;
        let intervalA = setInterval(function () {
            $(".save-btn").html("正在上传，请稍等... " + (waitSeconds++) + "s");
            if (waitSeconds >= 60) {
                clearInterval(intervalA);
                alert("网络太慢了，上传失败，麻烦手动截图发我吧，/(ㄒoㄒ)/~~，谢谢！");
            }
        }, 1000);
        var pro = $("#profession").val();
        pro = pro ? pro : "无专业";
        html2canvas(document.body).then(function (canvas) {
            canvas.toBlob(function (blob) {
                const formData = new FormData();
                formData.append('file', blob, formatDate(new Date()) + "_" +
                    name + "_" + mobile + "_" + pro + '.png');
                fetch('/upload', {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    alert("发送成功！");

                    $(".save-btn").removeAttr("disabled");
                    $(".save-btn").html("已提交");
                    clearInterval(intervalA);

                    console.log('Upload successful');
                }).catch(error => {
                    alert("操作失败了，麻烦手动截图发送吧，/(ㄒoㄒ)/~~！");

                    $(".save-btn").removeAttr("disabled");
                    $(".save-btn").html("提交失败，点我重新提交！");
                    clearInterval(intervalA);

                    console.error('Error uploading file:', error);
                });
            });
        });
    });
});
