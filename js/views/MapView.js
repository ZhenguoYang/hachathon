define('MapView', [
    "jquery",
    "backbone"
], function($, Backbone) {
    var mapView = Backbone.View.extend({
        initialize: function() {
        },
        render: function() {
            function getLocation(){
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(showLocation);
                }
                else {
                    alert("Geolocation is not supported by this browser.");
                }
            }
            function showLocation(position) {
                console.log(position);
                var map = new BMap.Map("mapcontainer");            // 创建Map实例
                var point = new BMap.Point(position.coords.longitude, position.coords.latitude);    // 创建点坐标
                map.centerAndZoom(point, 15);                     // 初始化地图,设置中心点坐标和地图级别。
                map.enableScrollWheelZoom();
            }
            getLocation();
            return this;
        }
    });
    return mapView;

});