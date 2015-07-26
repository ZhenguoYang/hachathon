define('SubmitView', [
    "jquery",
    "backbone"
], function($, Backbone) {
    var submitView = Backbone.View.extend({
        el: '.submit-page',
        events: {
            "click .btn-submit" : "submitGoods"
        },
        initialize: function() {
//            var self = this;
//            setTimeout(function(){
//                $(".btn-submit").onclick = self.submitGoods;
//            }, 1000);
            return this;
        },
        render: function() {
            this.delegateEvents(this.events);
            return this;
        },
        submitGoods: function() {
//            alert($("#select-catg").val());
//            alert($("#textinput-title").val());
//            alert($("#textarea-desc").val());
//            alert($("#select-duration").val());
            /*
             *   1: string goodsId,
  2: i32 catg,
  3: i32 subcatg,
  4: string title,
  5: string body,
  6: double x,
  7: double y,
  8: i64 endtime,
             */
            var goodsId = randomChar(8);
            var subcatg = $("#select-catg").val() - 0;
            var catg = Math.floor(subcatg / 10000);
            var title = $("#textinput-title").val();
            var body = $("#textarea-desc").val();
            var endtime = $("#select-duration").val() - 0;
            console.log(endtime);
            $.ajax({
                url: '/goods/submit',
                type: "POST",
                data: {
                    goodsId: goodsId,
                    catg: catg,
                    subcatg: subcatg,
                    title: title,
                    body: body,
                    endtime: endtime,
                    x: 13535669.25,
                    y: 3637212.63
                }
            }).done(function(msg){
                //console.log(msg);
                //alert("success");
                $.mobile.navigate("#home");
            });
        }
    });
    return submitView;

});