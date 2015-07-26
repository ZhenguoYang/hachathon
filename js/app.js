// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
    'router' // Request router.js
], function($, _, Backbone, Router) {
    var initialize = function() {
        // Pass in our Router module and call it's initialize function
        // Prevents all anchor click handling
        $.mobile.linkBindingEnabled = false;

        // Disabling this will prevent jQuery Mobile from handling hash changes
        $.mobile.hashListeningEnabled = false;
        Router.initialize();
    };

    return {
        initialize: initialize
    };
});

function randomChar(l) {
    var x = "123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
    var tmp = "";
    for (var i = 0; i < l; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return tmp;
}

