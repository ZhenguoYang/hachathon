define('ChatView', [
    'jquery',
    'underscore',
    'AbstractView',
    'md5',
    'text!templates/chat.html',
    'i18n!nls/locale'
], function($, _, AbstractView, md5, tpl, Locale) {

    var chatView = AbstractView.extend({
        initialize: function(options) {
            this._baseAvatarUrl = "http://www.gravatar.com/avatar/";
            this._initialize(options);
            this.template = _.template(tpl);
            this.socket.on('chatMsg', _.bind(this.onChatMsg, this));
            this.socket.on('change:myname', _.bind(this.setMe, this));
            this.socket.on('change:yourname', _.bind(this.setYou, this));
        },
        events: {
            'keypress .msg-input': "sendChatMsg"
        },
        render: function() {
            $(this.el).html(this.template({l: Locale.chat}));
            var klass;
            if (this.options.type === 'code') {
                klass = 'code-chat';
            } else {
                klass = 'group-chat';
            }
            this.$el.find('.msg-div').addClass(klass);
            this.delegateEvents(this.events);
            return this;
        },
        sendChatMsg: function(evt) {
            if (evt.type === 'keypress' && evt.keyCode !== 13) {
                return;
            }
            var $msg = $('.msg-input');
            var val = $msg.val();
            if (val) {
                this.socket.sendMessage({
                    type: 'CHATMSG',
                    value: val
                });
                //this.onChatMsg(val, Math.random() > 0.5);
                this.onChatMsg(val, true);
            }
            $('.msg-input').val('');
        },
        onChatMsg: function(msg, self) {
            if (!self) {
                this.$el.find('audio')[0].play();
            }
            var s = self ? 'self' : 'other';
            var n = self ? this.getMe() : this.getYou();
            var t = getCurDatetime();
            //目前还没有用到图片所以
            var msgStr = dealMsgStr(msg);
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
            el.scrollTop = el.scrollHeight;
        },
        setMe: function() {
            this.me = this.socket.get('myname');
            this._myHash = md5(this.me);
        },
        getMe: function() {
            //var ret = this.me ? this.me[0] : 'P';
            //return ret;
            var url = this._baseAvatarUrl + this._myHash + "?s=32&d=wavatar";
            return "<img src='" + url + "'>";
        },
        setYou: function(you) {
            this.you = this.socket.get('yourname');
            this._yourHash = md5(this.you);
        },
        getYou: function() {
            //var ret = this.you ? this.you[0] : 'B';
            //return ret;
            var url = this._baseAvatarUrl + this._yourHash + "?s=32&d=wavatar";
            return "<img src='" + url + "'>";
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
    function dealMsgStr(text) {
        //URLs starting with http://, https://, or ftp://
        var reg1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        ;
        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        //var reg2 = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        //Change email addresses to mailto:: links.
        var reg3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;

        var linkAry = getLinkAry();
        sortLinkAry();

        return dealText();

        function getLinkAry() {
            var linkAry = [];
            text.replace(reg1, function(a, b, index) {
                var len = a.length;
                var tag = '<a href="' + a + '" target="_blank">' + a + '</a>';
                linkAry.push([index, len, tag]);
            });
//			text.replace(reg2, function(a, b, index) {
//				var len = a.length;
//				var tag = '<a href="http://' + a + '" target="_blank">' + a + '</a>';
//				linkAry.push([index, len, tag]);
//			});
            text.replace(reg3, function(a, b, index) {
                var len = a.length;
                var tag = '<a href="mailto:' + a + '">' + a + '</a>';
                linkAry.push([index, len, tag]);
            });

            return linkAry;
        }
        function sortLinkAry() {
            if (!linkAry.length)
                return;
            var tmp;
            for (var i = 0; i < linkAry.length - 1; i++) {
                for (var j = 0; j < linkAry.length - i - 1; j++) {
                    if (linkAry[j][0] > linkAry[j + 1][0]) {
                        tmp = linkAry[j];
                        linkAry[j] = linkAry[j + 1];
                        linkAry[j + 1] = tmp;
                    }
                }
            }
        }
        function dl(str) {
            return $('<div></div>').text(str).html();
        }
        function dealText() {
            var msgstr = '';
            var curIndex = 0;
            var substr;
            if (!linkAry.length) {
                msgstr = dl(text);
            } else {
                for (var i = 0; i < linkAry.length; i++) {
                    if (curIndex < linkAry[i][0]) {
                        substr = text.substring(curIndex, linkAry[i][0]);
                        msgstr += dl(substr);
                    }
                    msgstr += linkAry[i][2];
                    curIndex = linkAry[i][0] + linkAry[i][1];
                    if (i == linkAry.length - 1 && curIndex < text.length) {
                        substr = text.substring(curIndex, text.length);
                        msgstr += dl(substr);
                    }
                }
            }

            return msgstr;
        }

    }


    return chatView;
});
