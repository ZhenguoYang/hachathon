define([
    'jquery',
    'jquerymobile',
    'underscore',
    'backbone',
    'md5',
    'StartView',
    'MapView',
    'SubmitView'
], function(
        $,
        jqm,
        _,
        Backbone,
        md5,
        StartView,
        MapView,
        SubmitView
    ) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'showStartPage',
            'home': 'showStartPage',
            'map': 'showMapPage',
            'submit': 'showSubmitPage',
	    'chatpage': 'showStartPage'
        },
        initialize: function() {
	    var self = this;
	    setTimeout(function(){
                self._evt = _.extend({}, Backbone.Events);
            }, 1000);
            //this.sessionModel = new SessionModel();
            //this.websocketModel = new WebsocketModel();
            //this.userModel = new UserModel();
        },
        showStartPage: function() {
            if (!this.startView) {
                this.startView = new StartView();
            }
            this.startView.render();
        },
        showMapPage: function() {
            if (!this.mapView) {
                this.mapView = new MapView();
            }
            this.mapView.render();
        },
        showSubmitPage: function() {
            if (!this.submitView) {
                this.submitView = new SubmitView();
            }
            var self = this;
            setTimeout(function(){
                self.submitView.render();
            }, 1000);
            //this.mapView.render();
        }
    });
    var initialize = function() {
        var appRouter = new AppRouter();
//        Backbone.View.prototype.goTo = function(loc) {
//            appRouter.navigate(loc, true);
//        };
//        
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
