var mapUrl;
var ShowFrame4CCTV = new showFrame4CCTV();
var openUrlPath = 'https://apiatis.ntpc.gov.tw/atis-api/device/queryCCTVURL/'

//var openUrlPath = 'https://apiatis.ntpc.gov.tw/atis-api/device/queryActiCCTVURL/'
function showFrame4CCTV() {
    var me = this;
    this.getDeviceUrlMap = function (dev, div_id) {
        var dfd = $.Deferred()
        $.when(
            me.getOpenData(dev)
        ).always(function (res) {
            if (res.data) {
                me.setCCTVUrl(res.data.url, div_id, dev);
            } else {
                me.setCCTVUrl(res.data, div_id, dev);
            }
            dfd.resolve()
        })
        return dfd.promise()

    }
    this.setCCTVUrl = function (url, div_id, dev) {
        /***
         * flv 方式呈現
         */
        var md = new MobileDetect(window.navigator.userAgent);
        var cctvUrl = url
        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome')
        if (url) {
            if (md.is('iPhone')) {
                cctvUrl = cctvUrl.replace("flv/", "")
                $(div_id).html('<img src=' + cctvUrl + ' style="width: 320px; height: 230px;display:block; margin:auto;"></iframe>');
            } else {
                $(div_id).html(
                    `<video id="videoElement" controls style="width: 100%;">
		               		Your browser is too old which doesn't support HTML5 video.
		                </video>`);
                if (flvjs.isSupported()) {
                    var videoElement = document.getElementById('videoElement');
                    var flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        url: url
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    new Promise(function (resolve) {
                        console.log('load');
                        flvPlayer.load();
                        resolve();
                    }).then(value => {
                        setTimeout(() => {
                            console.log('play')
                            flvPlayer.play();
                        }, 10000);
                    })
                }
            }
        } else {
            cctvUrl = IISI.BASEPATH + "images/atis/404.png"
            $(div_id).html('<img src=' + cctvUrl + ' alt="即時影像" style="width: 334px;' +
                'top: calc(50% - 59px);left: calc(50% - 166px);position: absolute;">')
        }
    }
    this.getOpenData = function (id) {
        var dfd = $.Deferred()
        var Ajaxurl = openUrlPath + id

        $.ajax({
            url: Ajaxurl,
            type: 'GET',
            timeout: 30000,
        })
            .done(function (res) {
                dfd.resolve(res)
            })
            .fail(function (e) {
                dfd.resolve()
                $.log.debug('取得openData失敗(' + Ajaxurl + ')' + e)
            })
        return dfd.promise()
    }

    this.QueryString = function (name) {
        var AllVars = mapUrl.attr('query');
        var Vars = AllVars.split("&");
        for (i = 0; i < Vars.length; i++) {
            var Var = Vars[i].split("=");
            if (Var[0].toLowerCase() == name.toLowerCase()) return Var[1];
        }
        return "";
    }
}
