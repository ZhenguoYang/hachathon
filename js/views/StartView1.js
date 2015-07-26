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
            'click .search-btn': "keywordsSearch",
            'keyup #input-search': "onKeywordsInput",
            'click .catg-ul>li': "onCatgClick",
            'click .goods-card': "onGoodsClick"
        },    
        initialize: function() {
            this.template = _.template(tpl);
            this._location = "x:[" + 13530669 + " TO " + 13540669 + "] "+
                    "AND y:[" + 3632212 + " TO " + 3642212 + "] AND ";
        },
        render: function() {
            var self = this;
            setTimeout(function(){
                self.commonSearch(1);
            }, 1000);
            this.delegateEvents(this.events);
            return this;
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
    return StartView;

});