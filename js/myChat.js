var MyChat = function() {
    //图片轮播
    this.picSlide = function(url, picurl, content) {
        var pic = '<li><a href="' + url + '"><img src="' + picurl + '"></a><div class="slide-desc">' + content + '</div></li>'
        return pic;
    };
    //列表文本
    function tabContent(url, srcurl, title, subContent) {
        var data = '<a href="' + url + '" class="weui_media_box weui_media_appmsg">' +
            '<div class="weui_media_hd weui-updown"><img class="weui_media_appmsg_thumb lazyload" src="' + srcurl +
            '"></div><div class="weui_media_bd">' +
            '<h4 class="weui_media_title">' + title + '</h4><p class="weui_media_desc">' + subContent + '</p></div></a>';
        return data;
    }

    //加载数据时显现
    this.fadeIn = function() {
        $('.weui-loadmore').css('display', 'block');
    };

    //加载数据后隐藏
    this.fadeOut = function() {
        $('.weui-loadmore').css('display', 'none');
    };
    //上拉下拉加载数据
    this.updownList = function(page, size) {
        $('.weui_panel').dropload({
            scrollArea: window,
            autoLoad: true, //自动加载
            domDown: { //上拉
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh f15 "><i class="icon icon-20"></i>上拉加载更多</div>',
                domLoad: '<div class="dropload-load f15"><span class="weui-loading"></span>正在加载中...</div>',
                domNoData: '<div class="dropload-noData">暂无数据</div>'
            },
            domUp: { //下拉
                domClass: 'dropload-up',
                domRefresh: '<div class="dropload-refresh"><i class="icon icon-114"></i>下拉刷新</div>',
                domUpdate: '<div class="dropload-load f15"><i class="icon icon-20"></i>释放更新...</div>',
                domLoad: '<div class="dropload-load f15"><span class="weui-loading"></span>正在加载中...</div>'
            },
            loadDownFn: function(me) { //加载更多
                page++;
                window.history.pushState(null, document.title, window.location.href);
                var result = '';
                $.ajax({
                    type: 'GET',
                    url: 'http://ons.me/tools/dropload/json.php?page=' + page + '&size=' + size,
                    dataType: 'json',
                    success: function(data) {
                        var arrLen = data.length;
                        if (arrLen > 0) {
                            for (var i = 0; i < arrLen; i++) {
                                var url = data[i].link;
                                var srcurl = data[i].pic;
                                var title = data[i].title;
                                var subContent = data[i].title;
                                result += tabContent(url, srcurl, title, subContent);
                            }
                            // 如果没有数据
                        } else {
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        $('.weui_panel_bd').append(result);
                        var lazyloadImg = new LazyloadImg({
                            el: '.weui-updown [data-img]', //匹配元素
                            top: 50, //元素在顶部伸出长度触发加载机制
                            right: 50, //元素在右边伸出长度触发加载机制
                            bottom: 50, //元素在底部伸出长度触发加载机制
                            left: 50, //元素在左边伸出长度触发加载机制
                            qriginal: false, // true，自动将图片剪切成默认图片的宽高；false显示图片真实宽高
                            load: function(el) {
                                el.style.cssText += '-webkit-animation: fadeIn 01s ease 0.2s 1 both;animation: fadeIn 1s ease 0.2s 1 both;';
                            },
                            error: function(el) {

                            }
                        });
                        // 
                        // 每次数据加载完，必须重置
                        me.resetload();
                    },
                    error: function(xhr, type) {
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
            }
        });
    };
    //预览图片
    this.previewImage = function(files) {
        var MAXWIDTH = 100;
        var MAXHEIGHT = 200;
        for (var i = 0; i < files.length; i++) {
            if (files && files[i]) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    $('#imgUpload').append('<li onclick="delimg(this)" class="weui_uploader_file" style="background-image:url(' + evt.target.result + ')"></li>');
                };
                reader.readAsDataURL(files[i]);
            }
        }
    };
    //上传图片
    this.up_ajax = function(img, type, url) {
        $.ajax({
            url: url,
            type: 'post',
            data: {
                'img': img
            },
            async: true,
            error: function() {
                alert('上传失败');
            },
            success: function() {
                alert('上传成功');
            }
        });
    };
    return this;
};