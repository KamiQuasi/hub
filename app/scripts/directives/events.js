'use strict';

angular.module('gdgxHubApp.directives.events', [])
   .directive('map', ['$http', function($http) {
      return {
            restrict: 'EA',
            templateUrl: 'directives/events_map',
            scope: {
              tag: "=",
            },
            link: function(scope, element, attrs) {
              scope.$watch('gplusId', function(oldVal, newVal) {
                if(newVal) {
                     $scope.map_title = 'GDG DevFest'; // pull title from tags json
    $scope.map = {
      zoom: 2,
      ready: 0,
      control: {},
      center: {
        latitude: 19.988635,
        longitude: -9.987259
      }
    };

    $scope.data = {}
    $http.get("/api/v1/events/tag/"+$scope.tag +"?perpage=999").success(function(data, status, headers, config) {
      var eventsData = {
        data: []
      };
      for(var i = 0; i < data.items.length; i++) {
        var item = data.items[i];

        if(item.geo) {
           var marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.geo.lat, item.geo.lng)
              });
            eventsData.data.push(marker);
        }
      }
      $scope.eventsData = eventsData;
      $scope.map.ready++;
    });

    $http.get("/api/v1/events/tags").success(function(data, status, headers, config) {
      $scope.map.ready++;
    });

    $scope.$watch("map.control", function(newValue, oldValue) {
      if(newValue)
        $scope.map.ready++;
    });

    $scope.$watch("map.ready", function(newValue, oldValue) {
      if(newValue > 1) {
        $scope.gmap = $scope.map.control.getGMap();
        

        google.maps.event.addListenerOnce($scope.map.control.getGMap(), "idle", function(){
          // this is important, because if you set the data set too early, the latlng/pixel projection doesn't work
          var eventsData = $scope.eventsData;
          for(var i = 0; i < eventsData.data.length; i++) {
            var marker = eventsData.data[i];
            marker.setMap($scope.gmap);
          }
        });
      }
    });

                }
              });
            }
         };
   }]);