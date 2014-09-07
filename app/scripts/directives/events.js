'use strict';

angular.module('gdgxHubApp.directives.events', ['google-maps', 'gdgxHubApp.directives.moment'])
   .directive('eventMap', ['$http', function($http) {
      return {
        restrict: 'EA',
        templateUrl: 'directives/events_map',
        scope: {
          tag: "@",
          map: "="
        },
        link: function($scope, element, attrs) {
          $scope.events = [];
          
          $scope.markersEvents = {
            click: function (gMarker, eventName, model) {
              $scope.$apply(function() {
                model.show = !model.show;
              })
            }
          };
          
          $scope.$watch('tag', function(newVal) {
            if(newVal) {
              $http.get("/api/v1/events/tag/"+$scope.tag+"/upcoming?perpage=999").success(function(data) {
                data = data.items;
        
                for(var i = 0; i < data.length; i++) {
                  
                  if(data[i].geo) {
                    
                    var event = {
                      title: data[i].title,
                      id: data[i]._id,
                      geo: {
                        latitude: data[i].geo.lat,
                        longitude: data[i].geo.lng
                      },
                      start: new Date(data[i].start),
                      end: new Date(data[i].end),
                      show: false,
                      allDay: data[i].allDay,
                    }
                    
                    event.onClick = function() {
                      event.show = !event.show;
                    };
                    
                    $scope.events.push(event);
                  }
                }
              });  
            }
          });
        }
      };
   }]);