define('StartView', [
    "jquery",
    'underscore',
    "backbone",
    "md5",
    "text!templates/goods.html"
], function($, _, Backbone, md5, tpl) {
    var StartView = Backbone.View.extend({
        el: '.home-page',
        events: {
            //'click .search-btn': "keywordsSearch",
            //'keyup #input-search': "onKeywordsInput",
            //'click .catg-ul>li': "onCatgClick",
            //'click .goods-card': "onGoodsClick",
	    //'vclick .sendmsg-btn': 'sendChatMsg',
	    //'tap .sendmsg-btn': 'sendChatMsg',
	    //'vclick #chatSendButton': 'sendChatMsg',
        },    
        initialize: function() {
            this.template = _.template(tpl);
            this._baseAvatarUrl = "http://www.gravatar.com/avatar/";
	    $(".sendmsg-btn").bind("tap", _.bind(this.sendChatMsg, this));
	    serverConnection.onmessage = _.bind(this.receiveChatMsg, this);
	    $("#startpage").bind("pageshow", function(){
	        alert("hello page");
	    });
	    $("#startpage").bind("pageinit", function(){
	        alert("init page");
	    });
	    $(document).on("pageshow", "#startpage", function () {
                alert("pageshow");
	    });
	    //console.log("StartView init");
            //this._location = "x:[" + 13530669 + " TO " + 13540669 + "] "+
            // "AND y:[" + 3632212 + " TO " + 3642212 + "] AND ";
        },
        render: function() {
	    console.log("startview render");
            var self = this;
            this.delegateEvents(this.events);
            return this;
        },
        receiveChatMsg: function(evt) {
	    console.log(evt);
	    console.log(arguments);
	    console.log(evt.data);
	    try {
                msg = JSON.parse(evt.data);
            } catch(e) {
                console.log(e);
	    }
            if (msg.type == 'CHATMSG' && this._msgId !== msg.id) {
                this.onChatMsg(msg.value, false);
            }
        },
	sendChatMsg: function(evt) {
            var $msg = $('.msg-input');
            var val = $msg.val();
            if (val) {
                this._msgId = randomChar(10);
                var self = this;
	        serverConnection.send(JSON.stringify({
		    type: "CHATMSG",
		    id: self._msgId,
		    value: val
		}));	
		/*
                this.socket.sendMessage({
                    type: 'CHATMSG',
                    value: val
                });
		*/
		
                //this.onChatMsg(val, Math.random() > 0.5);
                this.onChatMsg(val, true);
            }
            $('.msg-input').val('');
        },
        onChatMsg: function(msg, self) {
            console.log("onChatMsg:" + msg);
            if (!self) {
                //this.$el.find('audio')[0].play();
            }
            var s = self ? 'self' : 'other';
            var n = self ? this.getMe() : this.getYou();
            var t = getCurDatetime();
            //目前还没有用到图片所以
            //var msgStr = dealMsgStr(msg);
            var msgStr = msg;
            var avatarLab = '<div class="chat-avatar">' + n + '</div>';
            var msgDiv = '<div class="chat-content"><div class="chat-content-inner">' +
                    '<div class="chat-msg">' + msgStr + '</div>' +
                    '<div class="chat-time" title="' + t[1] + '">' + t[0] + '</div>' +
                    '</div></div>';
            var $msgCon = $('<div class="chat-container">' + avatarLab + msgDiv + '</div>');
            if (self) {
                $msgCon.addClass('chat-container-self');
            }
            $('.msg-div').append($msgCon);
            //结束
            /*
             var img = '<img align="middle" class="chat-avatar ' + s + '" alt="' + n + '"></img>';
             var time = '<div class="chat-datetime" title="'+t[1]+'">' + t[0] + '</div>';
             msg = $('<div></div>').text(msg).html();
             msg = '<div class="chat-content ' + s + '-content"><div class="chat-msg">' + msg +
             '</div>' + time + '</div>';
             var $el = $('<div class="chat-container">' + img + msg + '</div>');
             if (self) {
             $el.addClass('pullRight');
             } else {
             $el.addClass('pullLeft');
             }
             //$el.css('clear', 'both');
             //console.log($el);
             $('.msg-div').append($el);
             */
            var el = $('.msg-div')[0];
            //el.scrollTop = el.scrollHeight;
        },
	getMe: function() {
            //var ret = this.me ? this.me[0] : 'P';
            //return ret;
            var url = this._baseAvatarUrl + this._myHash + "?s=32&d=wavatar";
            return "<img src='" + url + "'>";
        },
	getYou: function() {
            //var ret = this.you ? this.you[0] : 'B';
            //return ret;
            var url = this._baseAvatarUrl + this._yourHash + "?s=32&d=wavatar";
            return "<img src='" + url + "'>";
        },
        onKeywordsInput: function(evt) {
            if (evt.keyCode === 13 && this.$el.find("#input-search").val()) {
                evt.preventDefault();
                return this.keywordsSearch(this.$el.find("#input-search").val());
            }
        },
        onCatgClick: function(evt) {
            this.commonSearch($(evt.currentTarget).attr("data-value") - 0);
            this.$el.find("#catgpanel").panel("close");
        },
        keywordsSearch: function(keywords) {
            var self = this;
            var filter = this._location + '(title:"' + keywords + '" OR body:"' + keywords + '")';
            $.ajax({
                url: '/goods/search',
                type: "GET",
                data: {
                    filter: filter
                }
            }).done(function(objs){
                self.refreshGoods(objs);
            });
        },
        commonSearch: function(catg) {
            var self = this;
            var filter = this._location + (catg < 10 ? "catg:" : "subcatg:") + catg;
            $.ajax({
                url: '/goods/search',
                type: "GET",
                data: {
                    filter: filter
                }
            }).done(function(objs){
                self.refreshGoods(objs);
            });
        },
        refreshGoods: function(objs) {
            this._goods = objs;
            $("#listview-goods li").remove();
            for (var i = 0, len = objs.length; i < len; i ++) {
                this.insertOneGoods(i, objs[i]);
            }
            $("#listview-goods").listview("refresh");
            this.delegateEvents(this.events);
        },
        insertOneGoods: function(index, goods) {
            goods.index = index;
            goods.imgHash = md5(goods.title);
            goods.dist = Math.floor(Math.sqrt(Math.pow(goods.x - 13535669, 2) + Math.pow(goods.y - 3637212, 2))); 
            //console.log(goods.imgHash);
            var html = this.template({g: goods});
            $("#listview-goods").append(html);
            
        },
        onGoodsClick: function(evt) {
            var index = $(evt.currentTarget).attr("data-value") - 0;
            $(".goods-info-title").text(this._goods[index].title);
            $(".goods-info-body").text(this._goods[index].body);
            $('.goodsinfo-popup').popup("open");
            //alert("Hello world");
        }
    });

    function getCurDatetime() {
        var t, s;
        var D = new Date();
        var year = D.getFullYear();
        var month = getNum(D.getMonth() + 1);
        var date = getNum(D.getDate());
        var hour = getNum(D.getHours());
        var min = getNum(D.getMinutes());
        var sec = getNum(D.getSeconds());

        t = hour + ":" + min;
        s = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;

        return [t, s];

        function getNum(num) {
            if (num < 10) {
                num = '0' + num;
            } else {
                num += '';
            }
            return num;
        }
    }
    return StartView;

});
